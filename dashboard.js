// VANDER ELITE DASHBOARD LOGIC
document.addEventListener("DOMContentLoaded", async () => {

    // 1. Check Sessions (Real Supabase vs Local)
    let session = localStorage.getItem("vander_session");
    let user = null;

    if (vander_supabase) {
        const { data: { user: sUser } } = await vander_supabase.auth.getUser();
        if (sUser) user = { username: sUser.email.split("@")[0], purchased: [] };
    }

    if (!user && session) {
        const parsed = JSON.parse(session);
        const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
        user = users.find(u => u.username === parsed.username) || { username: parsed.username, purchased: [] };
    }

    // Redirect if NO session
    if (!user) { window.location.href = "index.html"; return; }

    // 2. Set Username
    const uDisplay = document.getElementById("usernameDisplay");
    if (uDisplay) uDisplay.textContent = user.username;

    // 3. Render Licenses
    const sCont = document.getElementById("purchasedScriptsList");
    if (sCont) {
        if (!user.purchased || user.purchased.length === 0) {
            sCont.innerHTML = `<div style="padding: 2rem; border: 1px dashed grey; border-radius: 12px; text-align: center;">
                <p style="color: grey;">No active licenses. <a href="index.html#store" style="color: #2196f3; text-decoration: none;">Visit Store ↗</a></p>
            </div>`;
        } else {
            sCont.innerHTML = user.purchased.map(s => `
                <div class="purchased-item" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div><p style="font-weight: 800; color: #fff; margin:0;">${s}</p><p style="font-size: 0.8rem; color: #00ff88; margin: 5px 0 0 0;">Status: ACTIVE</p></div>
                    <button class="action-btn" onclick="this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy Code',2000)" style="width: auto; padding: 0.5rem 1rem;">Copy Code</button>
                </div>
            `).join("");
        }
    }

    // 4. FIX LOGOUT (HARD-WIRED)
    const lBtn = document.getElementById("logoutBtn");
    if (lBtn) {
        lBtn.onclick = async (e) => {
            e.preventDefault();
            lBtn.textContent = "Logging out...";
            lBtn.style.opacity = "0.5";

            // Clear Real Supabase
            if (vander_supabase) await vander_supabase.auth.signOut();

            // Clear Local
            localStorage.removeItem("vander_session");

            // Redirect
            setTimeout(() => window.location.href = "index.html", 500);
        };
    }

    // Particle Cleanup for Dash
    if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
        particlesJS("particles-js", {
            particles: {
                number: { value: 20 }, color: "#2196f3", opacity: 0.2, size: 2, line_linked: { enable: true, distance: 150, opacity: 0.1 }, move: { enable: true, speed: 1 }
            }
        });
    }
});
