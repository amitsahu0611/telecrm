/** @format */

// /** @format */

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/"); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, "leads-" + Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({storage});

// module.exports = upload;

/** @format */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads folder exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive: true});
}

// Dynamic file naming strategy based on route/field
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let prefix = "file"; // default

    // You can use req.url or custom fieldname to set the prefix
    if (req.baseUrl.includes("leads")) {
      prefix = "leads";
    } else if (req.baseUrl.includes("attachments")) {
      prefix = "attach";
    }

    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Optional: add file size/type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 10 * 1024 * 1024}, // 10 MB
});

module.exports = upload;
