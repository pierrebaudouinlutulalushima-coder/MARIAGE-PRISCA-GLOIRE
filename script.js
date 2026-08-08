//==================================================
//            INITIALISATION
//==================================================


const welcomeScreen = document.getElementById("welcome-screen");
const invitation = document.getElementById("invitation");
const openBook = document.getElementById("openBook");

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");


// Etat de la musique

let musicPlaying = false;


// Vérification des éléments HTML

if (!welcomeScreen) {
    console.warn("welcome-screen introuvable");
}


if (!invitation) {
    console.warn("invitation introuvable");
}


if (!openBook) {
    console.warn("openBook introuvable");
}


if (!music) {
    console.warn("music introuvable");
}


if (!musicBtn) {
    console.warn("musicBtn introuvable");
}//==================================================
//            AU DÉMARRAGE
//==================================================


window.addEventListener("load", () => {


    // Cacher l'invitation au départ

    if (invitation) {
        invitation.style.display = "none";
    }


    // Cacher le bouton musique au départ

    if (musicBtn) {
        musicBtn.style.display = "none";
    }


    // Positionner l'écran d'accueil

    if (welcomeScreen) {

        welcomeScreen.style.opacity = "1";
        welcomeScreen.style.display = "flex";

    }


});//==================================================
//      OUVRIR L'INVITATION + MUSIQUE
//==================================================


if (openBook) {


    openBook.addEventListener("click", () => {


        // Animation disparition écran accueil

        if (welcomeScreen) {

            welcomeScreen.style.opacity = "0";
            welcomeScreen.style.pointerEvents = "none";

        }



        // Affichage invitation après animation

        setTimeout(() => {


            if (welcomeScreen) {

                welcomeScreen.style.display = "none";

            }


            if (invitation) {

                invitation.style.display = "block";

            }


            if (musicBtn) {

                musicBtn.style.display = "flex";

            }



            window.scrollTo({

                top: 0,
                behavior: "smooth"

            });



        }, 800);




        // Démarrage automatique musique

        if (music) {


            music.play()

            .then(() => {


                musicPlaying = true;


                if (musicBtn) {

                    musicBtn.innerHTML = "🔊";

                }


            })


            .catch(error => {


                console.log(
                    "La lecture automatique de la musique est bloquée par le navigateur :",
                    error
                );


            });


        }



    });


} //==================================================
//      ACTIVER / DÉSACTIVER LA MUSIQUE
//==================================================


if (musicBtn) {


    musicBtn.addEventListener("click", () => {



        if (!music) {

            console.warn("Aucun fichier audio trouvé");

            return;

        }




        if (musicPlaying) {



            // Pause musique

            music.pause();


            musicBtn.innerHTML = "🔇";



        } else {



            // Reprendre musique

            music.play()

            .then(() => {


                musicBtn.innerHTML = "🔊";


            })

            .catch(error => {


                console.log(
                    "Impossible de lire la musique :",
                    error
                );


            });



        }



        musicPlaying = !musicPlaying;



    });


}//==================================================
//      APPARITION DES PAGES AU SCROLL
//==================================================


const pages = document.querySelectorAll(".page-container");



if (pages.length > 0) {



    const observer = new IntersectionObserver((entries) => {



        entries.forEach(entry => {



            if (entry.isIntersecting) {



                entry.target.style.opacity = "1";

                entry.target.style.transform = "translateY(0)";



                // Arrêter l'observation après apparition

                observer.unobserve(entry.target);



            }



        });



    }, {


        threshold: 0.25


    });






    pages.forEach(page => {



        // Etat initial avant apparition

        page.style.opacity = "0";

        page.style.transform = "translateY(80px)";

        page.style.transition = "all 1s ease";



        observer.observe(page);



    });



}//==================================================
//      DÉFILEMENT FLUIDE DES SECTIONS
//==================================================


const scrollIndicators = document.querySelectorAll(".scroll-indicator");



if (scrollIndicators.length > 0) {



    scrollIndicators.forEach(indicator => {



        indicator.addEventListener("click", () => {



            const currentPage = indicator.closest(".page-container");



            if (currentPage) {



                const nextPage = currentPage.nextElementSibling;



                if (nextPage) {



                    nextPage.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });



                }



            }



        });



    });



}//==================================================
//      CHARGEMENT DES INVITÉS + QR CODE
//==================================================


async function loadGuest() {


    try {


        const response = await fetch("invites.json");


        if (!response.ok) {

            throw new Error("Impossible de charger invites.json");

        }



        const data = await response.json();



        const params = new URLSearchParams(window.location.search);


        const inviteKey = params.get("invite");



        if (!inviteKey) {


            console.log("Aucun invité dans l'URL");


            return;


        }




        let guestFound = null;




        // Recherche dans toutes les tables

        data.tables.forEach(table => {



            table.invites.forEach(invite => {



                const key = invite

                    .toLowerCase()

                    .normalize("NFD")

                    .replace(/[\u0300-\u036f]/g, "")

                    .replace(/\s+/g, "-");




                if (key === inviteKey) {



                    guestFound = {


                        nom: invite,

                        table: table.table


                    };



                }



            });



        });






        if (!guestFound) {


            console.error(
                "Invité introuvable :",
                inviteKey
            );


            return;


        }






        // Affichage informations invité



        const guestName = document.getElementById("guestName");

        const guestTable = document.getElementById("guestTable");



        if (guestName) {

            guestName.textContent = guestFound.nom;

        }



        if (guestTable) {

            guestTable.textContent = guestFound.table;

        }






        // Affichage QR page



        const guestNameQR = document.getElementById("guestNameQR");

        const guestTableQR = document.getElementById("guestTableQR");



        if (guestNameQR) {

            guestNameQR.textContent = guestFound.nom;

        }



        if (guestTableQR) {

            guestTableQR.textContent = guestFound.table;

        }







        // Titre navigateur


        document.title =
            guestFound.nom + " | Invitation Mariage";








        // Génération QR CODE PERSONNEL



        const qrContainer =
            document.getElementById("qrcode");



        if (qrContainer) {



            qrContainer.innerHTML = "";



            new QRCode(qrContainer, {


                text: window.location.href,


                width: 220,


                height: 220,


                colorDark:"#000000",


                colorLight:"#ffffff",


                correctLevel:
                    QRCode.CorrectLevel.H



            });



        }






    }


    catch(error){


        console.error(
            "Erreur chargement invité :",
            error
        );


    }


}





loadGuest();