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
                asset_id,
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

const getComplaintByTrackingId = async (req, res) => {
    try {
        const { trackingId } = req.params;

        const [rows] = await pool.query(`
            SELECT 
                m.request_id,
                m.request_ref,
                m.issue_type,
                m.severity,
                m.status,
                m.reported_date,
                m.resolved_date,
                m.source,
                m.description,

                cm.full_name AS logged_by_name,
                am.full_name AS assigned_to_name,

                a.asset_name AS asset_name

            FROM asset_management.maintenance_requests m

            LEFT JOIN asset_management.community_member cm
                ON m.logged_by = cm.user_id

            LEFT JOIN asset_management.community_member am
                ON m.assigned_to = am.user_id

            LEFT JOIN asset_management.assets a
                ON m.asset_id = a.asset_id

            WHERE m.request_ref = ?
        `, [trackingId]);

        const complaint = rows[0];

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            complaint
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.resolved_date) {
            data.status = "RESOLVED";
        }

        const sql = `
            UPDATE asset_management.maintenance_requests
            SET
                assigned_to = ?,
                severity = ?,
                status = ?,
                resolved_date = ?,
                cost_estimate = ?,
                actual_cost = ?,
                resolution_note = ?,
                source = ?,
                description = ?
            WHERE request_id = ?
        `;

        const values = [
            data.assigned_to || null,
            data.severity || null,
            data.status || null,
            data.resolved_date || null,
            data.cost_estimate || null,
            data.actual_cost || null,
            data.resolution_note || null,
            data.source || null,
            data.description || null,
            id
        ];

        await pool.query(sql, values);

        return res.status(200).json({
            success: true,
            message: "Maintenance request updated successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllStaff = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                staff_id,
                employee_no,
                full_name,
                role,
                department
            FROM asset_management.staff
            ORDER BY full_name ASC
        `);

        res.json({
            success: true,
            staff: rows
        });

        console.log(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch staff"
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
    getComplaintByTrackingId,
    getAllStaff,
    updateComplaint  
};