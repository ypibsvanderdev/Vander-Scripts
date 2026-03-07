// VANDER ELITE MAIN LOGIC
document.addEventListener("DOMContentLoaded", () => {

    // Core Elements
    const blob = document.getElementById("blob");
    const loginBtn = document.getElementById("loginBtn");
    const loginModal = document.getElementById("loginModal");
    const closeModal = document.getElementById("closeModal");
    const tabLogin = document.getElementById("tabLogin");
    const tabSignup = document.getElementById("tabSignup");
    const authEmail = document.getElementById("authEmail");
    const authKey = document.getElementById("authKey");
    const authSubmitBtn = document.getElementById("authSubmitBtn");
    const discordLoginBtn = document.getElementById("discordLogin");
    const googleLoginBtn = document.getElementById("googleLogin");

    // 1. Mouse Follower
    if (blob) {
        document.body.onpointermove = (e) => {
            const { clientX, clientY } = e;
            blob.animate({ left: `${clientX}px`, top: `${clientY}px` }, { duration: 3000, fill: "forwards" });
        };
    }

    // 2. Login Modal Tunnels
    if (loginBtn) loginBtn.onclick = (e) => { e.preventDefault(); loginModal.classList.add("active"); };
    if (closeModal) closeModal.onclick = () => loginModal.classList.remove("active");
    window.onclick = (e) => { if (e.target === loginModal) loginModal.classList.remove("active"); };

    if (tabLogin) tabLogin.onclick = () => setTabState("login");
    if (tabSignup) tabSignup.onclick = () => setTabState("signup");

    function setTabState(state) {
        if (state === "login") {
            tabLogin.classList.add("active"); tabSignup.classList.remove("active");
            authEmail.style.display = "none"; document.getElementById("authDividerText").textContent = "OR LOGIN WITH KEY";
            authSubmitBtn.textContent = "Authenticate";
        } else {
            tabSignup.classList.add("active"); tabLogin.classList.remove("active");
            authEmail.style.display = "block"; document.getElementById("authDividerText").textContent = "OR REGISTER WITH EMAIL";
            authSubmitBtn.textContent = "Create Account";
        }
    }

    // 3. REAL OAuth Logic (Google & Discord)
    async function performRealOAuth(provider) {
        // If Supabase is configured, use it for REAL popups
        if (vander_supabase) {
            const { error } = await vander_supabase.auth.signInWithOAuth({
                provider: provider,
                options: { redirectTo: VANDER_CONFIG.REDIRECT_URL }
            });
            if (error) {
                console.error("OAuth Error:", error.message);
                alert("Auth Error: " + error.message);
            }
        } else {
            // IF NOT CONFIGURED: Simulate high-fidelity login and redirect
            console.warn("Keys missing. Simulation Engaged.");
            const dummyUser = provider.charAt(0).toUpperCase() + provider.slice(1) + " Client";
            const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
            if (!users.find(u => u.username === dummyUser)) users.push({ username: dummyUser, purchased: [] });
            localStorage.setItem("vander_users", JSON.stringify(users));
            localStorage.setItem("vander_session", JSON.stringify({ username: dummyUser }));

            // Pulse Animation
            const btn = provider === "google" ? googleLoginBtn : discordLoginBtn;
            btn.textContent = `Authenticating via ${provider}...`;
            setTimeout(() => window.location.href = "dashboard.html", 1500);
        }
    }

    if (discordLoginBtn) discordLoginBtn.onclick = (e) => { e.preventDefault(); performRealOAuth("discord"); };
    if (googleLoginBtn) googleLoginBtn.onclick = (e) => { e.preventDefault(); performRealOAuth("google"); };

    // 4. Manual Login/Signup
    if (authSubmitBtn) {
        authSubmitBtn.onclick = (e) => {
            e.preventDefault();
            const email = authEmail.value;
            const key = authKey.value;
            const user = (email || key || "Elite Member").split("@")[0];

            const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
            if (!users.find(u => u.username === user)) users.push({ username: user, purchased: [] });
            localStorage.setItem("vander_users", JSON.stringify(users));
            localStorage.setItem("vander_session", JSON.stringify({ username: user }));

            authSubmitBtn.textContent = "VERIFYING...";
            setTimeout(() => window.location.href = "dashboard.html", 800);
        };
    }

    // 5. Scroll Reveals & Cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("active"); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    document.querySelectorAll(".script-card").forEach(card => {
        card.onmousemove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const centerX = rect.width / 2, centerY = rect.height / 2;
            const rX = ((y - centerY) / centerY) * -10, rY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-10px)`;
            card.style.setProperty("--mouse-x", `${x}px`); card.style.setProperty("--mouse-y", `${y}px`);
        };
        card.onmouseleave = () => card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
    });

    // 6. Typewriter
    const tOps = ["Dominate the Game.", "Rule the Market.", "Automate Everything."];
    let tIdx = 0, cIdx = 0, isD = false;
    const tEl = document.getElementById("typewriter");
    function type() {
        if (!tEl) return;
        const c = tOps[tIdx];
        tEl.textContent = isD ? c.substring(0, cIdx--) : c.substring(0, cIdx++);
        let s = isD ? 50 : 100;
        if (!isD && cIdx === c.length) { s = 2000; isD = true; }
        else if (isD && cIdx === 0) { isD = false; tIdx = (tIdx + 1) % tOps.length; s = 500; }
        setTimeout(type, s);
    }
    setTimeout(type, 1000);

    // 7. Store Logic
    const cModal = document.getElementById("checkoutModal");
    const closeC = document.getElementById("closeCheckout");
    const payBtn = document.querySelector(".btn-generate-invoice");
    document.querySelectorAll(".purchase-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            if (!localStorage.getItem("vander_session")) { alert("Login Required."); loginModal.classList.add("active"); return; }
            document.getElementById("checkout-item-name").textContent = btn.getAttribute("data-name");
            document.getElementById("checkout-item-price").textContent = `$${btn.getAttribute("data-price")}`;
            cModal.classList.add("active");
        };
    });
    if (closeC) closeC.onclick = () => cModal.classList.remove("active");
    if (payBtn) {
        payBtn.onclick = (e) => {
            e.preventDefault();
            payBtn.textContent = "SYNCING CRYPTO...";
            setTimeout(() => {
                const s = JSON.parse(localStorage.getItem("vander_session"));
                const us = JSON.parse(localStorage.getItem("vander_users") || "[]");
                const uIdx = us.findIndex(u => u.username === s.username);
                if (uIdx !== -1) {
                    if (!us[uIdx].purchased) us[uIdx].purchased = [];
                    us[uIdx].purchased.push(document.getElementById("checkout-item-name").textContent);
                    localStorage.setItem("vander_users", JSON.stringify(us));
                }
                payBtn.textContent = "SUCCESS!";
                setTimeout(() => window.location.href = "dashboard.html", 1000);
            }, 2000);
        };
    }
});
