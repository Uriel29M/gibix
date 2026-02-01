// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000; // ⚡ Porta dinâmica para Render

// ======== MIDDLEWARES ========
app.use(cors());
app.use(express.json());

// ======== PASTAS ========
const baseDir = "uploads";
const avatarDir = path.join(baseDir, "avatar");
const bannerDir = path.join(baseDir, "banner");

[baseDir, avatarDir, bannerDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ======== CONFIGURAÇÃO DO MULTER ========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "avatar") cb(null, avatarDir);
    else cb(null, bannerDir);
  },
  filename: (req, file, cb) => {
    // Sempre sobrescreve o arquivo antigo
    if (file.fieldname === "avatar") cb(null, "avatar.png");
    else cb(null, "banner.png");
  }
});

const upload = multer({ storage });
// Serve arquivos do frontend
app.use(express.static("public"));

// ======== ROTAS ========

// Rota teste
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


// Upload de avatar
app.post("/upload/avatar", upload.single("avatar"), (req, res) => {
  res.json({ imageUrl: `/uploads/avatar/avatar.png` });
});

// Upload de banner
app.post("/upload/banner", upload.single("banner"), (req, res) => {
  res.json({ imageUrl: `/uploads/banner/banner.png` });
});

// Servir imagens publicamente
app.use("/uploads", express.static(baseDir));

// ======== INICIAR SERVIDOR ========
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
