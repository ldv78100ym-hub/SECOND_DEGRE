// --- VARIABLES GLOBALES ---
let GLOBAL_QUEST_INDEX;
let NEXT_QUEST_FILE_PATH;
let SUB_QUEST_INDEX_IN_FILE = 0;

let currentData = {};
let currentQuest = {};
let currentSubQuest = {};
let GAME_ATTEMPTS = 0;
const MAX_ATTEMPTS = 3;


// --- DÉFINITION DES QUÊTES ---
const quests = [
    { 
        name: "Canonique vers Développée", 
        baseGenerate: 'canonical_complex',
        fileName: 'quest_1_canonical_to_developed.html',
        sub_quests: [
            { 
                id: '1.1', name: "Forme Développée Complète", 
                description: "La fonction est sous forme canonique. Développez-la pour trouver les coefficients \\(\\boldsymbol{a, b, c}\\) de la forme \\(f(x) = ax^2+bx+c\\).",
                inputs: ['a', 'b', 'c'],
                check: (data, input) => [
                    Math.abs(input.a - data.a) < 0.001,
                    Math.abs(input.b - data.b) < 0.001,
                    Math.abs(input.c - data.c) < 0.001
                ]
            },
            { 
                id: '1.2', name: "Ordonnée à l'origine (\\(c\\))", 
                description: "La fonction est sous forme canonique. Trouvez uniquement le coefficient \\(\\boldsymbol{c}\\) (l'ordonnée à l'origine) de la forme développée. (Calculer \\(f(0)\\)).",
                inputs: ['c'],
                check: (data, input) => [Math.abs(input.c - data.c) < 0.001]
            },
            { 
                id: '1.3', name: "Coefficient b", 
                description: "La fonction est sous forme canonique. Trouvez uniquement le coefficient \\(\\boldsymbol{b}\\) (le terme en \\(x\\)) de la forme développée. (\\(b = -2a\\alpha\\)).",
                inputs: ['b'],
                check: (data, input) => [Math.abs(input.b - data.b) < 0.001]
            },
            {
                id: '1.4', name: "Valeur en \\(x=0\\)",
                description: "La fonction est sous forme canonique. Calculez la valeur de \\(\\boldsymbol{f(0)}\\) pour cette fonction.",
                inputs: ['c'],
                check: (data, input) => [Math.abs(input.c - data.c) < 0.001],
                questionText: "Quelle est la valeur de \\(\\boldsymbol{f(0)}\\) ?"
            }
        ]
    },
    { 
        name: "Développée vers Canonique", 
        baseGenerate: 'developed_complex',
        fileName: 'quest_2_developed_to_canonical.html',
        sub_quests: [
            { 
                id: '2.1', name: "Sommet (\\(\\boldsymbol{\\alpha}, \\boldsymbol{\\beta}\\))", 
                description: "La fonction est sous forme développée. Déterminez l'axe de symétrie \\(\\boldsymbol{\\alpha}\\) et l'ordonnée du sommet \\(\\boldsymbol{\\beta}\\) pour la forme canonique.",
                inputs: ['alpha', 'beta'],
                check: (data, input) => [
                    Math.abs(input.alpha - data.alpha) < 0.001,
                    Math.abs(input.beta - data.beta) < 0.001
                ]
            },
            { 
                id: '2.2', name: "Axe de Symétrie (\\(\\boldsymbol{\\alpha}\\))", 
                description: "La fonction est sous forme développée. Trouvez uniquement l'axe de symétrie \\(\\boldsymbol{\\alpha}\\) (\\(-\\frac{b}{2a}\\)).",
                inputs: ['alpha'],
                check: (data, input) => [Math.abs(input.alpha - data.alpha) < 0.001]
            },
            { 
                id: '2.3', name: "Ordonnée du Sommet (\\(\\boldsymbol{\\beta}\\))", 
                description: "La fonction est sous forme développée. Trouvez uniquement l'ordonnée du sommet \\(\\boldsymbol{\\beta}\\) (\\(f(\\alpha)\\)).",
                inputs: ['beta'],
                check: (data, input) => [Math.abs(input.beta - data.beta) < 0.001]
            }
        ]
    },
    { 
        name: "Résolution d'Équation", 
        baseGenerate: 'developed_with_all_cases',
        fileName: 'quest_3_equation_solving.html',
        sub_quests: [
            { 
                id: '3.1', name: "Trouver les Racines", 
                description: "Résolvez l'équation \\(\\boldsymbol{f(x)=0}\\). Donnez les racines \\(x_1\\) (plus petite) et \\(x_2\\) (plus grande).",
                inputs: ['x1', 'x2'],
                check: checkRoots,
                questionText: "Équation à résoudre : \\(\\boldsymbol{f(x)=0}\\). (La fonction sera toujours choisie avec \\(\\Delta \\ge 0\\)).",
                generateType: 'developed_with_roots'
            },
            { 
                id: '3.2', name: "Calcul du Discriminant", 
                description: "Calculez le discriminant \\(\\boldsymbol{\\Delta = b^2 - 4ac}\\) de la fonction.",
                inputs: ['delta'],
                check: (data, input) => [Math.abs(input.delta - data.delta) < 0.001],
                questionText: "Quel est le discriminant \\(\\boldsymbol{\\Delta}\\) ?",
            },
            { 
                id: '3.3', name: "Nombre de Solutions", 
                description: "Déterminez le nombre de solutions réelles de l'équation \\(\\boldsymbol{f(x)=0}\\).",
                inputs: ['count'],
                check: checkSolutionCount,
                questionText: "Combien de solutions réelles l'équation \\(\\boldsymbol{f(x)=0}\\) possède-t-elle ?",
                mcq: {
                    options: [
                        { value: '0', text: '0 solution (Aucune racine réelle)' },
                        { value: '1', text: '1 solution (Racine double)' },
                        { value: '2', text: '2 solutions (Deux racines réelles distinctes)' }
                    ]
                }
            }
        ]
    },
    { 
        name: "Inéquation", 
        baseGenerate: 'developed_with_roots',
        fileName: 'quest_4_inequation.html',
        sub_quests: [
            { 
                id: '4.1', name: "Inéquation : \\(f(x) \\ge 0\\)", 
                description: "Résolvez l'inéquation \\(\\boldsymbol{f(x) \\ge 0}\\). Donnez les bornes de l'intervalle de solution (plus petite borne \\(x_1\\), plus grande \\(x_2\\)).",
                inputs: ['x1', 'x2'],
                check: checkRoots, 
                questionText: "Donnez les bornes \\(x_1\\) et \\(x_2\\) de la solution de l'inéquation \\(\\boldsymbol{f(x) \\ge 0}\\)."
            },
            { 
                id: '4.2', name: "Inéquation : \\(f(x) < 0\\)", 
                description: "Résolvez l'inéquation \\(\\boldsymbol{f(x) < 0}\\). Donnez les bornes de l'intervalle de solution (plus petite borne \\(x_1\\), plus grande \\(x_2\\)).",
                inputs: ['x1', 'x2'],
                check: checkRoots,
                questionText: "Donnez les bornes \\(x_1\\) et \\(x_2\\) de la solution de l'inéquation \\(\\boldsymbol{f(x) < 0}\\)."
            },
            {
                id: '4.3', name: "Valeur Extrême", 
                description: "Trouvez la valeur minimum ou maximum atteinte par la fonction.",
                inputs: ['beta'],
                check: (data, input) => [Math.abs(input.beta - data.beta) < 0.001],
                questionText: "Quelle est la valeur extrême (maximum ou minimum) de \\(\\boldsymbol{f(x)}\\) ?"
            }
        ]
    },
    { 
        name: "Modélisation : Hauteur Maximale", 
        baseGenerate: 'modeling_height', 
        fileName: 'quest_5_modeling.html',
        sub_quests: [
            { 
                id: '5.1', name: "Hauteur et Temps Max", 
                description: "Un projectile est lancé, sa hauteur \\(h(t)\\) est modélisée par \\(h(t) = f(t)\\). Trouvez le \\(\\boldsymbol{temps}\\) (\\(t=\\alpha\\)) et la \\(\\boldsymbol{hauteur}\\) (\\(h=\\beta\\)) maximum.",
                inputs: ['alpha', 'beta'],
                check: (data, input) => [
                    Math.abs(input.alpha - data.alpha) < 0.001,
                    Math.abs(input.beta - data.beta) < 0.001
                ],
                questionText: "Déterminez le temps maximum \\(\\boldsymbol{\\alpha}\\) et la hauteur maximale \\(\\boldsymbol{\\beta}\\)."
            },
            { 
                id: '5.2', name: "Hauteur Initiale", 
                description: "Trouvez la hauteur du projectile au moment du lancement (\\(t=0\\)).",
                inputs: ['c'],
                check: (data, input) => [Math.abs(input.c - data.c) < 0.001],
                questionText: "Quelle est la hauteur \\(\\boldsymbol{h(0)}\\) ?"
            },
            { 
                id: '5.3', name: "Temps de Retombée", 
                description: "Trouvez le temps écoulé lorsque le projectile touche le sol (\\(h(t)=0\\)).",
                inputs: ['x2'],
                check: (data, input) => [Math.abs(input.x2 - data.x2) < 0.001],
                questionText: "Déterminez le temps \\(\\boldsymbol{t}\\) où le projectile touche le sol."
            }
        ]
    },
    { 
        name: "Effet des Paramètres", 
        baseGenerate: 'developed_simple',
        fileName: 'quest_6_parameters_effect.html',
        sub_quests: [
            { 
                id: '6.1', name: "Influence du paramètre a", 
                description: "Observez le coefficient \\(\\boldsymbol{a}\\). Quelle est la conséquence si \\(|a|\\) diminue (vers 0) ?",
                inputs: ['response'],
                check: (data, input) => [input.response === 's_open'],
                questionText: (data) => `Si \\(\\boldsymbol{a}\\) (\\(a=${data.a}\\)) se rapproche de 0, que fait la parabole ?`,
                mcq: {
                    options: [
                        { value: 's_open', text: "La parabole s'ouvrirait (s'élargirait)." },
                        { value: 's_close', text: "La parabole se refermerait (s'amincirait)." },
                        { value: 's_shift_x', text: 'Elle se décalerait horizontalement.' },
                        { value: 's_shift_y', text: 'Elle se décalerait verticalement.' }
                    ],
                    correctAnswerValue: 's_open'
                },
                generateType: 'developed_with_a_change'
            },
            { 
                id: '6.2', name: "Influence du paramètre \\(\\alpha\\)", 
                description: "Observez la forme canonique. Quel paramètre contrôle la translation horizontale ?",
                inputs: ['response'],
                check: (data, input) => [input.response === 's_alpha'],
                questionText: "Si on augmente \\(\\boldsymbol{\\alpha}\\) dans \\(a(x-\\alpha)^2+\\beta\\), que se passe-t-il ?",
                mcq: {
                    options: [
                        { value: 's_alpha', text: 'La parabole se décale vers la droite.' },
                        { value: 's_beta', text: 'La parabole se décale vers le haut.' },
                        { value: 's_a', text: 'La parabole change de direction.' }
                    ],
                    correctAnswerValue: 's_alpha'
                },
                generateType: 'canonical_simple'
            },
            { 
                id: '6.3', name: "Influence du paramètre \\(\\beta\\)", 
                description: "Observez la forme canonique. Quel paramètre contrôle la translation verticale ?",
                inputs: ['response'],
                check: (data, input) => [input.response === 's_beta'],
                questionText: "Si on diminue \\(\\boldsymbol{\\beta}\\) dans \\(a(x-\\alpha)^2+\\beta\\), que se passe-t-il ?",
                mcq: {
                    options: [
                        { value: 's_alpha', text: 'La parabole se décale vers la gauche.' },
                        { value: 's_beta', text: 'La parabole se décale vers le bas.' },
                        { value: 's_a', text: 'La parabole se referme.' }
                    ],
                    correctAnswerValue: 's_beta'
                },
                generateType: 'canonical_simple'
            }
        ]
    },
    {
        name: "Lecture Graphique", 
        baseGenerate: 'developed_with_roots',
        fileName: 'quest_7_graphical_reading.html',
        sub_quests: [
            {
                id: '7.1', name: "Forme Factorisée", 
                description: "En observant le graphique, déterminez \\(\\boldsymbol{a, x_1, x_2}\\) pour reconstruire la forme factorisée \\(\\boldsymbol{a(x-x_1)(x-x_2)}\\).",
                inputs: ['a', 'x1', 'x2'],
                check: checkRootsAndA,
                questionText: "Déterminez \\(\\boldsymbol{a}\\), \\(x_1\\) et \\(x_2\\) à partir du graphique."
            },
            {
                id: '7.2', name: "Coordonnées du Sommet", 
                description: "Lisez directement les coordonnées du sommet \\(\\boldsymbol{(\\alpha, \\beta)}\\) sur le graphique.",
                inputs: ['alpha', 'beta'],
                check: (data, input) => [
                    Math.abs(input.alpha - data.alpha) < 0.001,
                    Math.abs(input.beta - data.beta) < 0.001
                ],
                questionText: "Déterminez \\(\\boldsymbol{\\alpha}\\) et \\(\\boldsymbol{\\beta}\\) (sommet)."
            },
            {
                id: '7.3', name: "Ordonnée à l'origine (\\(c\\))", 
                description: "Lisez directement l'ordonnée à l'origine \\(\\boldsymbol{c}\\) sur le graphique.",
                inputs: ['c'],
                check: (data, input) => [Math.abs(input.c - data.c) < 0.001],
                questionText: "Déterminez \\(\\boldsymbol{c}\\) (l'ordonnée à l'origine)."
            },
            {
                id: '7.4', name: "Lecture des Racines", 
                description: "Lisez directement les racines \\(\\boldsymbol{x_1}\\) et \\(\\boldsymbol{x_2}\\) sur le graphique.",
                inputs: ['x1', 'x2'],
                check: checkRoots,
                questionText: "Déterminez \\(\\boldsymbol{x_1}\\) et \\(\\boldsymbol{x_2}\\) (les racines)."
            }
        ]
    }
];


// --- FONCTIONS DE VÉRIFICATION SPÉCIFIQUES ---

function checkRoots(data, input) {
    if (data.x1 === null || data.x2 === null) return [false, false]; 
    const roots = [data.x1, data.x2].sort((a, b) => a - b);
    const inputRoots = [input.x1, input.x2].sort((a, b) => a - b);
    return [Math.abs(inputRoots[0] - roots[0]) < 0.001, Math.abs(inputRoots[1] - roots[1]) < 0.001];
}

function checkRootsAndA(data, input) {
    const aCheck = Math.abs(input.a - data.a) < 0.001;
    const rootsCheck = checkRoots(data, input);
    return [aCheck, rootsCheck[0] && rootsCheck[1]];
}

function checkSolutionCount(data, input) {
    let expectedCount;
    if (data.delta > 0.001) expectedCount = '2';
    else if (Math.abs(data.delta) < 0.001) expectedCount = '1';
    else expectedCount = '0';
    return [input.count === expectedCount];
}


// --- FONCTIONS MATHÉMATIQUES & UTILS ---

function parseInput(input) {
    let inputStr = String(input).trim();
    if (inputStr.includes('=')) {
        inputStr = inputStr.split('=')[1];
    }
    inputStr = inputStr.replace(/\s/g, '').replace(',', '.');
    
    if (inputStr.includes('/')) {
        const parts = inputStr.split('/');
        if (parseFloat(parts[1]) === 0) return NaN;
        return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return parseFloat(inputStr);
}

function generateParameters(type) {
    let a, alpha, beta, x1, x2, b, c, delta;

    a = (Math.floor(Math.random() * 3) + 1) * (Math.random() < 0.5 ? 1 : -1); 
    alpha = Math.floor(Math.random() * 6) - 3; 
    beta = Math.floor(Math.random() * 9) - 4; 

    if (type.includes('with_roots') || type === 'developed_with_all_cases') {
        if (currentSubQuest && currentSubQuest.id === '3.3') {
            const delta_case = Math.floor(Math.random() * 3);
            if (delta_case === 0) { 
                if ((a > 0 && beta <= 0) || (a < 0 && beta >= 0)) { beta = -beta - (a > 0 ? 1 : -1) || -a; } 
            } else if (delta_case === 1) { 
                beta = 0;
            } else { 
                if ((a > 0 && beta >= 0) || (a < 0 && beta <= 0)) { beta = -beta - (a > 0 ? 1 : -1) || -a; } 
                const root_options = [1, 4, 9, 0.25, 2.25];
                beta = -a * root_options[Math.floor(Math.random() * root_options.length)];
            }
        } else if ((a > 0 && beta >= 0) || (a < 0 && beta <= 0)) {
            if (Math.random() < 0.5) beta = 0; 
            else {
                beta = -beta - (a > 0 ? 1 : -1) || -a;
                const root_options = [1, 4, 9, 0.25, 2.25];
                beta = -a * root_options[Math.floor(Math.random() * root_options.length)];
            }
        }
    }

    if (type === 'modeling_height') {
        a = -(Math.floor(Math.random() * 2) + 1); 
        alpha = parseFloat((Math.random() * 3 + 1).toFixed(1)); 
        beta = Math.floor(Math.random() * 10) + 5; 
        c = a * alpha * alpha + beta;
        if (c < 0) { 
            let offset = Math.abs(c) + 1;
            beta += offset;
            c = a * alpha * alpha + beta; 
        }
    }

    b = -2 * a * alpha;
    c = a * alpha * alpha + beta;
    delta = b * b - 4 * a * c;

    if (delta >= -0.001) { 
        const sqrt_delta = Math.sqrt(Math.max(0, delta)); 
        x1 = (-b - sqrt_delta) / (2 * a);
        x2 = (-b + sqrt_delta) / (2 * a);
        if (x1 > x2) [x1, x2] = [x2, x1];
        if (type === 'modeling_height' && x1 < -0.001) x1 = 0;
    } else {
        x1 = null; x2 = null;
    }
    
    return { 
        a: parseFloat(a.toFixed(2)), 
        b: parseFloat(b.toFixed(2)), 
        c: parseFloat(c.toFixed(2)), 
        alpha: parseFloat(alpha.toFixed(2)), 
        beta: parseFloat(beta.toFixed(2)), 
        delta: parseFloat(delta.toFixed(2)),
        x1: x1 !== null ? parseFloat(x1.toFixed(2)) : null, 
        x2: x2 !== null ? parseFloat(x2.toFixed(2)) : null 
    };
}

function formatFunction(data, formType, variable='x') {
    const a = data.a, alpha = data.alpha, beta = data.beta, b = data.b, c = data.c, x1 = data.x1, x2 = data.x2;
    const f_var = formType === 'modeling_height' ? 'h(t)' : 'f(x)';
    const var_name = formType === 'modeling_height' ? 't' : 'x';

    const formatTerm = (coef, variable, exponent) => {
        if (coef === 0) return '';
        const sign = coef > 0 ? '+' : '-';
        const abs_coef = Math.abs(coef);
        if (exponent === 0) return `${sign} ${abs_coef}`;
        if (exponent === 1) return `${sign} ${abs_coef === 1 ? '' : abs_coef}${variable}`;
        if (exponent === 2) return `${abs_coef === 1 ? (coef > 0 ? '' : '-') : coef}${variable}^2`;
        return '';
    };

    switch(formType) {
        case 'developed': 
        case 'developed_complex':
        case 'modeling_height':
            let fx_dev = `${formatTerm(a, var_name, 2)} ${formatTerm(b, var_name, 1)} ${formatTerm(c, var_name, 0)}`;
            fx_dev = fx_dev.trim().replace(/^\+\s*/, '');
            return `${f_var} = ${fx_dev}`;
        
        case 'canonical': 
        case 'canonical_complex':
        case 'canonical_simple':
            let a_str = a === 1 ? '' : (a === -1 ? '-' : a);
            let alpha_abs = Math.abs(alpha);
            let alpha_part = alpha === 0 ? `${var_name}^2` : (alpha > 0 ? `(${var_name} - ${alpha_abs})^2` : `(${var_name} + ${alpha_abs})^2`);
            let beta_abs = Math.abs(beta);
            let beta_str = beta === 0 ? '' : (beta > 0 ? `+ ${beta_abs}` : `- ${beta_abs}`);
            let fx_can = `${a_str}${alpha_part} ${beta_str}`;
            fx_can = fx_can.trim().replace(/^\+\s*/, '');
            return `${f_var} = ${fx_can}`;
            
        case 'factorized': 
            if (x1 === null || x2 === null) return `f(x) = ${formatFunction(data, 'canonical')} \\quad (\\Delta < 0)`; 
            let a_fact_str = a === 1 ? '' : (a === -1 ? '-' : a);
            let x1_sign = x1 >= 0 ? '-' : '+';
            let x2_sign = x2 >= 0 ? '-' : '+';
            let x1_abs = Math.abs(x1);
            let x2_abs = Math.abs(x2);
            return `${f_var} = ${a_fact_str}(${var_name} ${x1_sign} ${x1_abs})(${var_name} ${x2_sign} ${x2_abs})`;
        
        default:
            return '';
    }
}

function drawParabola(data, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const { a, alpha, beta, x1, x2, c } = data;

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
    const dangerColor = getComputedStyle(document.documentElement).getPropertyValue('--danger').trim();

    const roots = [x1, x2].filter(v => v !== null && Math.abs(v) < 100);
    let x_points = [alpha, 0].concat(roots.length > 0 ? roots : []);
    let y_points = [beta, c, 0];
    const allX = x_points.filter(v => typeof v === 'number' && !isNaN(v));
    const allY = y_points.filter(v => typeof v === 'number' && !isNaN(v));

    let xMax = allX.length > 0 ? Math.max(...allX, 5) : 5;
    let xMin = allX.length > 0 ? Math.min(...allX, -5) : -5;
    let yMax = allY.length > 0 ? Math.max(...allY, 5) : 5;
    let yMin = allY.length > 0 ? Math.min(...allY, -5) : -5;
    
    const margin = 1.5;
    xMax += margin; xMin -= margin; yMax += margin; yMin -= margin;
    if (a < 0 && beta > yMax) yMax = beta + margin;
    if (a > 0 && beta < yMin) yMin = beta - margin;

    const rangeX = xMax - xMin; const rangeY = yMax - yMin;
    const scaleX = W / rangeX; const scaleY = H / rangeY;
    const toCanvasX = (x) => (x - xMin) * scaleX;
    const toCanvasY = (y) => H - (y - yMin) * scaleY; 
    const F = (x) => a * (x - alpha) * (x - alpha) + beta;

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
    if (xMin <= 0 && xMax >= 0) { ctx.beginPath(); ctx.moveTo(toCanvasX(0), 0); ctx.lineTo(toCanvasX(0), H); ctx.stroke(); }
    if (yMin <= 0 && yMax >= 0) { ctx.beginPath(); ctx.moveTo(0, toCanvasY(0)); ctx.lineTo(W, toCanvasY(0)); ctx.stroke(); }

    ctx.strokeStyle = accentColor; ctx.lineWidth = 3; ctx.beginPath();
    for (let i = 0; i <= W; i++) { 
        let x = xMin + i / scaleX;
        if (i === 0) ctx.moveTo(toCanvasX(x), toCanvasY(F(x)));
        else ctx.lineTo(toCanvasX(x), toCanvasY(F(x)));
    }
    ctx.stroke();

    ctx.fillStyle = '#f8fafc'; ctx.font = '12px var(--font)';
    const pointRadius = 5;
    const drawPoint = (cx, cy, color, label, position) => {
        if (cx < -50 || cx > W+50 || cy < -50 || cy > H+50) return; 
        ctx.beginPath(); ctx.arc(cx, cy, pointRadius, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill();
        ctx.fillStyle = color;
        let textX = cx + 8; let textY = cy - 8;
        if (position === 'top') { textY = cy - 8; ctx.textAlign = 'left'; }
        if (position === 'bottom') { textY = cy + 18; ctx.textAlign = 'left'; }
        if (position === 'left') { textX = cx - 8; ctx.textAlign = 'right'; textY = cy + 4; }
        if (position === 'right') { textX = cx + 8; ctx.textAlign = 'left'; textY = cy + 4; }
        ctx.fillText(label, textX, textY);
    };

    drawPoint(toCanvasX(alpha), toCanvasY(beta), goldColor, `S(${alpha}; ${beta})`, beta > 0 ? 'bottom' : 'top');
    drawPoint(toCanvasX(0), toCanvasY(c), accentColor, `(0; ${c})`, c > 0 ? 'right' : 'left');

    if (x1 !== null && Math.abs(data.delta) > 0.001) { 
        drawPoint(toCanvasX(x1), toCanvasY(0), dangerColor, `(${x1}; 0)`, 'bottom');
        drawPoint(toCanvasX(x2), toCanvasY(0), dangerColor, `(${x2}; 0)`, 'bottom');
    } else if (x1 !== null && Math.abs(data.delta) < 0.001 && Math.abs(toCanvasY(0) - toCanvasY(beta)) > 1) { 
        drawPoint(toCanvasX(x1), toCanvasY(0), dangerColor, `(${x1}; 0)`, 'bottom');
    }
}

// --- LOGIQUE DE JEU ET ANIMATIONS ---

function initGame(questIndex, nextQuestFilePath) {
    GLOBAL_QUEST_INDEX = questIndex;
    NEXT_QUEST_FILE_PATH = nextQuestFilePath;
    SUB_QUEST_INDEX_IN_FILE = 0;
    
    injectStyles(); // Ajoute les styles CSS pour les animations
    
    const totalSubQuests = quests[GLOBAL_QUEST_INDEX].sub_quests.length;
    document.getElementById('quest-level').innerText = `QUÊTE ${GLOBAL_QUEST_INDEX + 1} / 7 | ÉTAPE ${SUB_QUEST_INDEX_IN_FILE + 1} / ${totalSubQuests}`;
    loadSubQuest();
}

// Fonction pour injecter les styles d'animation
function injectStyles() {
    if (document.getElementById('game-anim-styles')) return; // Évite les doublons
    const style = document.createElement('style');
    style.id = 'game-anim-styles';
    style.innerHTML = `
        /* Overlay pour les Émojis et Texte de Succès */
        #emoji-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.7); display: none; flex-direction: column; justify-content: center; align-items: center;
            z-index: 2000; pointer-events: none; opacity: 0; transition: opacity 0.3s ease;
        }
        #emoji-overlay.visible { display: flex; opacity: 1; pointer-events: auto; }
        
        .big-emoji { 
            font-size: 150px; 
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); 
            filter: drop-shadow(0 0 30px rgba(0,0,0,0.6));
        }

        .success-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 80px;
            font-weight: 900;
            color: #fde047; /* Jaune or */
            text-transform: uppercase;
            text-shadow: 0px 0px 20px rgba(253, 224, 71, 0.8), 4px 4px 0px #000;
            animation: zoomInFadeOut 2s ease-out forwards;
            margin-top: 20px;
            text-align: center;
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
        }

        @keyframes zoomInFadeOut {
            0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
            30% { transform: scale(1.2) rotate(3deg); opacity: 1; }
            50% { transform: scale(1) rotate(0deg); }
            80% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(1.5); }
        }

        /* Particules de succès (Emojis volants) */
        .particle {
            position: fixed; pointer-events: none; z-index: 1999;
            font-size: 24px;
            animation: confettiFall 2.5s ease-out forwards;
        }

        @keyframes confettiFall {
            0% { transform: translateY(-10vh) rotate(0deg) scale(0.5); opacity: 1; }
            20% { opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg) scale(1.2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Création de l'élément overlay s'il n'existe pas
    if (!document.getElementById('emoji-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'emoji-overlay';
        document.body.appendChild(overlay);
    }
}

function showEmojiEffect(emoji, text = null) {
    const overlay = document.getElementById('emoji-overlay');
    let content = `<div class="big-emoji">${emoji}</div>`;
    
    if (text) {
        content += `<div class="success-text">${text}</div>`;
    }

    overlay.innerHTML = content;
    overlay.classList.add('visible');
    
    // Disparaît automatiquement après 2.2 secondes
    setTimeout(() => {
        overlay.classList.remove('visible');
    }, 2200);
}

function triggerSuccessAnimation() {
    const emojis = ['🌟', '✨', '🎉', '🚀', '💎', '🏆', '💯', '🌈'];
    const successWords = ['BRAVO !', 'EXCELLENT !', 'PARFAIT !', 'INCROYABLE !', 'GÉNIAL !'];
    const randomWord = successWords[Math.floor(Math.random() * successWords.length)];

    // Lance l'effet de texte
    showEmojiEffect('🎉', randomWord);

    // Lance la pluie d'emojis
    for(let i=0; i<80; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Position aléatoire horizontale
        p.style.left = (Math.random() * 100) + 'vw';
        p.style.top = -10 + 'vh';
        
        // Taille aléatoire
        const size = Math.random() * 20 + 20;
        p.style.fontSize = size + 'px';

        // Délai et durée aléatoires
        p.style.animationDelay = (Math.random() * 1) + 's';
        p.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
        
        // Un peu de décalage latéral
        const randomX = (Math.random() - 0.5) * 200;
        p.style.transform = `translateX(${randomX}px)`;
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 4000); // Nettoyage DOM
    }
}

function loadSubQuest() {
    GAME_ATTEMPTS = 0;
    const quest = quests[GLOBAL_QUEST_INDEX];
    const subQuest = quest.sub_quests[SUB_QUEST_INDEX_IN_FILE];
    if (!subQuest) return; 
    currentQuest = quest;
    currentSubQuest = subQuest;
    const data = generateParameters(subQuest.generateType || quest.baseGenerate);
    currentData = data;
    resetUI(subQuest); 
    displayQuest(quest, subQuest, data);
}

function resetUI(subQuest) {
    const totalSubQuests = quests[GLOBAL_QUEST_INDEX].sub_quests.length;
    document.getElementById('quest-level').innerText = `QUÊTE ${GLOBAL_QUEST_INDEX + 1} / 7 | ÉTAPE ${SUB_QUEST_INDEX_IN_FILE + 1} / ${totalSubQuests}`;
    
    document.getElementById('mission-title').innerHTML = `🚀 ${currentQuest.name} : ${subQuest.name}`;
    
    let alphaLabel = 'Équation de l\'axe de symétrie';
    let alphaPlaceholder = 'Ex: x = 2';
    
    if (currentQuest.baseGenerate === 'modeling_height') {
        alphaLabel = 'Temps du maximum (t)';
        alphaPlaceholder = 'Ex: t = 2.5';
    }

    const labelMap = {
        'input-a': 'Coefficient a',
        'input-b': 'Coefficient b',
        'input-c': 'Coefficient c (ou f(0))',
        'input-alpha': alphaLabel,
        'input-beta': 'Ordonnée du Sommet &beta;',
        'input-x1': 'Borne inférieure / Racine x1',
        'input-x2': 'Borne supérieure / Racine x2',
        'input-delta': 'Discriminant &Delta;',
        'input-count': 'Nombre de solutions réelles'
    };
    
    for (const [id, text] of Object.entries(labelMap)) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) label.innerHTML = text; 
    }

    const inputGroups = ['a', 'b', 'c', 'alpha', 'beta', 'x1', 'x2', 'response', 'delta', 'count'];
    inputGroups.forEach(param => {
        const id = `input-group-${param}`;
        const group = document.getElementById(id);
        if (group) {
            group.classList.add('hidden');
            const input = group.querySelector('input') || group.querySelector('select');
            if (input) {
                input.value = "";
                input.classList.remove('input-valid', 'input-invalid'); 
                if(param === 'alpha') input.placeholder = alphaPlaceholder;
            }
        }
    });

    subQuest.inputs.forEach(param => {
        document.getElementById(`input-group-${param}`).classList.remove('hidden');
    });
    
    const responseSelect = document.getElementById('input-response');
    const countSelect = document.getElementById('input-count');
    if (subQuest.mcq) {
        let targetSelect = subQuest.id === '3.3' ? countSelect : responseSelect;
        if(subQuest.id !== '3.3' && targetSelect) { 
            targetSelect.innerHTML = '<option value="">-- Choisir une option --</option>';
            subQuest.mcq.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.text = option.text;
                targetSelect.appendChild(opt);
            });
        }
    }
    
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('feedback-area').style.display = 'none';
    document.getElementById('feedback-area').innerHTML = '';
    
    document.getElementById('graph-container').style.display = 'none';
    document.getElementById('function-display').style.display = 'block';

    if (window.MathJax) {
        setTimeout(() => MathJax.typesetPromise(), 50);
    }
}

function displayQuest(mainQuest, subQuest, data) {
    document.getElementById('quest-description').innerHTML = `<p><strong>Quête : ${mainQuest.name}</strong></p><p>${subQuest.description}</p>`;
    
    let questionText = subQuest.questionText || `Question : ${subQuest.description}`;
    if (typeof questionText === 'function') questionText = questionText(data);

    const activeGenType = subQuest.generateType || mainQuest.baseGenerate;
    let initialFormType = 'developed';
    
    if (activeGenType && activeGenType.includes('canonical')) {
        initialFormType = 'canonical';
    } else if (subQuest.id === '6.2' || subQuest.id === '6.3') {
        initialFormType = 'canonical';
    } else if (activeGenType === 'modeling_height') {
        initialFormType = 'modeling_height';
    } else {
         initialFormType = 'developed';
    }
    
    if (mainQuest.name === "Lecture Graphique") {
        document.getElementById('function-display').style.display = 'none';
        document.getElementById('graph-container').style.display = 'block';
        drawParabola(data, 'parabolaCanvas');
    } else {
        document.getElementById('function-display').style.display = 'block';
        document.getElementById('graph-container').style.display = 'none';
        const latex_display = formatFunction(data, initialFormType, initialFormType === 'modeling_height' ? 't' : 'x');
        document.getElementById('function-display').innerHTML = `\\(${latex_display}\\)`;
    }
    
    document.getElementById('question-text').innerHTML = questionText;

    if (window.MathJax) {
         MathJax.typesetPromise([document.getElementById('mission-content')]).catch(() => {});
    }
}

function checkAnswers() {
    GAME_ATTEMPTS++;
    const subQuest = currentSubQuest;
    const feedback = document.getElementById('feedback-area');
    feedback.style.display = 'block';

    const alphaElem = document.getElementById('input-alpha');
    const alphaRaw = alphaElem ? alphaElem.value.trim() : "";
    
    let valAlpha = parseInput(alphaRaw);

    if (subQuest.inputs.includes('alpha')) {
        const isModeling = currentQuest.baseGenerate === 'modeling_height';
        const requiredChar = isModeling ? 't' : 'x'; 
        const formatRegex = new RegExp(`^${requiredChar}\\s*=`, 'i');
        
        if (!formatRegex.test(alphaRaw)) {
            valAlpha = NaN; 
        }
    }

    const inputValues = {
        a: parseInput(document.getElementById('input-a').value),
        b: parseInput(document.getElementById('input-b').value),
        c: parseInput(document.getElementById('input-c').value),
        alpha: valAlpha,
        beta: parseInput(document.getElementById('input-beta').value),
        x1: parseInput(document.getElementById('input-x1').value),
        x2: parseInput(document.getElementById('input-x2').value),
        delta: parseInput(document.getElementById('input-delta').value),
        count: document.getElementById('input-count').value,
        response: document.getElementById('input-response').value
    };

    let checks = subQuest.check(currentData, inputValues);
    let successCount = checks.filter(Boolean).length;
    let totalChecks = checks.length;
    
    subQuest.inputs.forEach((param, index) => {
         const inputElement = document.getElementById(`input-${param}`);
         if (!inputElement) return;
         inputElement.classList.remove('input-valid', 'input-invalid');
         let isCorrect = false;
         if ((param === 'x1' || param === 'x2') && subQuest.inputs.includes('x1') && subQuest.inputs.includes('x2')) {
             const allRootsCorrect = checks.length > 1 && subQuest.id === '7.1' ? checks[1] : (checks.length === 2 ? checks[0] && checks[1] : checks[0]);
             isCorrect = allRootsCorrect;
         } else if (param === 'a' && subQuest.id === '7.1') {
             isCorrect = checks[0];
         } else if (checks.length === subQuest.inputs.length) {
             isCorrect = checks[index];
         } else if (checks.length === 1) { 
             isCorrect = checks[0];
         }
         
         if (isCorrect) inputElement.classList.add('input-valid');
         else if (inputElement.value !== "") inputElement.classList.add('input-invalid');
         
         if ((param === 'x1' || param === 'x2') && subQuest.inputs.includes('x1') && subQuest.inputs.includes('x2')) {
             document.getElementById('input-x1').classList.remove('input-valid', 'input-invalid');
             document.getElementById('input-x2').classList.remove('input-valid', 'input-invalid');
             if (isCorrect) {
                 document.getElementById('input-x1').classList.add('input-valid');
                 document.getElementById('input-x2').classList.add('input-valid');
             } else if (document.getElementById('input-x1').value !== "" || document.getElementById('input-x2').value !== "") {
                 document.getElementById('input-x1').classList.add('input-invalid');
                 document.getElementById('input-x2').classList.add('input-invalid');
             }
         }
    });

    if (successCount === totalChecks) {
        // --- SUCCÈS : ANIMATION "BOOSTÉE" ---
        triggerSuccessAnimation();
        
        SUB_QUEST_INDEX_IN_FILE++;
        if (SUB_QUEST_INDEX_IN_FILE < currentQuest.sub_quests.length) {
            const nextSubQuestName = currentQuest.sub_quests[SUB_QUEST_INDEX_IN_FILE].name;
            feedback.innerHTML = `<div style="background:rgba(74, 222, 128, 0.2); border:1px solid #4ade80; color:#86efac; padding:15px; text-align:center;"><h3>✅ SOUS-MISSION ACCOMPLIE !</h3><p>Préparez-vous pour la prochaine étape : <strong>${nextSubQuestName}</strong>.</p><button class="btn-restart" onclick="loadSubQuest()">➡️ CONTINUER LA QUÊTE</button></div>`;
            document.getElementById('submit-btn').disabled = true;
        } else {
            feedback.innerHTML = `<div style="background:rgba(74, 222, 128, 0.2); border:1px solid #4ade80; color:#86efac; padding:15px; text-align:center;"><h3>🎉 QUÊTE PRINCIPALE TERMINÉE : ${currentQuest.name.toUpperCase()} !</h3><p>Redirection automatique vers le prochain niveau dans 3 secondes.</p></div>`;
            document.getElementById('submit-btn').disabled = true;
            setTimeout(() => { window.location.href = NEXT_QUEST_FILE_PATH; }, 3000);
        }
    } else {
        // --- ÉCHEC : ANIMATIONS ÉMOTICÔNES ---
        if (GAME_ATTEMPTS === 1) showEmojiEffect('🤔'); // Encouragement / Réflexion
        else if (GAME_ATTEMPTS === 2) showEmojiEffect('😢'); // Tristesse
        else if (GAME_ATTEMPTS >= 3) showEmojiEffect('😤'); // Contrariété
        
        let errorMsg = `⚠️ Analyse incomplète (${GAME_ATTEMPTS}/${MAX_ATTEMPTS}). ${successCount}/${totalChecks} paramètres corrects.`;
        if (GAME_ATTEMPTS >= MAX_ATTEMPTS) {
             document.getElementById('submit-btn').disabled = true;
             let explanationHTML = generateExplanation(currentQuest, subQuest);
             feedback.innerHTML = `
                <div class="sol-container">
                    <div class="sol-title">⛔ ÉCHEC DE LA QUÊTE - ANALYSE DIDACTIQUE</div>
                    ${explanationHTML}
                    <button class="btn-restart" onclick="loadSubQuest()">🔄 QUÊTE SUIVANTE</button>
                </div>`;
        } else {
             feedback.innerHTML = `<div style="background:rgba(248, 113, 113, 0.2); border:1px solid #f87171; color:#fca5a5; padding:15px; text-align:center;">${errorMsg}</div>`;
        }
    }
}

function generateExplanation(mainQuest, subQuest) {
    const { a, alpha, beta, b, c, x1, x2, delta } = currentData;
    const var_name = mainQuest.baseGenerate === 'modeling_height' ? 't' : 'x';
    let html = "";
    const developed_latex = formatFunction(currentData, 'developed');
    const canonique_latex = formatFunction(currentData, 'canonical');
    const factorized_latex = x1 !== null ? formatFunction(currentData, 'factorized') : `f(x) = ${formatFunction(currentData, 'canonical')} \\quad (\\Delta < 0)`; 
    
    html += `
    <div class="didactic-step">
        <h4>1. Formes de la fonction donnée</h4>
        <p><strong>Développée :</strong> \\(${developed_latex}\\)</p>
        <p><strong>Canonique :</strong> \\(${canonique_latex}\\) (Sommet : \\((\\alpha ; \\beta)\\))</p>
        <p><strong>Factorisée :</strong> \\(${factorized_latex}\\)</p>
    </div>`;
    
    if (mainQuest.name.includes("Canonique vers Développée")) {
        html += `
        <div class="didactic-step">
            <h4>2. Conversion : Canonique \\(\\to\\) Développée</h4>
            <p>Développement : \\(f(${var_name}) = a(${var_name}^2 - 2\\alpha ${var_name} + \\alpha^2) + \\beta\\)</p>
            <p>On identifie : </p>
            <ul>
                <li>\\(\boldsymbol{a}\\) = ${a}</li>
                <li>\\(\boldsymbol{b}\\) = -2a\\alpha = -2(${a})(${alpha}) = ${b}</li>
                <li>\\(\boldsymbol{c}\\) = a\\alpha^2 + \\beta = ${a}(${alpha})^2 + ${beta} = ${c}</li>
            </ul>
        </div>`;
    } else if (mainQuest.name.includes("Développée vers Canonique") || mainQuest.name.includes("Modélisation")) {
        html += `
        <div class="didactic-step">
            <h4>2. Calcul du Sommet \\(\boldsymbol{(\\alpha, \\beta)}\\)</h4>
            <p>Axe de symétrie : \\(\\alpha = -\\frac{b}{2a}\\).</p>
            <p class="step-math">\\(\\alpha = -\\frac{${b}}{2 \\times ${a}} = ${alpha}\\)</p>
            <p>Ordonnée du sommet : \\(\\beta = f(\\alpha)\\).</p>
            <p class="step-math">\\(\\beta = ${a}(${alpha})^2 + ${b}(${alpha}) + ${c} = ${beta}\\)</p>
            ${subQuest.id === '5.3' ? 
            `<h4>3. Temps de Retombée (\\(h(t)=0\\))</h4><p>On utilise la formule des racines : \\(t_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}\\).</p><p class="step-math">\\($t_{\\text{sol}} = ${x2}\\)</p>` : '' 
            }
        </div>`;
    } else if (mainQuest.name.includes("Résolution d'Équation") || mainQuest.name.includes("Inéquation")) {
        let numSolutions = delta > 0.001 ? 2 : (Math.abs(delta) < 0.001 ? 1 : 0);
        html += `<div class="didactic-step">
            <h4>2. Analyse du Discriminant</h4>
            <p>Discriminant : \\(\boldsymbol{\\Delta} = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${delta}\\).</p>`; 
        
        if (numSolutions === 0) {
             html += `<p>Puisque \\(\boldsymbol{\\Delta < 0}\\), l'équation \\(\boldsymbol{f(x)=0}\\) n'a <strong>aucune solution réelle</strong>.</p>`; 
             if (subQuest.name.includes("Inéquation")) {
                 const isUp = a > 0;
                 html += `<p>La parabole est ouverte vers le ${isUp ? 'haut (\\(a>0\\))' : 'bas (\\(a<0\\))'} et n'atteint jamais 0.</p>`;
                 html += `<p>Solution pour \\(f(x) \\ge 0\\) : ${isUp ? '\\(\\mathbb{R}\\)' : '\\(\\emptyset\\)'}</p>`;
                 html += `<p>Solution pour \\(f(x) < 0\\) : ${isUp ? '\\(\\emptyset\\)' : '\\(\\mathbb{R}\\)'}</p>`;
             }
        } else if (numSolutions === 1) {
             html += `<p>Puisque \\(\boldsymbol{\\Delta \\approx 0}\\), il y a <strong>une unique solution réelle</strong> (racine double) : \\(x = \\frac{-b}{2a} = ${x1}\\).</p>`; 
             if (subQuest.name.includes("Inéquation")) {
                 const isUp = a > 0;
                 html += `<p>La solution de \\(\boldsymbol{f(x) \\ge 0}\\) est : ${isUp ? '\\(\\mathbb{R}\\)' : `\\({${x1}}\\) (ou \\([${x1}; ${x1}]\\))`}</p>`;
                 html += `<p>La solution de \\(\boldsymbol{f(x) < 0}\\) est : ${isUp ? '\\(\\emptyset\\)' : `\\(]-\\infty; ${x1}[ \\cup ]${x1}; +\\infty[\\)`}</p>`;
             }
        } else { 
            html += `<p>Puisque \\(\boldsymbol{\\Delta > 0}\\), il y a <strong>deux solutions réelles distinctes</strong> : </p>`; 
            html += `<p class="step-math">\\(x_1 = \\frac{-b - \\sqrt{${delta}}}{2a} = ${x1} \\quad \\text{ et } \\quad x_2 = \\frac{-b + \\sqrt{${delta}}}{2a} = ${x2}\\)</p>`; 
            if (subQuest.name.includes("Inéquation")) {
                const isUp = a > 0;
                if (subQuest.id === '4.1') { 
                    const solution = isUp ? `\\(]-\\infty ; ${x1}] \\cup [${x2} ; +\\infty[\\)` : `\\([${x1} ; ${x2}]\\)`; 
                    html += `<p>Pour \\(\boldsymbol{f(x) \\ge 0}\\) : la parabole est ouverte vers le ${isUp ? 'haut' : 'bas'}. Solution :</p><p class="step-math">${solution}</p>`;
                } else if (subQuest.id === '4.2') { 
                    const solution = isUp ? `\\(]${x1} ; ${x2}[\\)` : `\\(]-\\infty ; ${x1}[ \\cup ]${x2} ; +\\infty[\\)`; 
                    html += `<p>Pour \\(\boldsymbol{f(x) < 0}\\) : la parabole est ouverte vers le ${isUp ? 'haut' : 'bas'}. Solution :</p><p class="step-math">${solution}</p>`;
                }
            }
        }
        html += `</div>`;
    } else if (mainQuest.name.includes("Effet des Paramètres")) {
         const { mcq } = subQuest;
         let answerText = mcq.options.find(o => o.value === mcq.correctAnswerValue).text;
         html += `
         <div class="didactic-step">
            <h4>2. Règle d'influence des paramètres</h4>
            <ul>
                <li>\\(\boldsymbol{a}\\) : Contrôle l'ouverture et la direction. \\(|a| \\uparrow \\Rightarrow\\) se referme. \\(|a| \\downarrow \\Rightarrow\\) s'ouvre.</li>
                <li>\\(\boldsymbol{\\alpha}\\) : Contrôle la translation horizontale (vers la droite si \\(\\alpha \\uparrow\\)).</li>
                <li>\\(\boldsymbol{\\beta}\\) : Contrôle la translation verticale (vers le haut si \\(\\beta \\uparrow\\)).</li>
            </ul>
            <p class="correct-answer">Réponse correcte : ${answerText}</p>
         </div>`;
    } else if (mainQuest.name.includes("Lecture Graphique")) {
         html += `<div class="didactic-step">
            <h4>2. Lecture Graphique</h4>
            <p>Le graphique donne directement les informations suivantes :</p>
            <ul>
                <li>Sommet : \\(\boldsymbol{(\\alpha, \\beta)} = (${alpha} ; ${beta})\\)</li>
                <li>Racines (si elles existent) : \\(\boldsymbol{x_1 = ${x1}}\\) et \\(\boldsymbol{x_2 = ${x2}}\\)</li>
                <li>Ordonnée à l'origine : \\(\boldsymbol{c = ${c}}\\) (valeur en \\(x=0\\))</li>
                <li>Coefficient \\(\boldsymbol{a}\\) : Détermine l'ouverture et la direction. Ici, \\(\boldsymbol{a = ${a}}\\)</li>
            </ul>
            <p>La forme factorisée est : \\(f(x) = ${formatFunction(currentData, 'factorized')}\\)</p>
         </div>`;
    }
    
    html += `
    <div class="didactic-step">
        <h4>3. Solution de la Sous-Quête</h4>
        <p>Les valeurs attendues étaient :</p>
        <p class="correct-answer">
            ${subQuest.inputs.includes('a') ? `<strong>a</strong> = ${a} <br>` : ''}
            ${subQuest.inputs.includes('b') ? `<strong>b</strong> = ${b} <br>` : ''}
            ${subQuest.inputs.includes('c') ? `<strong>c</strong> = ${c} <br>` : ''}
            ${subQuest.inputs.includes('alpha') ? `<strong>\\(\\alpha\\)</strong> = ${alpha} <br>` : ''}
            ${subQuest.inputs.includes('beta') ? `<strong>\\(\\beta\\)</strong> = ${beta} <br>` : ''}
            ${subQuest.inputs.includes('delta') ? `<strong>\\(\\Delta\\)</strong> = ${delta} <br>` : ''}
            ${subQuest.inputs.includes('count') ? `<strong>Nombre de solutions</strong> : ${checkSolutionCount(currentData, { count: '0' }).includes(true) ? '0' : (checkSolutionCount(currentData, { count: '1' }).includes(true) ? '1' : '2')} <br>` : ''}
            ${(subQuest.inputs.includes('x1') || subQuest.inputs.includes('x2')) && x1 !== null ? `<strong>Racines/Bornes</strong> : ${x1} et ${x2} <br>` : ''}
            ${(subQuest.inputs.includes('x1') || subQuest.inputs.includes('x2')) && x1 === null && subQuest.id !== '3.1' ? `Pas de racines réelles. <br>` : ''}
        </p>
    </div>`;

    if (window.MathJax) {
        setTimeout(() => MathJax.typesetPromise().catch(() => {}), 100);
    }

    return html;
}

function showCopyrightModal() {
    document.getElementById('copyright-modal').style.display = 'block';
}

function hideCopyrightModal() {
    document.getElementById('copyright-modal').style.display = 'none';
}