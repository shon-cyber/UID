// Basic JS interactions for non-form pages
document.addEventListener("DOMContentLoaded", () => {
    console.log("TourGuide Main JS loaded.");

    // Update navbar based on auth state
    if (typeof getCurrentUser === "function") {
        const user = getCurrentUser();
        const navLinks = document.querySelector(".nav-links");
        
        if (user && navLinks) {
            // Modify Logo area to display name in top left
            const logo = document.querySelector(".logo");
            if(logo) {
                logo.innerHTML = `{TourGuide } <span style="font-size:1rem; font-weight:400; opacity:0.9; margin-left:10px;">| Welcome, ${user.name}</span>`;
            }

            // Remove existing login if it's there
            const loginLinkLi = document.getElementById("login-nav-item");
            if (loginLinkLi) loginLinkLi.remove();

            // Add Logout Button
            const logoutLi = document.createElement("li");
            const logoutBtn = document.createElement("a");
            logoutBtn.href = "#";
            logoutBtn.innerText = "Logout";
            logoutBtn.className = "btn";
            logoutBtn.style.background = "#e74c3c";
            logoutBtn.style.color = "white";
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                logoutUser();
            });
            logoutLi.appendChild(logoutBtn);
            navLinks.appendChild(logoutLi);
        } else if (navLinks) {
            // Display Login/Signup for guests
            const loginLi = document.createElement("li");
            loginLi.id = "login-nav-item";
            const loginBtn = document.createElement("a");
            loginBtn.href = "login.html";
            loginBtn.innerText = "Login / Sign Up";
            loginBtn.className = "btn btn-outline";
            loginLi.appendChild(loginBtn);
            navLinks.appendChild(loginLi);
        }
    }
});
