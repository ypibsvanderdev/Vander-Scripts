const blob = document.getElementById("blob");

if (blob) {
    document.body.onpointermove = event => {
        const { clientX, clientY } = event;
        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });
    };
}

// Add glow effect to cards on hover
const cards = document.querySelectorAll(".script-card");
cards.forEach(card => {
    card.onmousemove = e => {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };
});

// Animated Login Modal Logic
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");

if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.classList.add("active");
    });
}

if (closeModal) {
    closeModal.addEventListener("click", () => {
        loginModal.classList.remove("active");
    });
}

window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove("active");
    }
});

// Scroll Reveal Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// 3D Tilt Effect for Script Cards
cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
});

// Typewriter Effect
const textOptions = ["Dominate the Game.", "Rule the Market.", "Automate Everything."];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeElement = document.getElementById("typewriter");

function typeWriter() {
    if (!typeElement) return;
    const currentText = textOptions[textIndex];
    if (isDeleting) {
        typeElement.textContent = currentText.substring(0, charIndex--);
    } else {
        typeElement.textContent = currentText.substring(0, charIndex++);
    }
    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentText.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textOptions.length;
        speed = 500;
    }
    setTimeout(typeWriter, speed);
}
setTimeout(typeWriter, 1000);

// Mobile Hamburger Menu 
const mobileMenu = document.getElementById("mobile-menu");
const navLinksContainer = document.querySelector(".nav-links");

if (mobileMenu) {
    mobileMenu.addEventListener("click", () => {
        mobileMenu.classList.toggle("is-active");
        navLinksContainer.classList.toggle("active");
    });
}

if (navLinksContainer) {
    navLinksContainer.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            mobileMenu.classList.remove("is-active");
            navLinksContainer.classList.remove("active");
        }
    });
}

// ParticleJS Configuration
if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
    particlesJS("particles-js", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: ["#2196f3", "#9c27b0", "#ffffff"] },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#2196f3", opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.8 } }, push: { particles_nb: 3 } }
        },
        retina_detect: true
    });
}

// Advanced Checkout Application Logic
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const purchaseBtns = document.querySelectorAll(".purchase-btn");
const checkoutItemName = document.getElementById("checkout-item-name");
const checkoutItemPrice = document.getElementById("checkout-item-price");
const generateInvoiceBtn = document.querySelector(".btn-generate-invoice");

purchaseBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const session = JSON.parse(localStorage.getItem("vander_session"));
        if (!session) {
            alert("⚠️ You must be logged in for secure checkout.");
            loginModal.classList.add("active");
            return;
        }
        checkoutItemName.textContent = btn.getAttribute("data-name");
        checkoutItemPrice.textContent = `$${btn.getAttribute("data-price")}`;
        checkoutModal.classList.add("active");
    });
});

if (closeCheckout) closeCheckout.addEventListener("click", () => checkoutModal.classList.remove("active"));
if (generateInvoiceBtn) {
    generateInvoiceBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const session = JSON.parse(localStorage.getItem("vander_session"));
        this.textContent = "VERIFYING BLOCKCHAIN...";
        this.style.pointerEvents = "none";
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
            const userIndex = users.findIndex(u => u.username === session.username);
            if (userIndex !== -1) {
                if (!users[userIndex].purchased) users[userIndex].purchased = [];
                users[userIndex].purchased.push(checkoutItemName.textContent);
                localStorage.setItem("vander_users", JSON.stringify(users));
            }
            this.textContent = "PAYMENT SUCCESS ⚡";
            setTimeout(() => window.location.assign("dashboard.html"), 1000);
        }, 2000);
    });
}

// REAL AUTH LOGIC (Supabase Integration)
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const authEmail = document.getElementById("authEmail");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const discordLoginBtn = document.getElementById("discordLogin");
const googleLoginBtn = document.getElementById("googleLogin");

function setTabState(state) {
    if (state === "login") {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        authEmail.style.display = "none";
        document.getElementById("authDividerText").textContent = "OR LOGIN WITH KEY";
        authSubmitBtn.textContent = "Authenticate";
    } else {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        authEmail.style.display = "block";
        document.getElementById("authDividerText").textContent = "OR REGISTER WITH EMAIL";
        authSubmitBtn.textContent = "Create Account";
    }
}

if (tabLogin) tabLogin.addEventListener("click", () => setTabState("login"));
if (tabSignup) tabSignup.addEventListener("click", () => setTabState("signup"));

async function handleOAuth(provider) {
    if (typeof supabase !== "undefined" && VANDER_CONFIG.SUPABASE_URL.includes("supabase.co")) {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: { redirectTo: VANDER_CONFIG.REDIRECT_URL }
        });
        if (error) alert("OAuth Error: " + error.message);
    } else {
        // Fallback for demo if keys not set
        alert("Activating Real " + provider + " Tunnel... (Demo Mode Redirect)");
        const username = provider + " User";
        const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
        if (!users.find(u => u.username === username)) users.push({ username, purchased: [] });
        localStorage.setItem("vander_users", JSON.stringify(users));
        localStorage.setItem("vander_session", JSON.stringify({ username, time: Date.now() }));
        window.location.assign("dashboard.html");
    }
}

if (discordLoginBtn) discordLoginBtn.addEventListener("click", (e) => { e.preventDefault(); handleOAuth("discord"); });
if (googleLoginBtn) googleLoginBtn.addEventListener("click", (e) => { e.preventDefault(); handleOAuth("google"); });

if (authSubmitBtn) {
    authSubmitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const username = (authEmail.value || document.getElementById("authKey").value || "User").split("@")[0];
        const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
        if (!users.find(u => u.username === username)) users.push({ username, purchased: [] });
        localStorage.setItem("vander_users", JSON.stringify(users));
        localStorage.setItem("vander_session", JSON.stringify({ username, time: Date.now() }));
        window.location.assign("dashboard.html");
    });
}
