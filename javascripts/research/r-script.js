import { copyrightCard } from "./copyright.js";
import { privacyCard } from "./privacy.js";
import { seoCard } from "./seo.js";
import { hostingCard } from "./hosting.js";
import { maintenanceCard } from "./maintenance.js";
import { securityCard } from "./security.js";


const cards = [
    copyrightCard,
    privacyCard,
    seoCard,
    hostingCard,
    maintenanceCard,
    securityCard
];


const flipCards = document.querySelectorAll(".research-flip-box");


flipCards.forEach((card, index) => {

    const cardData = cards[index];

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-pressed", "false");

    const toggleCard = () => {
        const isFlipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(isFlipped));
    };

    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleCard();
        }
    });

    // Put title on front of card
    card.querySelector(".front .title").textContent = cardData.title;

    // Put content on back of card
    card.querySelector(".back").innerHTML = `
        <div class="card-content">
            <h2>${cardData.title}</h2>
            ${cardData.content}
        </div>
    `;

});