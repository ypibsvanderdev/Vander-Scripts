// Dashboard Core Logic
document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is authenticated via local storage
    const sessionToken = localStorage.getItem("vander_session");
    if (!sessionToken) {
        window.location.href = "index.html";
        return;
    }

    // Find actual user data
    const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
    const session = JSON.parse(sessionToken);
    const currentUser = users.find(u => u.username === session.username) || { username: session.username, purchased: [] };

    // Set Username
    const userDisplay = document.getElementById("usernameDisplay");
    if (userDisplay) userDisplay.textContent = currentUser.username;

    // Render Purchased Scripts
    const scriptContainer = document.getElementById("purchasedScriptsList");
    if (scriptContainer) {
        if (!currentUser.purchased || currentUser.purchased.length === 0) {
            scriptContainer.innerHTML = `
                <div style="padding: 2rem; border: 1px dashed var(--glass-border); border-radius: 12px; text-align: center;">
                    <p style="color: var(--text-muted);">No active licenses found.</p>
                    <a href="index.html#store" style="color: var(--primary); font-weight: 700; text-decoration: none; margin-top: 10px; display: block;">Visit Store ↗</a>
                </div>`;
        } else {
            scriptContainer.innerHTML = currentUser.purchased.map(script => `
                <div class="purchased-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                        <div>
                            <p style="font-weight: 800; font-size: 1.1rem; color: #fff;">${script}</p>
                            <p style="font-size: 0.8rem; color: #00ff88;">Status: ACTIVE</p>
                        </div>
                        <button class="action-btn copy-code-btn" data-script="${script}" style="width: auto; padding: 0.5rem 1rem;">Copy Code</button>
                    </div>
                </div>
            `).join("");
        }
    }

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

    // Copy Code Simulation
    const copyBtns = document.querySelectorAll(".copy-code-btn");
    copyBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const scriptName = this.getAttribute("data-script");
            const originalText = this.textContent;
            this.textContent = "Copied!";
            this.style.background = "#00ff88";
            this.style.color = "#000";

            console.log(`Copying code for: ${scriptName}`);

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = "";
                this.style.color = "";
            }, 2000);
        });
    });

    // ParticleJS Configuration
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
