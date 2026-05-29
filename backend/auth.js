document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("signupName").value;
    const phone_number = document.getElementById("signupPhone").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
        const response = await fetch("http://localhost:5000/api/community_member/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name,
                phone_number,
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Account created successfully!");
            window.location.href = "login.html";
        } else {
            alert(data.error || "Signup failed");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Server not reachable");
    }
});