const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const full_name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const phone_number = document.getElementById("signupPhone").value.trim();

        if (!full_name || !email || !password || !phone_number) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/community_member/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        full_name,
                        email,
                        password,
                        phone_number,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Account created successfully!");
                window.location.href = "login.html";
            } else {
                alert(data.error || "Signup failed");
            }
        } catch (error) {
            console.error(error);
            alert("Server not reachable");
        }
    });
}

// ==========================
// CITIZEN LOGIN
// ==========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        if (!email || !password) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/community_member/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (data.success) {
                // Store full user info
                const userInfo = {
                    user_id: data.user.user_id,
                    full_name: data.user.full_name,
                    email: data.user.email,
                    phone_number: data.user.phone_number
                };

                localStorage.setItem("currentUser", JSON.stringify(userInfo));

                alert("Login successful!");
                window.location.href = "report.html";
            } else {
                alert(data.error || "Invalid credentials.");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("Cannot connect to server.");
        }
    });
}

// ==========================
// ADMIN LOGIN
// ==========================

const adminForm = document.getElementById("adminLoginForm");

if (adminForm) {
    adminForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value.trim();

        if (email === "admin@jhb.gov.za" && password === "admin123") {
            const admin = {
                email,
                role: "admin",
            };

            localStorage.setItem("currentUser", JSON.stringify(admin));

            alert("Admin login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid admin credentials.");
        }
    });
}

// ======================================================
// DASHBOARD PROTECTION
// ======================================================

if (window.location.pathname.includes("dashboard.html")) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
        alert("Access denied.");
        window.location.href = "admin-login.html";
    }
}

// ======================================================
// LOGOUT FUNCTION
// ======================================================

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}