// extract.js
const fs = require("fs");
const pdf = require("pdf-parse");

const pdfPath = "5346251801755842541week27.pdf";
const outPath = "outbreaks.json";

// Regex pattern to capture outbreak blocks
const outbreakPattern = /([A-Z]{2}\/[A-Z]+\/\d{4}\/\d+\/\d+)[\s\S]*?(?=(?:[A-Z]{2}\/|$))/g;

(async () => {
  try {
    console.log("📂 Reading PDF:", pdfPath);
    const dataBuffer = fs.readFileSync(pdfPath);

    console.log("📄 Extracting text...");
    const data = await pdf(dataBuffer);
    const text = data.text;

    let matches = text.match(outbreakPattern);
    let outbreaks = [];

    if (matches) {
      matches.forEach(entry => {
        let lines = entry.split("\n").map(l => l.trim()).filter(Boolean);

        // Build structured outbreak object
        let outbreak = {
          unique_id: lines[0].split(" ")[0] || null,
          disease: lines.find(l => l.toLowerCase().includes("chickenpox") || l.toLowerCase().includes("measles") || l.toLowerCase().includes("dengue")) || null,
          state: lines.find(l => l.toLowerCase().includes("state:"))?.replace(/state:/i, "").trim() || null,
          district: lines.find(l => l.toLowerCase().includes("district:"))?.replace(/district:/i, "").trim() || null,
          week: lines.find(l => l.toLowerCase().includes("week:"))?.replace(/week:/i, "").trim() || null,
          raw_text: lines.join(" ") // keep full text for reference
        };

        outbreaks.push(outbreak);
      });
    }

    fs.writeFileSync(outPath, JSON.stringify(outbreaks, null, 2), "utf8");
    console.log(`✅ Extracted ${outbreaks.length} structured outbreak records. Saved to ${outPath}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
