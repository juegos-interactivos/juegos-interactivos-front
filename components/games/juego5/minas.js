const tablero = document.getElementById('tablero');
const tiempoDisplay = document.getElementById('tiempo');
const minasDisplay = document.getElementById('minas-restantes');
const marcadasDisplay = document.getElementById('marcadas');
const puntosDisplay = document.getElementById('puntos');
const mensajeEstado = document.getElementById('mensaje-estado');

let filas = 0, columnas = 0, totalMinas = 0;
let dificultadActual = '2';
let tiempo = 0, puntos = 0, marcadas = 0;
let intervaloTiempo = null;
let jugando = false;
let primerClick = false;
let matrizCeldas = [];   // datos lógicos
let elementosCeldas = []; // referencias DOM

// Bloqueos de seguridad
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.keyCode == 123) return false;
    if (e.ctrlKey && e.shiftKey && [67, 75, 90, 69].includes(e.keyCode)) return false;
};

function ajustarDificultad(dif) {
    dificultadActual = dif;
    const botones = document.querySelectorAll('#menu button:not(#btn-reiniciar)');
    botones.forEach(btn => btn.classList.remove('activo'));
    const botonActivo = document.querySelector(`#menu button[onclick="ajustarDificultad('${dif}')"]`);
    if (botonActivo) botonActivo.classList.add('activo');
    reiniciarJuego();
}

function iniciarJuego() {
    tablero.innerHTML = '';
    tiempo = 0; puntos = 0; marcadas = 0;
    jugando = true; primerClick = false;
    matrizCeldas = []; elementosCeldas = [];
    clearInterval(intervaloTiempo);
    mensajeEstado.textContent = '';

    tiempoDisplay.textContent = '0';
    puntosDisplay.textContent = '0';
    marcadasDisplay.textContent = '0';

    if (dificultadActual === '1') { filas = 8; columnas = 8; totalMinas = 15; }
    else if (dificultadActual === '2') { filas = 12; columnas = 12; totalMinas = 40; }
    else if (dificultadActual === '3') { filas = 16; columnas = 16; totalMinas = 70; }

    minasDisplay.textContent = totalMinas;
    tablero.style.gridTemplateColumns = `repeat(${columnas}, 36px)`;

    // Inicializar datos lógicos
    for (let r = 0; r < filas; r++) {
        matrizCeldas[r] = [];
        elementosCeldas[r] = [];
        for (let c = 0; c < columnas; c++) {
            matrizCeldas[r][c] = { mina: false, revelada: false, marcada: false, adyacentes: 0 };
        }
    }

    // Renderizar celdas
    for (let r = 0; r < filas; r++) {
        for (let c = 0; c < columnas; c++) {
            const celda = document.createElement('div');
            celda.classList.add('celda');
            celda.addEventListener('click', () => revelarCelda(r, c));
            celda.addEventListener('contextmenu', (e) => { e.preventDefault(); marcarCelda(r, c); });
            tablero.appendChild(celda);
            elementosCeldas[r][c] = celda;
        }
    }
}

// Las minas se colocan DESPUÉS del primer click para garantizar que no explota de entrada
function colocarMinas(filaSegura, colSegura) {
    let colocadas = 0;
    while (colocadas < totalMinas) {
        const r = Math.floor(Math.random() * filas);
        const c = Math.floor(Math.random() * columnas);
        // Zona segura: la celda clicada y sus vecinas
        if (!matrizCeldas[r][c].mina && !(Math.abs(r - filaSegura) <= 1 && Math.abs(c - colSegura) <= 1)) {
            matrizCeldas[r][c].mina = true;
            colocadas++;
        }
    }

    // Calcular números adyacentes
    for (let r = 0; r < filas; r++) {
        for (let c = 0; c < columnas; c++) {
            if (!matrizCeldas[r][c].mina) {
                matrizCeldas[r][c].adyacentes = contarMinasAdyacentes(r, c);
            }
        }
    }
}

function contarMinasAdyacentes(r, c) {
    let cuenta = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < filas && nc >= 0 && nc < columnas && matrizCeldas[nr][nc].mina) {
                cuenta++;
            }
        }
    }
    return cuenta;
}

function revelarCelda(r, c) {
    if (!jugando) return;
    const datos = matrizCeldas[r][c];
    if (datos.revelada || datos.marcada) return;

    // Primer click: colocar minas y arrancar cronómetro
    if (!primerClick) {
        primerClick = true;
        colocarMinas(r, c);
        iniciarCronometro();
    }

    if (datos.mina) {
        // EXPLOSIÓN
        datos.revelada = true;
        const elem = elementosCeldas[r][c];
        elem.classList.add('revelada', 'mina-explotada');
        elem.textContent = '💥';
        terminarJuego(false);
        return;
    }

    // Flood fill para revelar celdas vacías en cascada
    revelarRecursivo(r, c);
    verificarVictoria();
}

function revelarRecursivo(r, c) {
    if (r < 0 || r >= filas || c < 0 || c >= columnas) return;
    const datos = matrizCeldas[r][c];
    if (datos.revelada || datos.marcada || datos.mina) return;

    datos.revelada = true;
    const elem = elementosCeldas[r][c];
    elem.classList.add('revelada');

    if (datos.adyacentes > 0) {
        elem.textContent = datos.adyacentes;
        elem.classList.add(`n${datos.adyacentes}`);
    } else {
        // Celda vacía: revelar vecinas
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                revelarRecursivo(r + dr, c + dc);
            }
        }
    }

    // Puntos por celda revelada correctamente
    puntos += parseInt(dificultadActual) * 5;
    puntosDisplay.textContent = Math.round(puntos);
}

function marcarCelda(r, c) {
    if (!jugando || matrizCeldas[r][c].revelada) return;
    const datos = matrizCeldas[r][c];
    const elem = elementosCeldas[r][c];

    datos.marcada = !datos.marcada;
    elem.classList.toggle('marcada');

    marcadas += datos.marcada ? 1 : -1;
    marcadasDisplay.textContent = marcadas;
    minasDisplay.textContent = totalMinas - marcadas;
}

function iniciarCronometro() {
    intervaloTiempo = setInterval(() => {
        tiempo++;
        tiempoDisplay.textContent = tiempo;
        // Penalización suave por tiempo
        puntos = Math.max(0, puntos - parseInt(dificultadActual));
        puntosDisplay.textContent = Math.round(puntos);
    }, 1000);
}

function verificarVictoria() {
    let celdasSinRevelar = 0;
    for (let r = 0; r < filas; r++) {
        for (let c = 0; c < columnas; c++) {
            if (!matrizCeldas[r][c].revelada && !matrizCeldas[r][c].mina) celdasSinRevelar++;
        }
    }
    if (celdasSinRevelar === 0) {
        terminarJuego(true);
    }
}

function terminarJuego(victoria) {
    jugando = false;
    clearInterval(intervaloTiempo);

    // Revelar todas las minas
    for (let r = 0; r < filas; r++) {
        for (let c = 0; c < columnas; c++) {
            const datos = matrizCeldas[r][c];
            if (datos.mina && !datos.revelada) {
                const elem = elementosCeldas[r][c];
                elem.classList.add('mina-revelada');
                elem.textContent = '💣';
            }
        }
    }

    if (victoria) {
        // Bonus de victoria
        const bonus = 500 * parseInt(dificultadActual);
        puntos += bonus;
        puntosDisplay.textContent = Math.round(puntos);
        mensajeEstado.textContent = '¡CAMPO DESPEJADO!';
        setTimeout(() => {
            alert(`¡Felicidades! Campo despejado.\n\nTiempo: ${tiempo}s\nMinas: ${totalMinas}\nPuntuación Final: ${Math.round(puntos)}`);
        }, 400);
    } else {
        puntos = 0;
        puntosDisplay.textContent = '0';
        mensajeEstado.textContent = '¡BOOM!';
        setTimeout(() => {
            alert(`¡Has pisado una mina!\n\nTiempo sobrevivido: ${tiempo}s\nPuntuación Final: 0`);
        }, 400);
    }
}

function reiniciarJuego() {
    iniciarJuego();
}

ajustarDificultad('2');