// Dashboard Core Logic (Real Auth Integrated)
document.addEventListener("DOMContentLoaded", async () => {

    let isSupabaseUser = false;
    let currentUser = { username: "Elite Member", purchased: [] };

    // 1. Initial Attempt: Check Supabase Real Session
    if (typeof supabase !== "undefined" && VANDER_CONFIG.SUPABASE_URL.includes("supabase.co")) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            isSupabaseUser = true;
            currentUser.username = user.email.split("@")[0];
            // Fetch real purchased items from Supabase in the future
        }
    }

    // 2. Fallback: Check Local Storage Manual Session
    const sessionToken = localStorage.getItem("vander_session");
    if (!isSupabaseUser && !sessionToken) {
        window.location.href = "index.html";
        return;
    }

    if (!isSupabaseUser) {
        const session = JSON.parse(sessionToken);
        const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
        const found = users.find(u => u.username === session.username);
        if (found) currentUser = found;
    }

    // Update UI
    const userDisplay = document.getElementById("usernameDisplay");
    if (userDisplay) userDisplay.textContent = currentUser.username;

    const scriptContainer = document.getElementById("purchasedScriptsList");
    if (scriptContainer) {
        if (!currentUser.purchased || currentUser.purchased.length === 0) {
            scriptContainer.innerHTML = `
                <div style="padding: 2rem; border: 1px dashed var(--glass-border); border-radius: 12px; text-align: center;">
                    <p style="color: var(--text-muted);">No active premium licenses found.</p>
                    <a href="index.html#store" style="color: var(--primary); font-weight: 700; text-decoration: none; margin-top: 10px; display: block;">Unlock Arsenal ↗</a>
                </div>`;
        } else {
            scriptContainer.innerHTML = currentUser.purchased.map(script => `
                <div class="purchased-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                        <div>
                            <p style="font-weight: 800; font-size: 1.1rem; color: #fff;">${script}</p>
                            <p style="font-size: 0.8rem; color: #00ff88;">LICENSE: ELITE-V9</p>
                        </div>
                        <button class="action-btn copy-code-btn" data-script="${script}" style="width: auto; padding: 0.5rem 1rem;">Copy Code</button>
                    </div>
                </div>
            `).join("");
        }
    }

    // Logout Logic (Real & Simulated)
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            logoutBtn.innerHTML = "Logging out...";
            if (isSupabaseUser) await supabase.auth.signOut();
            localStorage.removeItem("vander_session");
            window.location.href = "index.html";
        });
    }

    // Copy Button Simulation
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("copy-code-btn")) {
            const originalText = e.target.textContent;
            e.target.textContent = "Copied!";
            e.target.style.background = "#00ff88";
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.background = "";
            }, 2000);
        }
    });

    // Handle Desktop Particles (Subtle)
    if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
        particlesJS("particles-js", {
            particles: {
                number: { value: 30 },
                color: { value: "#2196f3" },
                opacity: { value: 0.2 },
                size: { value: 2 },
                line_linked: { enable: true, distance: 150, opacity: 0.1 },
                move: { enable: true, speed: 1 }
            }
        });
    }
});
