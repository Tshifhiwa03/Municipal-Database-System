// ======================================================
// GLOBAL VARIABLES
// ======================================================

let complaints = [];

const table = document.getElementById("complaintsTable");

const filter = document.getElementById("statusFilter");

// ======================================================
// LOAD DASHBOARD DATA
// ======================================================

async function loadDashboardData() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/maintenance-requests",
        );

        const data = await response.json();

        if (!data.success) {
            console.error("Failed to load complaints");
            return;
        }

        complaints = data.complaints;

        // STATS
        document.getElementById("totalComplaints").textContent =
            data.stats.total;

        document.getElementById("pendingComplaints").textContent =
            data.stats.pending;

        document.getElementById("progressComplaints").textContent =
            data.stats.inProgress;

        document.getElementById("resolvedComplaints").textContent =
            data.stats.resolved;

        // TABLE
        renderDashboard(complaints);

        // MAP
        loadComplaintMarkers();
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

// ======================================================
// RENDER TABLE
// ======================================================

function renderDashboard(filteredComplaints = complaints) {

    table.innerHTML = "";

    filteredComplaints.forEach((complaint, index) => {
        console.log("Rendering complaint:", complaint);
        const row = document.createElement("tr");

        row.classList.add("border-b");



        row.innerHTML = `

            <td class="py-4">
                ${complaint.request_ref || "-"}
            </td>

            <td>
                ${complaint.logged_by || "-"}
            </td>

            <td>
                ${complaint.reported_date ? new Date(complaint.reported_date).toLocaleDateString() : "-"}
            </td>

            <td>
                ${complaint.category || "-"}
            </td>

            <td>
                ${complaint.urgency.toUpperCase() || "-"}
            </td>

            <td>
                ${complaint.ward_id || "-"}
            </td>

            <td>
                <span class="
                    px-3 py-1 rounded-full text-sm
                    ${getStatusColor(complaint.status)}
                ">
                    ${complaint.status.toUpperCase() || "-"}
                </span>
            </td>

            <td>

                <button
                    onclick="openUpdateModal(${index})"
                    class="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        text-sm
                    "
                >
                    Update
                </button>

            </td>

        `;

        table.appendChild(row);
    });
}

// ======================================================
// FILTER
// ======================================================

filter.addEventListener("change", applyFilter);

function applyFilter() {
    const selected = filter.value;

    if (selected === "All") {
        renderDashboard(complaints);

        return;
    }

    const filtered = complaints.filter(
        (complaint) => complaint.status === selected,
    );

    renderDashboard(filtered);
}

// ======================================================
// STATUS COLORS
// ======================================================

function getStatusColor(status) {
    switch (status) {
        // ======================
        // PENDING
        // ======================

        case "PENDING":
            return "bg-yellow-100 text-yellow-700";

        // ======================
        // IN PROGRESS
        // ======================

        case "IN_PROGRESS":
            return "bg-blue-100 text-blue-700";

        // ======================
        // OVERDUE
        // ======================

        case "OVERDUE":
            return "bg-red-100 text-red-700";

        // ======================
        // RESOLVED
        // ======================

        case "RESOLVED":
            return "bg-green-100 text-green-700";

        // ======================
        // CLOSED
        // ======================

        case "CLOSED":

            return "bg-green-100 text-green-700";

        // ======================
        // DEFAULT
        // ======================

        default:
            return "bg-gray-100 text-gray-700";
    }
}

// ======================================================
// OPEN UPDATE MODAL
// ======================================================

function openUpdateModal(index) {
    const complaint = complaints[index];

    document.getElementById("request_id").value = complaint.request_id || "";

    document.getElementById("request_ref").value = complaint.request_ref || "";

    document.getElementById("asset_id").value = complaint.asset_id || "";

    document.getElementById("assigned_to").value = complaint.assigned_to || "";

    document.getElementById("logged_by").value = complaint.logged_by || "";

    document.getElementById("issue_type").value = complaint.issue_type || "";

    document.getElementById("severity").value = complaint.severity || "";

    document.getElementById("status").value = complaint.status || "";

    document.getElementById("reported_date").value =
        complaint.reported_date || "";

    document.getElementById("resolved_date").value =
        complaint.resolved_date || "";

    document.getElementById("cost_estimate").value =
        complaint.cost_estimate || "";

    document.getElementById("actual_cost").value = complaint.actual_cost || "";

    document.getElementById("resolution_note").value =
        complaint.resolution_note || "";

    document.getElementById("source").value = complaint.source || "";

    document.getElementById("description").value = complaint.description || "";

    document.getElementById("updateModal").classList.remove("hidden");
}

// ======================================================
// CLOSE MODAL
// ======================================================

function closeModal() {
    document.getElementById("updateModal").classList.add("hidden");
}

// ======================================================
// SUBMIT UPDATE
// ======================================================

async function submitUpdate(event) {
    event.preventDefault();

    const request_id = document.getElementById("request_id").value;

    const updatedData = {
        request_ref: document.getElementById("request_ref").value,

        asset_id: document.getElementById("asset_id").value,

        assigned_to: document.getElementById("assigned_to").value,

        logged_by: document.getElementById("logged_by").value,

        issue_type: document.getElementById("issue_type").value,

        severity: document.getElementById("severity").value,

        status: document.getElementById("status").value,

        reported_date: document.getElementById("reported_date").value,

        resolved_date: document.getElementById("resolved_date").value,

        cost_estimate: document.getElementById("cost_estimate").value,

        actual_cost: document.getElementById("actual_cost").value,

        resolution_note: document.getElementById("resolution_note").value,

        source: document.getElementById("source").value,

        description: document.getElementById("description").value,
    };

    try {
        const response = await fetch(
            `http://localhost:5000/api/maintenance-requests/${request_id}`,

            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(updatedData),
            },
        );

        const data = await response.json();

        if (data.success) {
            alert("Complaint updated successfully");

            closeModal();

            loadDashboardData();
        } else {
            alert("Failed to update complaint");
        }
    } catch (error) {
        console.error("Update error:", error);
    }
}

// ======================================================
// MAP
// ======================================================

const map = L.map("map").setView([-26.2041, 28.0473], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// ======================================================
// RANDOM COORDS
// ======================================================

function generateCoordinates() {
    const lat = -26.1 - Math.random() * 0.25;

    const lng = 27.9 + Math.random() * 0.3;

    return [lat, lng];
}

// ======================================================
// LOAD MAP MARKERS
// ======================================================

function loadComplaintMarkers() {
    complaints.forEach((complaint) => {
        const coords = generateCoordinates();

        const marker = L.marker(coords).addTo(map);

        marker.bindPopup(`

            <div style="
                font-family:Poppins;
                min-width:220px;
            ">

                <h3 style="
                    font-size:18px;
                    font-weight:bold;
                    margin-bottom:10px;
                    color:#0B3C5D;
                ">
                    ${complaint.issue_type || "-"}
                </h3>

                <p>
                    <strong>Status:</strong>
                    ${complaint.status || "-"}
                </p>

                <p>
                    <strong>Severity:</strong>
                    ${complaint.severity || "-"}
                </p>

                <p>
                    <strong>Assigned To:</strong>
                    ${complaint.assigned_to || "-"}
                </p>

            </div>

        `);
    });
}

// ======================================================
// INITIALIZE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",

    loadDashboardData,
);
