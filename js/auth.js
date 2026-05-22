// ======================================================
// AUTHENTICATION SYSTEM
// ======================================================


// ==========================
// SIGNUP
// ==========================

const signupForm = document.getElementById("signupForm");

if(signupForm){

    signupForm.addEventListener("submit", function(e){

        e.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value.trim();

        if(!name || !email || !password){

            alert("Please fill all fields.");
            return;

        }

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const exists =
            users.find(user => user.email === email);

        if(exists){

            alert("User already exists.");
            return;

        }

        const user = {
            name,
            email,
            password,
            role: "citizen"
        };

        users.push(user);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Account created successfully!");

        window.location.href = "login.html";

    });

}


// ==========================
// CITIZEN LOGIN
// ==========================

const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            u => u.email === email &&
                 u.password === password
        );

        if(!user){

            alert("Invalid credentials.");
            return;

        }

        sessionStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        alert("Login successful!");

        window.location.href = "index.html";

    });

}


// ==========================
// ADMIN LOGIN
// ==========================

const adminForm =
    document.getElementById("adminLoginForm");

if(adminForm){

    adminForm.addEventListener("submit", function(e){

        e.preventDefault();

        const email =
            document.getElementById("adminEmail").value.trim();

        const password =
            document.getElementById("adminPassword").value.trim();

        // HARDCODED ADMIN
        if(
            email === "admin@jhb.gov.za" &&
            password === "admin123"
        ){

            const admin = {
                email,
                role: "admin"
            };

            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(admin)
            );

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

if(window.location.pathname.includes("dashboard.html")){

    const currentUser =
        JSON.parse(sessionStorage.getItem("currentUser"));

    if(
        !currentUser ||
        currentUser.role !== "admin"
    ){

        alert("Access denied.");

        window.location.href =
            "admin-login.html";

    }

}


// ======================================================
// LOGOUT FUNCTION
// ======================================================

function logout(){

    sessionStorage.removeItem("currentUser");

    window.location.href = "login.html";

}