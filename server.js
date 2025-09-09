// server.js
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Read outbreaks.json (created from extract.js)
let outbreaks = [];
try {
  outbreaks = JSON.parse(fs.readFileSync("outbreaks.json", "utf8"));
  console.log(`✅ Loaded ${outbreaks.length} outbreak records`);
} catch (err) {
  console.error("❌ Error reading outbreaks.json:", err.message);
}

// Root route → return all outbreak data
app.get("/", (req, res) => {
  res.json(outbreaks);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Disease Outbreak API running at http://localhost:${PORT}`);
});
