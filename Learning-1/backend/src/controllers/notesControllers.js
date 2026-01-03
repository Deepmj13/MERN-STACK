export const getAllNotes = (req, res) => {
  res.status(200).send("You fetched the get");
};

export const createNote = (req, res) => {
  res.status(201).json({ message: "POST Request / Create request" });
};

export const updateNote = (req, res) => {
  res.status(200).json({ message: "Put request/ Update Request" });
};

export const deleteNote = (res, req) => {
  res.status(200).json({ message: "Delete request" });
};
