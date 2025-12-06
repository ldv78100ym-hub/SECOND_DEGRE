let graphCanvas;
window.p5Instance;

const sketch = (p) => {
    const width = 450;
    const height = 300;
    const scale = 50; 
    
    p.setup = () => {
        graphCanvas = p.createCanvas(width, height);
        graphCanvas.parent('sketch-container');
        p.noLoop(); // Dessiner seulement quand on appelle p.redraw()
    };

    p.draw = () => {
        p.background(255);
        p.translate(width / 2, height / 2); // Origine au centre

        // 1. Lire les paramètres depuis les inputs (avec valeurs par défaut si les inputs n'existent pas encore)
        const alpha = parseFloat(document.getElementById('alpha-value')?.value || 0);
        const beta = parseFloat(document.getElementById('beta-value')?.value || 0);
        const a = parseFloat(document.getElementById('a-value')?.value || 1);

        // 2. Dessiner le repère
        p.stroke(200); p.strokeWeight(1);
        p.line(-width / 2, 0, width / 2, 0); // Axe des X
        p.line(0, -height / 2, 0, height / 2); // Axe des Y

        // 3. Dessiner la parabole de référence (x^2) en pointillé
        p.stroke(180, 180, 180, 150); p.strokeWeight(1.5);
        p.drawingContext.setLineDash([5, 5]); 
        p.beginShape();
        for (let x_p = -width / 2; x_p < width / 2; x_p++) {
            let x = x_p / scale;
            let y = x * x;
            p.vertex(x_p, -y * scale);
        }
        p.endShape();
        p.drawingContext.setLineDash([]); 

        // 4. Dessiner la parabole transformée (a(x-alpha)^2 + beta)
        p.stroke(0, 123, 255); 
        p.strokeWeight(3);
        p.noFill();
        p.beginShape();
        for (let x_p = -width / 2; x_p < width / 2; x_p += 1) {
            let x = x_p / scale;
            let y = a * (x - alpha) * (x - alpha) + beta;
            p.vertex(x_p, -y * scale);
        }
        p.endShape();

        // 5. Dessiner l'axe de symétrie (x=alpha)
        p.stroke(255, 100, 0, 150); p.strokeWeight(1);
        p.drawingContext.setLineDash([2, 4]);
        p.line(alpha * scale, -height / 2, alpha * scale, height / 2);
        p.drawingContext.setLineDash([]);

        // 6. Dessiner le Sommet (alpha, beta)
        p.fill(220, 0, 0); p.noStroke();
        p.ellipse(alpha * scale, -beta * scale, 8, 8);
        
        p.textSize(12); p.fill(0); p.noStroke();
        p.text(`S(${alpha}; ${beta})`, alpha * scale + 5, -beta * scale - 5);
        
        // 7. Afficher la formule
        p.fill(0);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`f(x) = ${a.toFixed(2)} (x - ${alpha})² + ${beta}`, -width/2 + 10, height/2 - 20);
    };
};

window.updateGraph = () => {
    if (window.p5Instance) {
        window.p5Instance.redraw();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Le conteneur doit exister avant de créer l'instance p5.js
    const container = document.getElementById('sketch-container');
    if (container) {
        window.p5Instance = new p5(sketch);
    }
});