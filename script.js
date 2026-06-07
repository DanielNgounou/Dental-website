const serviceCards = document.querySelectorAll(".service-card");
const servicesGrid = document.querySelector(".services-grid");

serviceCards.forEach(card => {
    card.addEventListener("click", () => {
        const isActive = card.classList.contains("active");

        serviceCards.forEach(item => item.classList.remove("active"));
        servicesGrid.classList.remove("has-active");

        if (!isActive) {
            card.classList.add("active");
            servicesGrid.classList.add("has-active");
        }
    });
});