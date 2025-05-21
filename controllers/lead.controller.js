/** @format */

const {createSuccess} = require("../utils/response");
const Lead = require("../models/lead.model");
const fs = require("fs");
const csv = require("csv-parser");
const Attachment = require("../models/attachment.model");
const {create} = require("domain");

const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    return res.json(createSuccess("Lead created successfully", lead));
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const bulkcreateFromCsv = async (req, res) => {
  try {
    const leads = [];
    const filePath = req.file.path;
    const {workspace_id} = req.body;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // optional: sanitize or format each row
        leads.push({
          name: row.name || null,
          workspace_id,
          phone: row.phone || null,
          source: row.source || null,
          inhouse_division: row.inhouse_division || null,
          service_categories: row.service_categories || null,
          requirements: row.requirements || null,
          budget: row.budget || null,
          email: row.email || null,
          alternate_phone: row.alternate_phone || null,
          city_name: row.city_name || null,
          feedback: row.feedback || null,
          company_name: row.company_name || null,
        });
      })
      .on("end", async () => {
        try {
          await Lead.bulkCreate(leads);
          res
            .status(200)
            .json(createSuccess("Leads uploaded successfully", leads));
        } catch (dbError) {
          console.error("DB Error:", dbError);
          res
            .status(500)
            .json({message: "Database error", error: dbError.message});
        } finally {
          fs.unlinkSync(filePath); // Clean up uploaded file
        }
      });
  } catch (error) {
    console.error("File parsing error:", error);
    res.status(500).json({message: "Server error", error: error.message});
  }
};

const getLeadById = async (req, res) => {
  try {
    const leadId = req.params.id;
    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({message: "Lead not found"});
    }

    return res.json(createSuccess("Lead retrieved successfully", lead));
  } catch (error) {
    console.error("Error retrieving lead:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const getAllLeadByWorkspaceId = async (req, res) => {
  try {
    const workspaceId = req.params.workspace_id;
    const leads = await Lead.findAll({
      where: {workspace_id: workspaceId},
      order: [["createdAt", "DESC"]],
    });

    return res.json(createSuccess("Leads retrieved successfully", leads));
  } catch (error) {
    console.error("Error retrieving leads:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const addAttachment = async (req, res) => {
  try {
    const {user_id, workspace_id, type, content, original_name} = req.body;

    const newAttachment = await Attachment.create({
      user_id,
      workspace_id,
      type,
      content,
      original_name,
    });

    res
      .status(201)
      .json(createSuccess("Attachment added successfully", newAttachment));
  } catch (err) {
    res
      .status(500)
      .json({success: false, message: "Error adding attachment", err});
  }
};

module.exports = {
  createLead,
  getLeadById,
  bulkcreateFromCsv,
  getAllLeadByWorkspaceId,
  addAttachment,
};
