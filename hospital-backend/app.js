import express from "express";
import cors from "cors";
import { db } from "./config/firebase-admin.js";
import { createNote, updateNote, deleteNote } from "./controllers/notes.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/test", async (req, res) => {
    try {
        const snapshot = await db.collection("notes").get();

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({
            message: "Firestore Working ✅",
            data
        });
    } catch (err) {
        console.error("Firestore Error:", err.message);
        res.status(500).send(err.message);
    }
});


app.get("/hospital", (req, res) => {
    res.json({ status: "ok", db: "connected" });
});


app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
