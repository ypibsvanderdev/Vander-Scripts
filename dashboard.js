document.addEventListener("DOMContentLoaded", () => {

    // 1. Force Check Authentication
    const sessionToken = localStorage.getItem("vander_session");
    if (!sessionToken) {
        window.location.href = "index.html";
        return;
    }

    const session = JSON.parse(sessionToken);
    const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
    const currentUser = users.find(u => u.username === session.username) || { username: session.username, purchased: [] };

    // 2. Display Username
    const userDisplay = document.getElementById("usernameDisplay");
    if (userDisplay) userDisplay.textContent = currentUser.username;

    // 3. Render Purchased Scripts
    const scriptContainer = document.getElementById("purchasedScriptsList");
    if (scriptContainer) {
        if (!currentUser.purchased || currentUser.purchased.length === 0) {
            scriptContainer.innerHTML = `
                <div style="padding: 2rem; border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; text-align: center;">
                    <p style="color: grey;">No active licenses found.</p>
                    <a href="index.html#store" style="color: #2196f3; font-weight: 700; text-decoration: none; display: block; margin-top: 10px;">Visit Store ↗</a>
                </div>`;
        } else {
            scriptContainer.innerHTML = currentUser.purchased.map(script => `
                <div class="purchased-item" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="font-weight: 800; font-size: 1.1rem; color: #fff; margin: 0;">${script}</p>
                            <p style="font-size: 0.8rem; color: #00ff88; margin: 5px 0 0 0;">Status: ACTIVE</p>
                        </div>
                        <button class="action-btn" onclick="this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy Code',2000)" style="width: auto; padding: 0.5rem 1rem; border-radius: 8px;">Copy Code</button>
                    </div>
                </div>
            `).join("");
        }
    }

    // 4. FIX LOGOUT
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            logoutBtn.textContent = "Logging out...";
            localStorage.removeItem("vander_session");
            setTimeout(() => window.location.href = "index.html", 500);
        };
    }
});
