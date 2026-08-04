//==================================================
//            INITIALISATION
//==================================================

const welcomeScreen = document.getElementById("welcome-screen");
const invitation = document.getElementById("invitation");
const openBook = document.getElementById("openBook");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

let musicPlaying = false;

//==================================================
//      AU DÉMARRAGE
//==================================================

window.addEventListener("load", () => {

    invitation.style.display = "none";
    musicBtn.style.display = "none";

});

//==================================================
//      OUVRIR L'INVITATION
//==================================================

openBook.addEventListener("click", () => {

    welcomeScreen.style.opacity = "0";
    welcomeScreen.style.pointerEvents = "none";

    setTimeout(() => {

        welcomeScreen.style.display = "none";
        invitation.style.display = "block";
        musicBtn.style.display = "flex";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 800);

});

//==================================================
//          MUSIQUE
//==================================================

openBook.addEventListener("click", () => {

    music.play();
    musicPlaying = true;
    musicBtn.innerHTML = "🔊";

});

//==================================================
//      ACTIVER / DÉSACTIVER LA MUSIQUE
//==================================================

musicBtn.addEventListener("click", () => {

    if (musicPlaying) {

        music.pause();
        musicBtn.innerHTML = "🔇";

    } else {

        music.play();
        musicBtn.innerHTML = "🔊";

    }

    musicPlaying = !musicPlaying;

});

//==================================================
//      APPARITION DES PAGES
//==================================================

const pages = document.querySelectorAll(".page-container");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0px)";

        }

    });

}, {
    threshold: 0.25
});

pages.forEach(page => {

    page.style.opacity = "0";
    page.style.transform = "translateY(80px)";
    page.style.transition = "1s";

    observer.observe(page);

});

//==================================================
//      DÉFILEMENT FLUIDE
//==================================================

document.querySelectorAll(".scroll-indicator").forEach(indicator => {

    indicator.addEventListener("click", () => {

        indicator.parentElement.parentElement.nextElementSibling?.scrollIntoView({
            behavior: "smooth"
        });

    });

});

//==================================================
//      CHARGEMENT DES INVITÉS
//==================================================

async function loadGuest() {

    try {

        const response = await fetch("invites.json");
        const guests = await response.json();

        const params = new URLSearchParams(window.location.search);
        const inviteKey = params.get("invite");

        if (!inviteKey) return;

        const guest = guests[inviteKey];

        if (!guest) {

            console.error("Invité introuvable :", inviteKey);
            return;

        }

        // Page invitation
        document.getElementById("guestName").textContent = guest.nom;
        document.getElementById("guestTable").textContent = guest.table;

        // Page QR
        document.getElementById("guestNameQR").textContent = guest.nom;
        document.getElementById("guestTableQR").textContent = guest.table;

        // Titre de la page
        document.title = guest.nom + " | Invitation Mariage";

        // Génération du QR Code
        const qrContainer = document.getElementById("qrcode");

        if (qrContainer) {

            qrContainer.innerHTML = "";

            new QRCode(qrContainer, {
                text: guest.nom + " - " + guest.table,
                width: 220,
                height: 220
            });

        }

    }

    catch (error) {

        console.error("Erreur chargement invité :", error);

    }

}

loadGuest();

//==================================================
//      ANNÉE AUTOMATIQUE
//==================================================

document.querySelectorAll(".year").forEach(el => {

    el.textContent = new Date().getFullYear();

});

//==================================================
//      EFFET DE SCROLL
//==================================================

window.addEventListener("scroll", () => {

    document.querySelectorAll(".page").forEach(page => {

        const rect = page.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.75) {

            page.classList.add("visible");

        }

    });

});

//==================================================
//            LIVRE D'OR
//==================================================

const modal = document.getElementById("guestBookModal");
const openGuestBook = document.getElementById("openGuestBook");
const closeGuestBook = document.getElementById("closeGuestBook");
const sendMessage = document.getElementById("sendMessage");

openGuestBook.addEventListener("click", () => {

    modal.style.display = "flex";

});

closeGuestBook.addEventListener("click", () => {

    modal.style.display = "none";

});

sendMessage.addEventListener("click", () => {

    const nom = document.getElementById("guestAuthor").value;
    const message = document.getElementById("guestMessage").value;

    if (nom === "" || message === "") {

        alert("Veuillez compléter tous les champs.");
        return;

    }

    alert("Merci " + nom + " ❤️\nVotre message a été enregistré.");

    modal.style.display = "none";

    document.getElementById("guestAuthor").value = "";
    document.getElementById("guestMessage").value = "";

});

//==================================================
//      CONFIRMATION WHATSAPP
//==================================================

const numeroWhatsApp = "243823570465";

document.getElementById("confirmBtn").addEventListener("click", () => {

    const nom = document.getElementById("guestName").textContent;
    const table = document.getElementById("guestTable").textContent;

    const message =
`Bonjour,

Je suis ${nom} (${table}).

Je confirme avec plaisir ma présence au mariage de Prisca & Gloire prévu le 04 septembre 2026.

À très bientôt ! 💍`;

    window.open(
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

});

document.getElementById("absentBtn").addEventListener("click", () => {

    const nom = document.getElementById("guestName").textContent;
    const table = document.getElementById("guestTable").textContent;

    const message =
`Bonjour,

Je suis ${nom} (${table}).

Je vous remercie pour votre invitation.

Malheureusement, je ne pourrai pas être présent(e) à votre mariage.

Je vous souhaite une magnifique célébration et beaucoup de bonheur. ❤️`;

    window.open(
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

});