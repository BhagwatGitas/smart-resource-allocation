import { db } from "../config/firebase-admin.js";


export const createNote = async () => {
    const data = { title: "hello", content: "kam cho" };
    await db.collection("notes").add(data);
    console.log("Note created successfully");
}

export const updateNote = async (dataId, data) => {
    await db.collection("notes").doc(dataId).update(data)
    console.log("Note updated successfully");
}

export const deleteNote = async (dataId) => {
    await db.collection("notes").doc(dataId).delete();
    console.log("Note deleted successfully");
}