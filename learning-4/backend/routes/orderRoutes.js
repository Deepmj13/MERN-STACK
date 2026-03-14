const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create new order
router.post("/orders", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (for AdminPanel) - Protected
router.get("/orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status (for AdminPanel) - Protected
router.put("/orders/:id/status", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify dev payment
router.post("/verify-payment", async (req, res) => {
    try {
        const { order_id } = req.body;
        // In dev mock, we just mark it as paid/confirmed if order exists
        const order = await Order.findById(order_id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.paymentStatus = "Paid";
        // Update main status based on mock fulfillment logic, e.g. "Confirmed"
        order.status = "Confirmed";

        await order.save();
        res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
