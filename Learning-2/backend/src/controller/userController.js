import User from "../models/User.js";

export const getAllUser = async (req, res) => {
  const users = User.find();
  if (!users) return res.status(500).json({ message: "Internal server error" });
  res.json(users);
};
