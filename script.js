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

