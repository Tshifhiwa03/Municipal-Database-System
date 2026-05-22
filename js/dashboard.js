
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

const table = document.getElementById("complaintsTable");
const filter = document.getElementById("statusFilter");

function renderDashboard(filteredComplaints = complaints) {

    table.innerHTML = "";

    document.getElementById("totalComplaints").textContent =
        complaints.length;

    document.getElementById("pendingComplaints").textContent =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("progressComplaints").textContent =
        complaints.filter(c => c.status === "In Progress").length;

    document.getElementById("resolvedComplaints").textContent =
        complaints.filter(c => c.status === "Resolved").length;



    filteredComplaints.forEach((complaint, index) => {

        const row = document.createElement("tr");

        row.classList.add("border-b");

        row.innerHTML = `
            <td class="py-4">${complaint.id}</td>

            <td>${complaint.fullName}</td>

            <td>${complaint.category}</td>

            <td>${complaint.region}</td>

            <td>${complaint.ward}</td>

            <td>
                <span class="
                    px-3 py-1 rounded-full text-sm
                    ${getStatusColor(complaint.status)}
                ">
                    ${complaint.status}
                </span>
            </td>

            <td>
                <select
                    onchange="updateStatus(${index}, this.value)"
                    class="border rounded px-2 py-1"
                >
                    <option value="Pending"
                        ${complaint.status === "Pending" ? "selected" : ""}
                    >
                        Pending
                    </option>

                    <option value="In Progress"
                        ${complaint.status === "In Progress" ? "selected" : ""}
                    >
                        In Progress
                    </option>

                    <option value="Resolved"
                        ${complaint.status === "Resolved" ? "selected" : ""}
                    >
                        Resolved
                    </option>

                </select>
            </td>
        `;

        table.appendChild(row);

    });

}

function getStatusColor(status) {

    switch(status){

        case "Pending":
            return "bg-yellow-100 text-yellow-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Resolved":
            return "bg-green-100 text-green-700";

        default:
            return "bg-gray-100 text-gray-700";

    }

}


function updateStatus(index, newStatus){

    complaints[index].status = newStatus;

    localStorage.setItem(
        "complaints",
        JSON.stringify(complaints)
    );

    applyFilter();

}

filter.addEventListener("change", applyFilter);

function applyFilter(){

    const selected = filter.value;

    if(selected === "All"){

        renderDashboard(complaints);

        return;
    }

    const filtered = complaints.filter(
        complaint => complaint.status === selected
    );

    renderDashboard(filtered);

}

renderDashboard();

// ======================================================
// MAP DASHBOARD (LEAFLET)
// ======================================================


// ==========================
// INITIALIZE MAP
// ==========================

// Johannesburg coordinates
const map = L.map("map").setView(
    [-26.2041, 28.0473],
    10
);


// ==========================
// MAP TILES
// ==========================

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ==========================
// GENERATE RANDOM JHB COORDS
// (Temporary until real GPS)
// ==========================

function generateCoordinates(){

    // Johannesburg approximate ranges

    const lat =
        -26.10 - Math.random() * 0.25;

    const lng =
        27.90 + Math.random() * 0.30;

    return [lat, lng];

}


// ==========================
// ADD COMPLAINT MARKERS
// ==========================

function loadComplaintMarkers(){

    complaints.forEach(complaint => {

        // Generate temporary coordinates
        const coords = generateCoordinates();

        // Create marker
        const marker = L.marker(coords).addTo(map);

        // Popup content
        marker.bindPopup(`
            <div style="font-family:Poppins; min-width:220px;">

                <h3 style="
                    font-size:18px;
                    font-weight:bold;
                    margin-bottom:10px;
                    color:#0B3C5D;
                ">
                    ${complaint.category}
                </h3>

                <p>
                    <strong>ID:</strong>
                    ${complaint.id}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${complaint.status}
                </p>

                <p>
                    <strong>Region:</strong>
                    ${complaint.region}
                </p>

                <p>
                    <strong>Ward:</strong>
                    ${complaint.ward}
                </p>

                <p>
                    <strong>Urgency:</strong>
                    ${complaint.urgency}
                </p>

            </div>
        `);

    });

}


// ==========================
// LOAD MARKERS
// ==========================

loadComplaintMarkers();