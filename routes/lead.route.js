/** @format */

const express = require("express");
const {
  createLead,
  getLeadById,
  bulkcreateFromCsv,
  getAllLeadByWorkspaceId,
  addAttachment,
} = require("../controllers/lead.controller");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/createLead", createLead);
router.get("/getLeadById/:id", getLeadById);
router.get("/getAllLeadByWorkspaceId/:workspace_id", getAllLeadByWorkspaceId);
router.post("/bulk-upload", upload.single("upload"), bulkcreateFromCsv);
router.post("/add-attachment", upload.single("file"), addAttachment);

module.exports = router;
