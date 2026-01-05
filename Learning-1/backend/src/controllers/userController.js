import express from "express";
import User from "../models/User.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: users });
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (req, res) => {
  try {
    const { user, email } = req.body;
    // if (User.insertOne({ user, email })) {
    //   res.status(201).json({ message: "user created" });
    // }
    const createdeuser = User({ user, email });
    createdeuser.save();
    if (!createdeuser)
      return res.status(500).json({ message: "internal server error" });
    res.status(201).json({ message: `user created ${createdeuser}` });
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { user, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { user, email },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "user not found" });
    res.json({ message: "deleted" });
  } catch (error) {
    console.error(error);
  }
};
