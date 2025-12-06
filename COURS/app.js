// Fonction pour basculer l'affichage des boîtes d'explication
window.toggleExplanation = (id) => {
    const box = document.getElementById(id);
    if (box) {
        box.style.display = box.style.display === "block" ? "none" : "block";
    }
};

// Fonction pour afficher la valeur d'un slider dans un span
window.showValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = value;
    }
};

// Fonction pour charger dynamiquement le contenu d'une partie
window.loadPart = async (partNumber) => {
    const container = document.getElementById('content-container');
    const partFile = `partie${partNumber}.html`;

    try {
        const response = await fetch(partFile);
        if (!response.ok) {
            throw new Error(`Erreur de chargement du fichier : ${response.statusText}`);
        }
        const htmlContent = await response.text();
        container.innerHTML = htmlContent;

        // Mise à jour de la classe active dans le menu
        document.querySelectorAll('#menu button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`#menu button:nth-child(${partNumber})`).classList.add('active');

        // Après le chargement, on relance le rendu KaTeX et on met à jour le graphique si nécessaire
        renderKaTeX();
        
        // Initialiser les écouteurs d'événements spécifiques à la partie (sliders, etc.)
        initializePart(partNumber);
        
    } catch (error) {
        console.error('Erreur lors du chargement de la partie:', error);
        container.innerHTML = `<p style="color:red;">Impossible de charger le contenu de la ${partFile}. Vérifiez que le fichier existe et que vous utilisez un serveur local.</p>`;
    }
};

// Fonction pour relancer le rendu KaTeX sur tout le contenu
const renderKaTeX = () => {
    document.querySelectorAll('.katex').forEach(el => {
        katex.render(el.textContent.trim(), el, { throwOnError: false });
    });
};

// Fonction pour initialiser les fonctions spécifiques (sliders, graph, etc.) après le chargement
const initializePart = (partNumber) => {
    // Si la partie contient des contrôles qui affectent le graphique
    if (partNumber >= 2 && partNumber <= 5) {
        // Assurez-vous que les fonctions globales (définies dans graph.js, tables.js, resolution.js) sont accessibles
        // Et que les écouteurs sont bien attachés aux inputs nouvellement chargés.
        const alphaInput = document.getElementById('alpha-value');
        const betaInput = document.getElementById('beta-value');
        const aInput = document.getElementById('a-value');
        
        if (alphaInput) alphaInput.oninput = () => { window.updateGraph(); window.showValue('alpha-display', alphaInput.value); };
        if (betaInput) betaInput.oninput = () => { window.updateGraph(); window.showValue('beta-display', betaInput.value); };
        if (aInput) aInput.oninput = () => { window.updateGraph(); window.updateSignTable(aInput.value); window.showValue('a-display', aInput.value); };

        // Redessiner le graphique avec les valeurs par défaut de la nouvelle partie
        if (window.p5Instance) window.p5Instance.redraw();

        // Si on est dans la partie 5, on initialise le tableau dynamique
        if (partNumber === 5) {
            window.updateSignTable(aInput ? aInput.value : 1);
        }
    }
    
    // Si on est dans la partie 6 (résolution), on initialise la résolution
    if (partNumber === 6) {
        const kInput = document.getElementById('k-value');
        if (kInput) kInput.onchange = window.updateResolution;
        window.updateResolution();
    }
};


// Démarrer l'application par défaut sur la Partie 1
document.addEventListener('DOMContentLoaded', () => {
    window.loadPart(1);
});