// ======================================================
// JHB CIVIC REPORT - FRONTEND LOGIC
// ======================================================


// =========================================
// REGION → WARD DATA
// =========================================

const wardsByRegion = {

    "Region A": [
        "Ward 1",
        "Ward 2",
        "Ward 3"
    ],

    "Region B": [
        "Ward 4",
        "Ward 5",
        "Ward 6"
    ],

    "Region C": [
        "Ward 7",
        "Ward 8",
        "Ward 9"
    ],

    "Region D": [
        "Ward 10",
        "Ward 11",
        "Ward 12"
    ],

    "Region E": [
        "Ward 13",
        "Ward 14",
        "Ward 15"
    ],

    "Region F": [
        "Ward 16",
        "Ward 17",
        "Ward 18"
    ],

    "Region G": [
        "Ward 19",
        "Ward 20",
        "Ward 21"
    ]

};


// =========================================
// REGION + WARD LOGIC
// =========================================

const regionSelect = document.getElementById("region");
const wardSelect = document.getElementById("ward");


// DISABLE WARD INITIALLY
wardSelect.disabled = true;


// REGION CHANGE EVENT
regionSelect.addEventListener("change", function () {

    const selectedRegion = regionSelect.value;

    // RESET WARDS
    wardSelect.innerHTML = `
        <option value="">
            Select Ward
        </option>
    `;

    // NO REGION SELECTED
    if (selectedRegion === "") {

        wardSelect.disabled = true;
        return;

    }

    // ENABLE WARD DROPDOWN
    wardSelect.disabled = false;

    // GET WARDS
    const wards = wardsByRegion[selectedRegion];

    // ADD WARDS
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


// CREATE SUCCESS MESSAGE DIV
const responseMessage = document.createElement("div");

responseMessage.id = "responseMessage";

responseMessage.className =
    "hidden mt-6 p-6 rounded-2xl text-white font-semibold";


// ADD MESSAGE DIV BELOW FORM
complaintForm.appendChild(responseMessage);


// FORM SUBMIT EVENT
complaintForm.addEventListener("submit", async function (event) {

    // STOP PAGE REFRESH
    event.preventDefault();

    // =====================================
    // COLLECT FORM DATA
    // =====================================

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

        description: document.getElementById("description").value

    };


    console.log("Submitting Complaint:", complaintData);


    try {

        // =====================================
        // SEND DATA TO BACKEND
        // =====================================

        const response = await fetch(
            "http://localhost:5000/api/complaints",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(complaintData)

            }
        );


        const data = await response.json();


        console.log("Backend Response:", data);


        // =====================================
        // SHOW SUCCESS MESSAGE
        // =====================================

        responseMessage.classList.remove("hidden");

        responseMessage.classList.remove("bg-red-600");

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
            <strong id="trackingIdText">
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


        // =====================================
        // RESET FORM
        // =====================================

        complaintForm.reset();

        wardSelect.disabled = true;


    } catch (error) {

        console.error("Submission Error:", error);


        // =====================================
        // SHOW ERROR MESSAGE
        // =====================================

        responseMessage.classList.remove("hidden");

        responseMessage.classList.remove("bg-green-600");

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
// CLOSE SUCCESS MESSAGE
// =========================================

function closeResponseMessage() {

    const responseMessage =
        document.getElementById("responseMessage");

    responseMessage.classList.add("hidden");

}