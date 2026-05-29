// ======================================================
// JHB CIVIC REPORT - FRONTEND LOGIC
// ======================================================

// =========================================
// AUTH: AUTO-FILL USER DETAILS
// =========================================

function populateUserDetailsIfLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        console.log("No logged-in user found");
        return;
    }

    const nameField = document.getElementById("fullName");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");

    if (nameField) nameField.value = currentUser.full_name || "";
    if (emailField) emailField.value = currentUser.email || "";
    if (phoneField) phoneField.value = currentUser.phone_number || "";
}

// Run on page load
document.addEventListener("DOMContentLoaded", function () {
    populateUserDetailsIfLoggedIn();
});

// =========================================
// REGION → WARD DATA
// =========================================

const wardsByRegion = {
    "Region A": ["1", "2", "3"],
    "Region B": ["4", "5", "6"],
    "Region C": ["7", "8", "9"],
    "Region D": ["10", "11", "12"],
    "Region E": ["13", "14", "15"],
    "Region F": ["16", "17", "18"],
    "Region G": ["19", "20", "21"],
};

// =========================================
// REGION + WARD LOGIC
// =========================================

const regionSelect = document.getElementById("region");
const wardSelect = document.getElementById("ward");

wardSelect.disabled = true;

regionSelect.addEventListener("change", function () {
    const selectedRegion = regionSelect.value;

    wardSelect.innerHTML = `
        <option value="">
            Select Ward
        </option>
    `;

    if (selectedRegion === "") {
        wardSelect.disabled = true;
        return;
    }

    wardSelect.disabled = false;

    const wards = wardsByRegion[selectedRegion];

    wards.forEach(function (ward) {
        const option = document.createElement("option");
        option.value = ward;
        option.textContent = ward;
        wardSelect.appendChild(option);
    });
});

// =========================================
// COMPLAINT FORM SUBMISSION
// =========================================

const complaintForm = document.getElementById("complaintForm");

const responseMessage = document.createElement("div");

responseMessage.id = "responseMessage";
responseMessage.className =
    "hidden mt-6 p-6 rounded-2xl text-white font-semibold";

complaintForm.appendChild(responseMessage);

complaintForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    console.log(currentUser.user_id);

    const complaintData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        region: document.getElementById("region").value,
        ward: document.getElementById("ward").value,
        suburb: document.getElementById("suburb").value,
        address: document.getElementById("address").value,
        category: document.getElementById("category").value,
        urgency: document.getElementById("urgency").value,
        description: document.getElementById("description").value,
        logged_by: currentUser ? currentUser.user_id : null
    };

    const evidenceInput = document.getElementById("evidence");
    const evidenceFile =
        evidenceInput && evidenceInput.files ? evidenceInput.files[0] : null;

    try {
        const formData = new FormData();

        Object.entries(complaintData).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });

        if (evidenceFile) {
            formData.append("evidence", evidenceFile);
        }

        const response = await fetch("http://localhost:5000/api/complaints", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        console.log("Backend response:", data);

        responseMessage.classList.remove("hidden", "bg-red-600");
        responseMessage.classList.add("bg-green-600");

        responseMessage.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-2xl font-bold">
                    Complaint Submitted Successfully
                </h3>

                <p>
                    Your complaint has been logged successfully.
                </p>

                <div class="bg-white/20 p-4 rounded-xl text-xl">
                    Tracking ID:
                    <strong>
                        ${data.trackingId}
                    </strong>
                </div>

                <div class="flex gap-4 pt-2">
                    <button
                        onclick="copyTrackingId('${data.trackingId}')"
                        class="bg-white text-blue-900 px-5 py-2 rounded-xl font-semibold"
                    >
                        Copy ID
                    </button>

                    <button
                        onclick="closeResponseMessage()"
                        class="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        `;

        complaintForm.reset();
        wardSelect.disabled = true;

        // re-fill user info after reset
        populateUserDetailsIfLoggedIn();

    } catch (error) {
        console.error("Submission Error:", error);

        responseMessage.classList.remove("hidden", "bg-green-600");
        responseMessage.classList.add("bg-red-600");

        responseMessage.innerHTML = `
            <h3 class="text-2xl font-bold mb-2">
                Submission Failed
            </h3>

            <p>
                Failed to connect to backend server.
            </p>
        `;
    }
});

// =========================================
// COPY TRACKING ID
// =========================================

function copyTrackingId(id) {
    navigator.clipboard.writeText(id);
    alert("Tracking ID copied!");
}

// =========================================
// CLOSE MESSAGE
// =========================================

function closeResponseMessage() {
    const responseMessage = document.getElementById("responseMessage");
    responseMessage.classList.add("hidden");
}