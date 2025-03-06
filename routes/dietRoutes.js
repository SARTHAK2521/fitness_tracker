const express = require("express");
const router = express.Router();
const fs = require("fs").promises; // Use promises for async handling
const path = require("path");

const dietsFile = path.join(__dirname, "../data/diets.json");

// Ensure JSON file exists
async function ensureFileExists() {
    try {
        await fs.access(dietsFile);
    } catch (error) {
        await fs.writeFile(dietsFile, "[]", "utf8");
    }
}
ensureFileExists(); // Run on startup

// ✅ Diet List Route
router.get("/", async (req, res) => {
    try {
        const data = await fs.readFile(dietsFile, "utf8");
        const diets = JSON.parse(data || "[]");

        console.log("📜 Diets from JSON:", diets); // Debugging
        res.render("diet", { diets });

    } catch (error) {
        console.error("❌ Error reading diet file:", error);
        res.render("error", { message: "Error loading diets!" });
    }
});

// ✅ Add Diet Page
router.get("/add", (req, res) => {
    res.render("addDiet");
});

// ✅ Add New Diet (POST)
router.post("/add", async (req, res) => {
    let { name, calories } = req.body;

    // Trim spaces & validate input
    name = name.trim();
    calories = calories.trim();

    if (!name || !calories || isNaN(calories)) {
        console.warn("⚠️ Invalid diet input:", req.body);
        return res.render("error", { message: "Please enter a valid diet name & calories!" });
    }

    try {
        const data = await fs.readFile(dietsFile, "utf8");
        let diets = JSON.parse(data || "[]");

        diets.push({ name, calories });

        await fs.writeFile(dietsFile, JSON.stringify(diets, null, 2));
        console.log("✅ Diet added successfully:", { name, calories });

        res.redirect("/diet");

    } catch (error) {
        console.error("❌ Error saving diet:", error);
        res.render("error", { message: "Error saving diet!" });
    }
});

module.exports = router;
