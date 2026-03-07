// VANDER ELITE DASHBOARD LOGIC (SECURITY HARDENED + ELITE UI)
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

    // 3. SECURE HASH MAPPING (SushiX V10 Protocol)
    const SECURE_FILES = {
        "Vander Hop Finder": "v_fnd_77x.lua",
        "Sniper GUI": "v_snp_88q.lua",
        "Mass Botter": "v_bot_a2.lua",
        "Universal Esp": "v_esp_v8.lua"
    };

    // 4. Render Licenses with Elite Design
    const scriptContainer = document.getElementById("purchasedScriptsList");
    if (scriptContainer) {
        if (!user.purchased || user.purchased.length === 0) {
            scriptContainer.innerHTML = `
                <div class="empty-state reveal active" style="padding: 3rem; border: 1px dashed rgba(33, 150, 243, 0.3); border-radius: 20px; text-align: center; background: rgba(33, 150, 243, 0.05);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛰️</div>
                    <p style="color: #fff; font-weight: 700; font-size: 1.2rem;">NO ACTIVE SATELLITE LINKS</p>
                    <p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-bottom: 1.5rem;">Initialize modules in the store to begin.</p>
                    <a href="index.html#store" class="btn-primary" style="display: inline-block; text-decoration: none; padding: 0.8rem 2rem;">VISIT STORE ↗</a>
                </div>`;
        } else {
            scriptContainer.innerHTML = user.purchased.map(scriptName => {
                const fileHash = SECURE_FILES[scriptName] || "v_locked.lua";
                const licenseKey = "VNDR-" + Math.random().toString(36).substr(2, 9).toUpperCase();

                return `
                <div class="purchased-item reveal active" style="background: linear-gradient(135deg, rgba(25, 25, 35, 0.8), rgba(15, 15, 20, 0.9)); padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                    <div class="glow-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at top right, rgba(33, 150, 243, 0.1) 0%, transparent 60%); pointer-events: none;"></div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; z-index: 1; position: relative;">
                        <div style="flex-grow: 1;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 0.5rem;">
                                <div class="pulse-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 15px #00ff88; animation: pulse 2s infinite;"></div>
                                <h3 style="margin: 0; font-size: 1.5rem; font-weight: 900; letter-spacing: 1px; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${scriptName.toUpperCase()}</h3>
                            </div>
                            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 1.2rem; font-weight: 500;">PROTOCOL: <span style="color: #2196f3;">SUSHI-X-V10</span> | STATUS: <span style="color: #00ff88;">GUARDED</span></p>
                            
                            <div style="background: rgba(0,0,0,0.4); padding: 1.2rem; border-radius: 15px; border: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: space-between;">
                                <div>
                                    <p style="font-size: 0.6rem; color: rgba(255,255,255,0.3); margin: 0; text-transform: uppercase; letter-spacing: 2px;">License</p>
                                    <p style="font-family: 'Consolas', monospace; font-weight: 700; color: #2196f3; margin: 0; font-size: 1rem;">${licenseKey}</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="font-size: 0.6rem; color: rgba(255,255,255,0.3); margin: 0; text-transform: uppercase;">Encryption</p>
                                    <p style="font-weight: 800; color: #9333ea; margin: 0; font-size: 0.9rem;">AES-256</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-left: 2rem;">
                            <button class="btn-primary copy-loader-btn" data-file="${fileHash}" style="padding: 1rem 2rem; font-size: 0.9rem; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);">COPY LOADER</button>
                        </div>
                    </div>
                </div>
            `;
            }).join("");
        }
    }

    // 5. SECURE LOADER GENERATOR
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("copy-loader-btn")) {
            const fileName = e.target.getAttribute("data-file");
            // The Loader Tunnel URL - Hidden behind the SushiX Backend
            const loaderCode = `loadstring(game:HttpGet("https://sushix-protect-elite.onrender.com/raw/${fileName}"))()`;

            navigator.clipboard.writeText(loaderCode).then(() => {
                const originalText = e.target.textContent;
                e.target.textContent = "COPIED! ⚡";
                e.target.style.background = "#00ff88";
                e.target.style.color = "#000";
                e.target.style.boxShadow = "0 0 30px rgba(0, 255, 136, 0.5)";

                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = "";
                    e.target.style.color = "";
                    e.target.style.boxShadow = "";
                }, 2000);
            });
        }
    });

    // 6. FIX LOGOUT (HARD-WIRED)
    const lBtn = document.getElementById("logoutBtn");
    if (lBtn) {
        lBtn.onclick = async (e) => {
            e.preventDefault();
            lBtn.textContent = "DE-SYNCHRONIZING...";
            if (vander_supabase) await vander_supabase.auth.signOut();
            localStorage.removeItem("vander_session");
            setTimeout(() => window.location.href = "index.html", 800);
        };
    }

    // 7. 3D Card Interactions
    const items = document.querySelectorAll(".purchased-item");
    items.forEach(item => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rX = (y - centerY) / 25;
            const rY = (centerX - x) / 25;
            item.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.02)`;
        });
        item.addEventListener("mouseleave", () => {
            item.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // 8. Background Particles
    if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
        particlesJS("particles-js", {
            particles: {
                number: { value: 30 },
                color: { value: "#2196f3" },
                opacity: { value: 0.1 },
                size: { value: 2 },
                line_linked: { enable: true, distance: 150, opacity: 0.05 },
                move: { enable: true, speed: 1 }
            }
        });
    }
});

// Pulse Animation Keyframes (Injected via JS if needed, but assuming CSS has it)
if (!document.getElementById('dash-animations')) {
    const style = document.createElement('style');
    style.id = 'dash-animations';
    style.innerHTML = `
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
