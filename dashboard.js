// VANDER ELITE DASHBOARD LOGIC (HARDENED SUSHIX-V11)
document.addEventListener("DOMContentLoaded", async () => {

    // 1. Session & Auth Check
    let sessionToken = localStorage.getItem("vander_session");
    let user = null;

    if (vander_supabase) {
        const { data: { user: sUser } } = await vander_supabase.auth.getUser();
        if (sUser) user = { username: sUser.email.split("@")[0], purchased: [] };
    }

    if (!user && sessionToken) {
        const parsed = JSON.parse(sessionToken);
        const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
        user = users.find(u => u.username === parsed.username) || { username: parsed.username, purchased: [] };
    }

    // Redirect if NO session
    if (!user) { window.location.href = "index.html"; return; }

    // 2. Set Branding
    const uDisplay = document.getElementById("usernameDisplay");
    if (uDisplay) uDisplay.textContent = user.username.toUpperCase();

    // 3. SECURE HASH MAPPING (V11 Secure Tunnel)
    const SECURE_MAP = {
        "Vander Hop Finder": "v_fnd_77x.lua",
        "Sniper GUI": "v_snp_88q.lua",
        "Mass Botter": "v_bot_a2.lua",
        "Universal Esp": "v_esp_v8.lua"
    };

    // 4. Render Elite License Cards
    const sCont = document.getElementById("purchasedScriptsList");
    if (sCont) {
        if (!user.purchased || user.purchased.length === 0) {
            sCont.innerHTML = `
                <div style="padding: 3rem; border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px; text-align: center; background: rgba(255,255,255,0.02);">
                    <p style="color: grey; font-size: 0.9rem;">NO ACTIVE ELITE LICENSES DETECTED.</p>
                    <a href="index.html#store" style="color: #2196f3; text-decoration: none; font-weight: 700;">PROCEED TO ARMORY ↗</a>
                </div>`;
        } else {
            sCont.innerHTML = user.purchased.map(s => {
                const fileHash = SECURE_MAP[s] || "v_locked.lua";
                const key = "VNDR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
                return `
                <div class="purchased-item" style="background: linear-gradient(135deg, rgba(20,20,25,0.9), rgba(10,10,15,1)); padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: transform 0.3s ease, border-color 0.3s ease;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 10px #00ff88;"></div>
                            <p style="font-weight: 900; color: #fff; margin:0; font-size: 1.2rem; letter-spacing: 1px;">${s.toUpperCase()}</p>
                        </div>
                        <p style="font-size: 0.7rem; color: #2196f3; margin: 0; font-weight: 600;">ENCRYPTION: SUSHIX-V11 // STATUS: SECURE</p>
                        <p style="font-size: 0.6rem; color: rgba(255,255,255,0.3); margin-top: 10px; font-family: monospace;">LICENSE: ${key}</p>
                    </div>
                    <button class="action-btn copy-code-btn" data-file="${fileHash}" style="width: auto; padding: 0.8rem 1.5rem; font-weight: 800; border-radius: 12px; background: #2196f3; border: none; color: #fff; cursor: pointer;">COPY LOADER</button>
                </div>
            `}).join("");
        }
    }

    // 5. SECURE LOADER GEN (TUNNEL ONLY)
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("copy-code-btn")) {
            const fileName = e.target.getAttribute("data-file");
            // Points to the secure tunneled bridge - NO RAW URLS
            const loaderCode = `loadstring(game:HttpGet("https://sushix-protect-elite.onrender.com/v1/sx/secure-tunnel/${fileName}"))()`;

            navigator.clipboard.writeText(loaderCode).then(() => {
                const originalText = e.target.textContent;
                e.target.textContent = "COPIED! ⚡";
                e.target.style.background = "#00ff88";
                e.target.style.color = "#000";
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = "";
                    e.target.style.color = "";
                }, 2000);
            });
        }
    });

    // 6. Hard-Wired Logout
    const lBtn = document.getElementById("logoutBtn");
    if (lBtn) {
        lBtn.onclick = async (e) => {
            e.preventDefault();
            lBtn.textContent = "WIPING SESSION...";
            if (vander_supabase) await vander_supabase.auth.signOut();
            localStorage.removeItem("vander_session");
            setTimeout(() => window.location.href = "index.html", 800);
        };
    }

    // 7. Hover Effects
    document.querySelectorAll(".purchased-item").forEach(item => {
        item.onmouseenter = () => item.style.borderColor = "rgba(33, 150, 243, 0.4)";
        item.onmouseleave = () => item.style.borderColor = "rgba(255, 255, 255, 0.05)";
    });

    // 8. Particles
    if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
        particlesJS("particles-js", {
            particles: {
                number: { value: 30 }, color: "#2196f3", opacity: 0.1, size: 2, line_linked: { enable: true, distance: 150, opacity: 0.05 }, move: { enable: true, speed: 0.5 }
            }
        });
    }
});
