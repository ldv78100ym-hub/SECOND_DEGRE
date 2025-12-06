window.updateSignTable = (a) => {
    const tablesDiv = document.getElementById('dynamic-tables');
    if (!tablesDiv) return;

    a = parseFloat(a);
    const beta = parseFloat(document.getElementById('beta-value')?.value || 0); // Pour le sommet y-value
    const alpha = parseFloat(document.getElementById('alpha-value')?.value || 0); // Pour le sommet x-value
    
    let varRow, maxMinText, signText;
    
    // Variation
    if (a > 0) {
        // Parabole vers le haut (minimum)
        varRow = `<tr><td>$f(x)$</td><td class="down-arrow">↘️</td><td><span class="katex">\\beta</span></td><td class="up-arrow">↗️</td></tr>`;
        maxMinText = 'minimum';
    } else if (a < 0) {
        // Parabole vers le bas (maximum)
        varRow = `<tr><td>$f(x)$</td><td class="up-arrow">↗️</td><td><span class="katex">\\beta</span></td><td class="down-arrow">↘️</td></tr>`;
        maxMinText = 'maximum';
    } else {
        // Cas a = 0 (fonction constante)
        varRow = `<tr><td>$f(x)$</td><td></td><td>\\beta</td><td></td></tr>`;
        maxMinText = 'valeur constante';
    }

    // Signe (simplifié pour f(x)=a.x^2, avec sommet à S(0,0) dans la Partie 5)
    // On ignore alpha et beta pour cette partie spécifique pour se concentrer sur 'a' et S(0,0)
    if (a > 0) {
        signText = `<tr><td>Signe de $a \\cdot x^2$</td><td>$+$</td><td>$0$</td><td>$+$</td></tr>`;
    } else if (a < 0) {
        signText = `<tr><td>Signe de $a \\cdot x^2$</td><td>$-$</td><td>$0$</td><td>$-$</td></tr>`;
    } else {
        signText = `<tr><td>Signe de $0 \\cdot x^2$</td><td colspan="3">0 (fonction constante $f(x)=0$)</td></tr>`;
    }


    tablesDiv.innerHTML = `
        <table class="tableau">
            <thead>
                <tr><th colspan="4">Tableau de Variation pour $f(x) = a \\cdot x^2$</th></tr>
                <tr><th>$x$</th><th>$-\\infty$</th><th>$0$</th><th>$+\\infty$</th></tr>
            </thead>
            <tbody>${varRow}</tbody>
        </table>
        <p>La fonction a un **${maxMinText}** en $S(0, 0)$.</p>
        <table class="tableau">
            <thead>
                <tr><th colspan="4">Tableau de Signe pour $f(x) = a \\cdot x^2$</th></tr>
                <tr><th>$x$</th><th>$-\\infty$</th><th>$0$</th><th>$+\\infty$</th></tr>
            </thead>
            <tbody>${signText}</tbody>
        </table>
    `;

    // Rendre le KaTeX
    tablesDiv.querySelectorAll('.katex').forEach(el => katex.render(el.textContent.trim(), el, { throwOnError: false }));
};