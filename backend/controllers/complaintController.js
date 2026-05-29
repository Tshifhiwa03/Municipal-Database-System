const pool = require("../database");

// GET ALL MAINTENANCE REQUESTS
// const getAllComplaints = async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT 
//                 request_id,
//                 request_ref,
//                 logged_by,
//                 issue_type AS category,
//                 severity AS urgency,
//                 status,
//                 reported_date,
//                 description
//             FROM maintenance_requests
//             ORDER BY reported_date DESC
//         `);

//         // Calculate totals
//         const total = rows.length;
//         const pending = rows.filter(r => r.status === "Pending").length;
//         const inProgress = rows.filter(r => r.status === "In Progress").length;
//         const resolved = rows.filter(r => r.status === "Resolved").length;

//         res.json({
//             success: true,
//             stats: {
//                 total,
//                 pending,
//                 inProgress,
//                 resolved
//             },
//             complaints: rows
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch maintenance requests"
//         });
//     }
// };

const getAllComplaints = async (req, res) => {
    try {

        const [rows] = await pool.query(`
            SELECT 
                request_id,
                request_ref,
                logged_by,
                issue_type AS category,
                severity AS urgency,
                status,
                reported_date,
                description
            FROM maintenance_requests
            ORDER BY reported_date DESC
        `);

        const total = rows.length;

        const pending = rows.filter(r =>
            r.status === "PENDING" || r.status === "Pending" || r.status === "OVERDUE"
        ).length;

        const inProgress = rows.filter(r =>
            r.status === "IN_PROGRESS" ||
            r.status === "ASSIGNED"
        ).length;

        const resolved = rows.filter(r =>
            r.status === "RESOLVED" ||
            r.status === "CLOSED"
        ).length;

        console.log(pending, inProgress, resolved);
        console.log(rows);

        res.json({
            success: true,
            stats: {
                total,
                pending,
                inProgress,
                resolved
            },
            complaints: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch maintenance requests"
        });

    }
};

// CREATE NEW COMPLAINT
const createComplaint = async (req, res) => {
    try {
        const data = req.body || {};
        const requestRef = `JHB-${Math.floor(Math.random() * 100000)}`;
        const reportedDate = new Date().toISOString().split("T")[0];

        const loggedBy = req.user?.id || data.logged_by;

        if (!loggedBy) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const source = "web";

        const sql = `
            INSERT INTO maintenance_requests
            (
                request_ref,
                logged_by,
                issue_type,
                severity,
                status,
                reported_date,
                source,
                description,
                ward_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            requestRef,
            loggedBy,
            data.category,
            data.urgency,
            "Pending",
            reportedDate,
            source,
            data.description,
            data.ward_id || null
        ];

        await pool.query(sql, values);

        res.json({
            success: true,
            message: "Request submitted successfully",
            trackingId: requestRef,
            loggedBy,
            source
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to save request",
        });
    }
};

// GET COMPLAINT BY TRACKING ID
const getComplaintByTrackingId = async (req, res) => {
    try {
        const { trackingId } = req.params;

        const [rows] = await pool.query(
            "SELECT * FROM maintenance_requests WHERE request_ref = ?",
            [trackingId]
        );

        const complaint = rows[0];

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        res.json({
            success: true,
            complaint,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


module.exports = {
    getAllComplaints,
    createComplaint,
    getComplaintByTrackingId
};