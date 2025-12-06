/**
 * Calcule les racines d'une fonction quadratique (pour le tableau de signes).
 * @param {number} a Le coefficient quadratique (a != 0)
 * @param {number} b Le coefficient linéaire
 * @param {number} c Le terme constant
 * @returns {{delta: number, roots: number[]}} Objet contenant le discriminant et les racines (triées).
 */
function calculateQuadraticRoots(a, b, c) {
    const delta = b * b - 4 * a * c;
    let roots = [];

    if (delta > 0) {
        // Deux racines distinctes
        const x1 = (-b - Math.sqrt(delta)) / (2 * a);
        const x2 = (-b + Math.sqrt(delta)) / (2 * a);
        // On s'assure qu'elles sont triées pour le tableau
        roots = [Math.min(x1, x2), Math.max(x1, x2)];
    } else if (delta === 0) {
        // Une racine double
        const x0 = -b / (2 * a);
        roots = [x0];
    }
    // Si delta < 0, roots reste vide

    return { delta, roots };
}

/**
 * Génère un tableau HTML de variation pour la fonction f(x) = a x² + b x + c.
 * @param {number} a Le coefficient 'a'
 * @param {number} b Le coefficient 'b'
 * @param {number} c Le coefficient 'c'
 * @returns {string} Le code HTML du tableau de variation.
 */
function generateVariationTable(a, b, c) {
    // 1. Calcul des coordonnées du sommet (extremum)
    const alpha = -b / (2 * a);
    const beta = a * alpha * alpha + b * alpha + c;

    // 2. Détermination du sens de variation
    const arrowUp = `<span class="arrow up">↗️</span>`;
    const arrowDown = `<span class="arrow down">↘️</span>`;
    const extremumType = (a > 0) ? "Minimum" : "Maximum";
    
    let variationRow = '';
    if (a > 0) { // a > 0 : décroissant puis croissant
        variationRow = `<td class="arrow-cell">${arrowDown}</td>
                        <td>${beta.toFixed(2)}</td>
                        <td class="arrow-cell">${arrowUp}</td>`;
    } else { // a < 0 : croissant puis décroissant
        variationRow = `<td class="arrow-cell">${arrowUp}</td>
                        <td>${beta.toFixed(2)}</td>
                        <td class="arrow-cell">${arrowDown}</td>`;
    }

    const html = `
        <h3 class="table-title">Tableau de Variation pour $f(x) = ${a}x^2 + ${b}x + ${c}$</h3>
        <table class="math-tableau variation">
            <thead>
                <tr><th>$x$</th><th>$-\\infty$</th><th>${alpha.toFixed(2)}</th><th>$+\\infty$</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>$f(x)$</td>
                    ${variationRow}
                </tr>
            </tbody>
        </table>
        <p class="summary">
            Le sommet (extremum) est un **${extremumType}** en $S(${alpha.toFixed(2)} ; ${beta.toFixed(2)})$.
        </p>
    `;
    return html;
}

/**
 * Génère un tableau HTML de signes pour la fonction f(x) = a x² + b x + c.
 * @param {number} a Le coefficient 'a'
 * @param {number} b Le coefficient 'b'
 * @param {number} c Le coefficient 'c'
 * @returns {string} Le code HTML du tableau de signes.
 */
function generateSignTable(a, b, c) {
    const { delta, roots } = calculateQuadraticRoots(a, b, c);
    const signA = a > 0 ? '+' : '-';
    const signOppositeA = a > 0 ? '-' : '+';
    let htmlContent = '';
    let summaryText = '';

    if (delta < 0) {
        // Cas 1: Delta < 0 (Pas de racines)
        htmlContent = `
            <tr><th>$x$</th><th>$-\\infty$</th><th>$+\\infty$</th></tr>
            <tr><td>$f(x)$</td><td colspan="2" class="sign-cell">${signA}</td></tr>
        `;
        summaryText = `$\Delta < 0$. $f(x)$ est **toujours** du signe de $a$, soit ${signA}.`;
    } 
    else if (delta === 0) {
        // Cas 2: Delta = 0 (Une racine double x0)
        const x0 = roots[0];
        htmlContent = `
            <tr><th>$x$</th><th>$-\\infty$</th><th>${x0.toFixed(2)}</th><th>$+\\infty$</th></tr>
            <tr><td>$f(x)$</td><td class="sign-cell">${signA}</td><td>0</td><td class="sign-cell">${signA}</td></tr>
        `;
        summaryText = `$\Delta = 0$. $f(x)$ est du signe de $a$ partout, sauf en $x=${x0.toFixed(2)}$ où elle est nulle.`;
    } 
    else {
        // Cas 3: Delta > 0 (Deux racines x1 et x2)
        const x1 = roots[0];
        const x2 = roots[1];
        htmlContent = `
            <tr><th>$x$</th><th>$-\\infty$</th><th>${x1.toFixed(2)}</th><th>${x2.toFixed(2)}</th><th>$+\\infty$</th></tr>
            <tr>
                <td>$f(x)$</td>
                <td class="sign-cell">${signA}</td>
                <td>0</td>
                <td class="sign-cell">${signOppositeA}</td>
                <td>0</td>
                <td class="sign-cell">${signA}</td>
            </tr>
        `;
        summaryText = `$\Delta > 0$. $f(x)$ est du signe opposé à $a$ **entre** les racines $x_1=${x1.toFixed(2)}$ et $x_2=${x2.toFixed(2)}$.`;
    }

    const html = `
        <h3 class="table-title">Tableau de Signes pour $f(x) = ${a}x^2 + ${b}x + ${c}$</h3>
        <table class="math-tableau sign">
            <thead>${htmlContent}</thead>
        </table>
        <p class="summary">${summaryText}</p>
    `;
    return html;
}

// Fonction utilitaire pour le rendu KaTeX
function renderKaTeX(elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.querySelectorAll('.katex').forEach(el => {
        katex.render(el.textContent.trim(), el, { throwOnError: false });
    });
}