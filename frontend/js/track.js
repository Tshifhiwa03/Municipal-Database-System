async function trackComplaint() {

    const searchId = document.getElementById("searchId").value.trim();
    const resultDiv = document.getElementById("result");

    if (!searchId) {
        alert("Please enter a complaint reference");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/maintenance-requests/${searchId}`
        );

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Invalid server response");
        }

        if (!response.ok || !data.success) {
            resultDiv.innerHTML = `
                <div class="text-red-600 font-semibold mt-4">
                    Complaint not found.
                </div>
            `;
            return;
        }

        const found = data.complaint;

        resultDiv.innerHTML = `
            <div class="bg-white p-6 rounded-xl mt-6 space-y-2 shadow">

                <h3 class="text-xl font-bold text-blue-900">
                    Complaint Details
                </h3>

                <p><strong>Reference:</strong> ${found.request_ref}</p>
                <p><strong>Logged By:</strong> ${found.logged_by_name || "-"}</p>
                <p><strong>Assigned To:</strong> ${found.assigned_to_name || "Unassigned"}</p>
                <p><strong>Asset:</strong> ${found.asset_name || "-"}</p>
                <p><strong>Category:</strong> ${found.issue_type}</p>
                <p><strong>Severity:</strong> ${found.severity}</p>
                <p><strong>Status:</strong> ${found.status}</p>
                <p><strong>Source:</strong> ${found.source || "-"}</p>
                <p><strong>Description:</strong> ${found.description}</p>
                <p><strong>Reported Date:</strong> ${new Date(found.reported_date).toLocaleString()}</p>
                <p><strong>Resolved Date:</strong> ${found.resolved_date ? new Date(found.resolved_date).toLocaleString() : "-"}</p>

            </div>
        `;

    } catch (error) {
        console.error(error);

        resultDiv.innerHTML = `
            <div class="text-red-600 font-semibold mt-4">
                Error tracking complaint.
            </div>
        `;
    }
}