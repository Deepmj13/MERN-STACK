import Note from "../models/Note.js";

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json({ message: "New Note is created" });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
      title,
      content,
    });
    if (!updateNote) return res.status(404).json({ message: "Id not Found" });
    res.status(200).json({ message: "updateNote" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Id not Found" });
    res.status(200).json({ message: "Deleted !" });
  } catch (error) {
    console.error(error);
  }
};

export const getNotesById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Id not Found" });
    res.json({ message: note });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
