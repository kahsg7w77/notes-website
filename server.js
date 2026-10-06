const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const notesFile = path.join(__dirname, "notes.txt");

app.use(express.json());
app.use(express.static(__dirname));

// Get all notes
app.get("/api/notes", (req, res) => {
    fs.readFile(notesFile, "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                return res.json([]);
            }

            return res.status(500).json({
                error: "Unable to read notes"
            });
        }

        try {
            const notes = data.trim() ? JSON.parse(data) : [];
            res.json(notes);
        } catch {
            res.status(500).json({
                error: "Invalid notes file"
            });
        }
    });
});

// Save notes
app.post("/api/notes", (req, res) => {
    const notes = req.body;

    fs.writeFile(
        notesFile,
        JSON.stringify(notes, null, 2),
        "utf8",
        (err) => {
            if (err) {
                return res.status(500).json({
                    error: "Unable to save notes"
                });
            }

            res.json({
                message: "Notes saved successfully"
            });
        }
    );
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});