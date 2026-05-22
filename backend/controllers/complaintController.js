// ======================================
// IMPORT MODEL
// ======================================

const Complaint = require("../models/Complaint");


// ======================================
// GET ALL COMPLAINTS
// ======================================

const getAllComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find();

        res.json({

            total: complaints.length,
            complaints: complaints

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch complaints"

        });

    }

};

const createComplaint = async (req, res) => {

    try {

        const complaintData = req.body;


        // GENERATE TRACKING ID
        const trackingId =
            `JHB-${Math.floor(Math.random() * 100000)}`;


        // CREATE COMPLAINT
        const complaint = new Complaint({

            trackingId: trackingId,

            fullName: complaintData.fullName,

            phone: complaintData.phone,

            email: complaintData.email,

            region: complaintData.region,

            ward: complaintData.ward,

            suburb: complaintData.suburb,

            address: complaintData.address,

            category: complaintData.category,

            urgency: complaintData.urgency,

            description: complaintData.description

        });


        // SAVE TO DATABASE
        await complaint.save();


        console.log("Complaint Saved:", complaint);


        // RESPONSE
        res.json({

            success: true,
            message: "Complaint submitted successfully",
            trackingId: trackingId

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Failed to save complaint"

        });

    }

};


const getComplaintByTrackingId = async (req, res) => {

    try {

        const trackingId = req.params.trackingId;

        const complaint = await Complaint.findOne({

            trackingId: trackingId

        });


        if (!complaint) {

            return res.status(404).json({

                success: false,
                message: "Complaint not found"

            });

        }


        res.json({

            success: true,
            complaint: complaint

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server error"

        });

    }

};



module.exports = {

    getAllComplaints,
    createComplaint,
    getComplaintByTrackingId

};