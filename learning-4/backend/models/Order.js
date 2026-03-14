const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    contact: { type: String, required: true },
    formLink: { type: String, required: true },
    responses: { type: Number, required: true },
    audience: { type: String, required: true },
    notes: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Pending, Approved, Rejected, Confirmed (from dev payment)
    paymentStatus: { type: String, default: "Pending" }, // Pending, Paid
    razorpayOrderId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
