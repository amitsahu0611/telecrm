/** @format */

// models/associateModels.js

const Campaign = require("./Campaign.model");
const Lead = require("./lead.model");
const LeadCampaignMap = require("./LeadCampaignMap.model");

const associateModels = () => {
  Lead.belongsToMany(Campaign, {
    through: LeadCampaignMap,
    foreignKey: "lead_id",
    otherKey: "campaign_id",
  });

  Campaign.belongsToMany(Lead, {
    through: LeadCampaignMap,
    foreignKey: "campaign_id",
    otherKey: "lead_id",
  });
};

module.exports = associateModels;
