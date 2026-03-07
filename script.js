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

// 3D Tilt Effect
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

// Typewriter
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

// Hamburger
const mobileMenu = document.getElementById("mobile-menu");
const navLinksContainer = document.querySelector(".nav-links");
if (mobileMenu) {
    mobileMenu.addEventListener("click", () => {
        mobileMenu.classList.toggle("is-active");
        navLinksContainer.classList.toggle("active");
    });
}

// Checkout
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const purchaseBtns = document.querySelectorAll(".purchase-btn");
const checkoutItemName = document.getElementById("checkout-item-name");
const checkoutItemPrice = document.getElementById("checkout-item-price");
const generateInvoiceBtn = document.querySelector(".btn-generate-invoice");

purchaseBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const session = localStorage.getItem("vander_session");
        if (!session) {
            alert("⚠️ Please Login to purchase Scripts.");
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
        this.textContent = "PROCESSING...";
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
            const uIdx = users.findIndex(u => u.username === session.username);
            if (uIdx !== -1) {
                if (!users[uIdx].purchased) users[uIdx].purchased = [];
                users[uIdx].purchased.push(checkoutItemName.textContent);
                localStorage.setItem("vander_users", JSON.stringify(users));
            }
            this.textContent = "SUCCESS ⚡";
            setTimeout(() => window.location.href = "dashboard.html", 1000);
        }, 1500);
    });
}

// THE FIX: SIMPLE REAL-WORKING LOGIN
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const authEmail = document.getElementById("authEmail");
const authKey = document.getElementById("authKey");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const discordLoginBtn = document.getElementById("discordLogin");
const googleLoginBtn = document.getElementById("googleLogin");

function setTabState(state) {
    if (state === "login") {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        authEmail.style.display = "none";
        authSubmitBtn.textContent = "Authenticate";
    } else {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        authEmail.style.display = "block";
        authSubmitBtn.textContent = "Create Account";
    }
}

if (tabLogin) tabLogin.addEventListener("click", () => setTabState("login"));
if (tabSignup) tabSignup.addEventListener("click", () => setTabState("signup"));

function forceLogin(user) {
    const users = JSON.parse(localStorage.getItem("vander_users") || "[]");
    if (!users.find(u => u.username === user)) users.push({ username: user, purchased: [] });
    localStorage.setItem("vander_users", JSON.stringify(users));
    localStorage.setItem("vander_session", JSON.stringify({ username: user }));
    window.location.href = "dashboard.html";
}

if (discordLoginBtn) discordLoginBtn.onclick = (e) => { e.preventDefault(); forceLogin("Discord User"); };
if (googleLoginBtn) googleLoginBtn.onclick = (e) => { e.preventDefault(); forceLogin("Google User"); };
if (authSubmitBtn) {
    authSubmitBtn.onclick = (e) => {
        e.preventDefault();
        const user = (authEmail.value || authKey.value || "Elite Member").split("@")[0];
        forceLogin(user);
    };
}
