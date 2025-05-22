/** @format */

const {create} = require("html-pdf");
const Campaign = require("../models/Campaign.model");
const Lead = require("../models/lead.model");
const LeadCampaignMap = require("../models/LeadCampaignMap.model");
const {createError, createSuccess} = require("../utils/response");

const createCampaign = async (req, res) => {
  try {
    const {leadIds = [], ...campaignData} = req.body;

    const campaign = await Campaign.create(campaignData);

    if (leadIds.length > 0) {
      const leadCampaignData = leadIds.map((leadId) => ({
        campaign_id: campaign.id,
        lead_id: leadId,
      }));
      await LeadCampaignMap.bulkCreate(leadCampaignData);
    }

    res
      .status(201)
      .json(createSuccess("Campaign created successfully", campaign));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error creating campaign", error: error.message});
  }
};

const getAllCampaigns = async (req, res) => {
  const {id} = req.params;
  try {
    if (!id) {
      return res.status(400).json(createError("Workspace ID is required"));
    }
    const campaigns = await Campaign.findAll({
      where: {
        workspace_id: id,
      },
      include: {
        model: Lead,
        through: {attributes: []}, // exclude mapping fields
      },
    });

    res.json(createSuccess("Campaigns fetched successfully", campaigns));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error fetching campaigns", error: error.message});
  }
};

const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: {
        model: Lead,
        through: {attributes: []},
      },
    });

    if (!campaign)
      return res.status(404).json(createError("Campaign not found"));

    res.json(createSuccess("Campaign fetched successfully", campaign));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error fetching campaign", error: error.message});
  }
};

const updateCampaign = async (req, res) => {
  try {
    const {leadIds = [], ...campaignData} = req.body;
    const {id} = req.params;

    const campaign = await Campaign.findByPk(id);
    if (!campaign) return res.status(404).json({message: "Campaign not found"});

    await campaign.update(campaignData);

    if (leadIds.length) {
      await LeadCampaignMap.destroy({where: {campaign_id: id}});
      const mappings = leadIds.map((leadId) => ({
        campaign_id: id,
        lead_id: leadId,
      }));
      await LeadCampaignMap.bulkCreate(mappings);
    }

    res.json(createSuccess("Campaign updated successfully", campaign));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error updating campaign", error: error.message});
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id);

    await LeadCampaignMap.update(
      {is_delete: true, is_active: false},
      {where: {campaign_id: id}}
    );
    const deleted = await Campaign.update(
      {is_delete: true, is_active: false},
      {where: {id}}
    );

    if (!deleted)
      return res.status(404).json(createError("Campaign not found"));

    res.json(createSuccess("Campaign deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error deleting campaign", error: error.message});
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
