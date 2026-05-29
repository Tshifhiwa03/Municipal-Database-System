let complaints = [];

const table = document.getElementById("complaintsTable");
const filter = document.getElementById("statusFilter");

async function loadDashboardData() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/maintenance-requests",
        );

        const data = await response.json();

        if (!data.success) return;

        complaints = data.complaints;

        document.getElementById("totalComplaints").textContent =
            data.stats.total;
        document.getElementById("pendingComplaints").textContent =
            data.stats.pending;
        document.getElementById("progressComplaints").textContent =
            data.stats.inProgress;
        document.getElementById("resolvedComplaints").textContent =
            data.stats.resolved;

        renderDashboard(complaints);
        loadComplaintMarkers();
    } catch (error) {
        console.error(error);
    }
}

function formatDateTime(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDateForInput(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
}

function renderDashboard(filteredComplaints = complaints) {
    table.innerHTML = "";

    filteredComplaints.forEach((complaint, index) => {
        const row = document.createElement("tr");
        row.classList.add("border-b");

        row.innerHTML = `
            <td class="py-4">${complaint.request_ref || "-"}</td>
            <td>${complaint.logged_by || "-"}</td>
            <td>${formatDateTime(complaint.reported_date)}</td>
            <td>${complaint.category || "-"}</td>
            <td>${complaint.urgency ? complaint.urgency.toUpperCase() : "-"}</td>
            <td>${complaint.asset_id || "-"}</td>
            <td>
                <span class="${getStatusColor(complaint.status)}">
                    ${complaint.status ? complaint.status.toUpperCase() : "-"}
                </span>
            </td>
            <td>
                <button
                    onclick="openUpdateModal(${index})"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    Update
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

filter.addEventListener("change", applyFilter);

function applyFilter() {
    const selected = filter.value;

    if (selected === "All") {
        renderDashboard(complaints);
        return;
    }

    renderDashboard(complaints.filter((c) => c.status === selected));
}

function getStatusColor(status) {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-700";
        case "IN_PROGRESS":
            return "bg-blue-100 text-blue-700";
        case "OVERDUE":
            return "bg-red-100 text-red-700";
        case "RESOLVED":
            return "bg-green-100 text-green-700";
        case "CLOSED":
            return "bg-green-100 text-green-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

function openUpdateModal(index) {
    const complaint = complaints[index];

    document.getElementById("request_id").value = complaint.request_id || "";
    document.getElementById("request_ref").value = complaint.request_ref || "";
    document.getElementById("asset_id").value = complaint.asset_id || "";
    document.getElementById("assigned_to").value = complaint.assigned_to || "";
    document.getElementById("logged_by").value = complaint.logged_by || "";

    document.getElementById("issue_type").value = complaint.category || "";
    document.getElementById("severity").value = complaint.urgency || "";

    document.getElementById("status").value = complaint.status || "";

    document.getElementById("reported_date").value = formatDateForInput(
        complaint.reported_date,
    );

    document.getElementById("resolved_date").value = formatDateForInput(
        complaint.resolved_date,
    );

    document.getElementById("cost_estimate").value =
        complaint.cost_estimate || "";
    document.getElementById("actual_cost").value = complaint.actual_cost || "";
    document.getElementById("resolution_note").value =
        complaint.resolution_note || "";
    document.getElementById("source").value = complaint.source || "";
    document.getElementById("description").value = complaint.description || "";

    document.getElementById("updateModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("updateModal").classList.add("hidden");
}

async function submitUpdate(event) {
    event.preventDefault();

    const request_id = document.getElementById("request_id").value;

    const resolvedDateValue = document.getElementById("resolved_date").value;

    const resolved_date = resolvedDateValue || null;

    let status = document.getElementById("status").value;

    if (resolved_date) {
        status = "RESOLVED";
    }

    const updatedData = {
        request_ref: document.getElementById("request_ref").value,
        asset_id: document.getElementById("asset_id").value,
        assigned_to: document.getElementById("assigned_to").value || null,
        logged_by: document.getElementById("logged_by").value,
        issue_type: document.getElementById("issue_type").value,
        severity: document.getElementById("severity").value,
        status: status,
        resolved_date: resolved_date,
        cost_estimate: document.getElementById("cost_estimate").value || null,
        actual_cost: document.getElementById("actual_cost").value || null,
        resolution_note: document.getElementById("resolution_note").value || null,
        source: document.getElementById("source").value || null,
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
            }
        );

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Server did not return JSON");
        }

        if (!response.ok) {
            throw new Error(data.message || "Update failed");
        }

        if (data.success) {
            alert("Complaint updated successfully");
            closeModal();
            loadDashboardData();
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadStaff() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/maintenance-requests/staff",
        );

        const data = await response.json();

        const select = document.getElementById("assigned_to");

        select.innerHTML = `<option value="" disabled selected>Select Staff Member</option>`;

        data.staff.forEach((staff) => {
            const option = document.createElement("option");
            option.value = staff.staff_id;
            option.textContent = `${staff.full_name} (${staff.role} - ${staff.department})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

loadStaff();

const map = L.map("map").setView([-26.2041, 28.0473], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

function generateCoordinates() {
    const lat = -26.1 - Math.random() * 0.25;
    const lng = 27.9 + Math.random() * 0.3;
    return [lat, lng];
}

function loadComplaintMarkers() {
    complaints.forEach((complaint) => {
        const coords = generateCoordinates();

        L.marker(coords).addTo(map).bindPopup(`
                <div>
                    <h3>${complaint.category || "-"}</h3>
                    <p>Status: ${complaint.status || "-"}</p>
                    <p>Severity: ${complaint.urgency || "-"}</p>
                    <p>Assigned: ${complaint.assigned_to || "-"}</p>
                </div>
            `);
    });
}

document.addEventListener("DOMContentLoaded", loadDashboardData);
