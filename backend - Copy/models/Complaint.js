const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    trackingId: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    region: {
        type: String,
        required: true
    },

    ward: {
        type: String,
        required: true
    },

    suburb: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    urgency: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Complaint",
    complaintSchema
);