
function trackComplaint() {

    const searchId = document.getElementById("searchId").value.trim();
    const resultDiv = document.getElementById("result");

    if (!searchId) {
        alert("Please enter a complaint ID");
        return;
    }

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    const found = complaints.find(c => c.id === searchId);

    if (!found) {

        resultDiv.innerHTML = `
            <div class="text-red-600 font-semibold mt-4">
                Complaint not found.
            </div>
        `;

        return;
    }

    resultDiv.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-xl mt-4 space-y-2">

            <h3 class="text-xl font-bold text-blue-900">
                Complaint Details
            </h3>

            <p><strong>ID:</strong> ${found.id}</p>
            <p><strong>Name:</strong> ${found.fullName}</p>
            <p><strong>Category:</strong> ${found.category}</p>
            <p><strong>Region:</strong> ${found.region}</p>
            <p><strong>Ward:</strong> ${found.ward}</p>
            <p><strong>Status:</strong> ${found.status}</p>
            <p><strong>Urgency:</strong> ${found.urgency}</p>
            <p><strong>Description:</strong> ${found.description}</p>
            <p><strong>Date:</strong> ${new Date(found.createdAt).toLocaleString()}</p>

        </div>
    `;
}