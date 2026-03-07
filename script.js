const blob = document.getElementById("blob");

document.body.onpointermove = event => {
    const { clientX, clientY } = event;

    // Use animate to make the movement smooth and continuous
    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" });
};

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

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.add("active");
});

closeModal.addEventListener("click", () => {
    loginModal.classList.remove("active");
});

// Close when clicking outside the box
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

        // 3D Rotation Calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
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
        speed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textOptions.length;
        speed = 500; // Pause before new word
    }

    setTimeout(typeWriter, speed);
}
setTimeout(typeWriter, 1000);

// Mobile Hamburger Menu 
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("is-active");
    navLinks.classList.toggle("active");
});

// Close mobile menu when a link is clicked
navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        mobileMenu.classList.remove("is-active");
        navLinks.classList.remove("active");
    }
});

// ParticleJS Configuration for Premium Space Effect
if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: ["#2196f3", "#9c27b0", "#ffffff"] },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 150, color: "#2196f3", opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.8 } },
                push: { particles_nb: 3 }
            }
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
const payBtns = document.querySelectorAll(".pay-btn");

purchaseBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const itemName = btn.getAttribute("data-name");
        const itemPrice = btn.getAttribute("data-price");

        checkoutItemName.textContent = itemName;
        checkoutItemPrice.textContent = `$${itemPrice}`;

        checkoutModal.classList.add("active");
    });
});

closeCheckout.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove("active");
    }
});

// Payment Method Selection
payBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        payBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

document.querySelector(".btn-generate-invoice").addEventListener("click", function () {
    this.textContent = "GENERATING INVOICE...";
    this.style.background = "#5865F2";
    setTimeout(() => {
        this.textContent = "REDIRECTING TO GATEWAY...";
        setTimeout(() => {
            window.location.href = "https://discord.gg/yTX7Nh6r";
        }, 1500);
    }, 1500);
});

// Auth Tab Logic (SignIn vs SignUp)
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const authEmail = document.getElementById("authEmail");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authDividerText = document.getElementById("authDividerText");

function setTabState(state) {
    if (state === "login") {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");

        authEmail.style.opacity = "0";
        setTimeout(() => { authEmail.style.display = "none"; }, 300);

        authDividerText.textContent = "OR LOGIN WITH KEY";
        authSubmitBtn.textContent = "Authenticate";
    } else {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");

        authEmail.style.display = "block";
        setTimeout(() => { authEmail.style.opacity = "1"; }, 10);

        authDividerText.textContent = "OR REGISTER WITH EMAIL";
        authSubmitBtn.textContent = "Create Root Account";
    }
}

tabLogin.addEventListener("click", () => setTabState("login"));
tabSignup.addEventListener("click", () => setTabState("signup"));

// OAuth Redirect Simulations
const discordLogin = document.getElementById("discordLogin");
const googleLogin = document.getElementById("googleLogin");

function simulateOAuthPath(btnElement, defaultText, newText, providerName) {
    btnElement.addEventListener("click", function (e) {
        e.preventDefault();
        this.innerHTML = `<span style="opacity: 0.8;">${newText}</span>`;
        this.style.pointerEvents = "none";

        setTimeout(() => {
            const sessionData = {
                username: providerName + " Client",
                time: Date.now(),
                auth: true
            };
            localStorage.setItem("vander_session", JSON.stringify(sessionData));
            console.log("Session Created:", sessionData);
            window.location.assign("dashboard.html");
        }, 1500);
    });
}

simulateOAuthPath(discordLogin, "Continue with Discord", "Authenticating via Discord...", "Discord");
simulateOAuthPath(googleLogin, "Continue with Google", "Authenticating via Google...", "Google");

// Manual Login/Register Submission Logic
if (authSubmitBtn) {
    authSubmitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const originalText = authSubmitBtn.textContent;
        authSubmitBtn.textContent = "Verifying Credentials...";
        authSubmitBtn.style.pointerEvents = "none";

        setTimeout(() => {
            const rawInput = authEmail.value || document.getElementById("authKey").value || "Root Administrator";
            const username = rawInput.split('@')[0];

            const sessionData = {
                username: username,
                time: Date.now(),
                auth: true
            };
            localStorage.setItem("vander_session", JSON.stringify(sessionData));
            console.log("Manual Session Created:", sessionData);
            window.location.assign("dashboard.html");
        }, 1200);
    });
}
