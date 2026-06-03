const multer = require("multer");
const fs = require("fs-extra");

fs.ensureDirSync("src/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );
  },
});

module.exports = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (
      tiposPermitidos.includes(file.mimetype)
    ) {
      return cb(null, true);
    }

    cb(new Error("Arquivo inválido"));
  },
});