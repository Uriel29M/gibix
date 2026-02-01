const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ======== PASTAS ========
const baseDir = "uploads";
const avatarDir = "uploads/avatar";
const bannerDir = "uploads/banner";

[baseDir, avatarDir, bannerDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// ======== CONFIGURAÇÃO DO MULTER ========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "avatar") cb(null, avatarDir);
    else cb(null, bannerDir);
  },
  filename: (req, file, cb) => {
    // SEMPRE SOBRESCREVE O ARQUIVO ANTIGO:
    if (file.fieldname === "avatar") cb(null, "avatar.png");
    else cb(null, "banner.png");
  }
});

const upload = multer({ storage });

// Rota teste
app.get("/", (req, res) => {
  res.send("Backend do GIBIX está funcionando 🚀");
});

// ======== UPLOAD DE AVATAR ========
app.post("/upload/avatar", upload.single("avatar"), (req, res) => {
  res.json({ imageUrl: "/uploads/avatar/avatar.png" });
});

// ======== UPLOAD DE BANNER ========
app.post("/upload/banner", upload.single("banner"), (req, res) => {
  res.json({ imageUrl: "/uploads/banner/banner.png" });
});

// Servir imagens publicamente
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
