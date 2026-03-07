// Dashboard Core Logic
document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is authenticated via local storage
    const sessionToken = localStorage.getItem("vander_session");
    if (!sessionToken) {
        // Force redirect back to login if they try to bypass
        window.location.href = "index.html";
        return;
    }

    // Set Username based on dummy token
    const userDisplay = document.getElementById("usernameDisplay");
    try {
        const parsedToken = JSON.parse(sessionToken);
        if (parsedToken.username) {
            userDisplay.textContent = parsedToken.username;
        }
    } catch (e) { }

    // Logout logic
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutBtn.innerHTML = "<span class='icon'>🚪</span> Logging out...";
            setTimeout(() => {
                localStorage.removeItem("vander_session");
                window.location.href = "index.html";
            }, 800);
        });
    }

    // Interactive Action Buttons
    const actionBtns = document.querySelectorAll(".action-btn");
    actionBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const originalText = this.textContent;
            this.textContent = "Processing...";
            this.style.opacity = "0.7";

            setTimeout(() => {
                this.textContent = originalText === "Download Loader (.exe)" ? "Loader Downloading..." : "Key Generated!";
                this.style.opacity = "1";

                if (originalText !== "Download Loader (.exe)") {
                    setTimeout(() => { this.textContent = originalText; }, 2000);
                }
            }, 1000);
        });
    });

    // ParticleJS Configuration for Dashboard (Subtle effect)
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: ["#2196f3", "#9c27b0"] },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: true, distance: 150, color: "#2196f3", opacity: 0.1, width: 1 },
                move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } }
                }
            },
            retina_detect: true
        });
    }
});
