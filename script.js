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
