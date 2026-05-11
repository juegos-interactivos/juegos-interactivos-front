const tablero = document.getElementById('tablero');
const tiempoDisplay = document.getElementById('tiempo');
const movDisplay = document.getElementById('movimientos');
const puntosDisplay = document.getElementById('puntos');
const nodoEntrada = document.getElementById('entrada');
const nodoSalida = document.getElementById('salida');

let filas = 0, columnas = 0;
let dificultadActual = '2';
let tiempo = 0, movimientos = 0, puntos = 0;
let intervaloTiempo = null;
let jugando = false;
let primerClick = false;

// Guardar el estado de cada celda
let matrizRed = []; 
let filaInicio = 0, filaFin = 0;

// Bloqueos de seguridad
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.keyCode == 123) return false;
    if (e.ctrlKey && e.shiftKey && [67, 75, 90, 69].includes(e.keyCode)) return false;
};

function ajustarDificultad(dif) {
    dificultadActual = dif;
    document.querySelectorAll('#menu button:not(#btn-reiniciar)').forEach(b => b.classList.remove('activo'));
    document.querySelector(`#menu button[onclick="ajustarDificultad('${dif}')"]`).classList.add('activo');
    reiniciarJuego();
}

function iniciarJuego() {
    tablero.innerHTML = '';
    tiempo = 0; movimientos = 0; puntos = 0;
    jugando = true; primerClick = false;
    clearInterval(intervaloTiempo);
    
    tiempoDisplay.textContent = "0"; movDisplay.textContent = "0"; puntosDisplay.textContent = "0";
    nodoEntrada.classList.remove('activo'); nodoSalida.classList.remove('activo');

    // Tamaños según dificultad
    if (dificultadActual === '1') { filas = 5; columnas = 5; }
    else if (dificultadActual === '2') { filas = 7; columnas = 7; }
    else if (dificultadActual === '3') { filas = 9; columnas = 9; }

    tablero.style.gridTemplateColumns = `repeat(${columnas}, 70px)`;
    
    filaInicio = Math.floor(filas / 2);
    filaFin = Math.floor(filas / 2); // Salida a la misma altura

    // Funcion emergencia para evitar loops infinitos
    if (!generarCaminoLogico()) {
        iniciarJuego(); 
        return;
    }
    
    dibujarTablero();
    // Evaluar conexiones iniciales por si de pura casualidad ya está resuelto
    evaluarRed();
}

// 1. GENERACIÓN DEL MAPA DINÁMICO
function generarCaminoLogico() {
    matrizRed = Array.from({ length: filas }, () => Array(columnas).fill(null));
    
    let c = 0, r = filaInicio;
    let camino = [{r, c}];
    let visitados = new Set([`${r},${c}`]);

    while (c !== columnas - 1 || r !== filaFin) {
        let opciones = [];
        if (c < columnas - 1 && !visitados.has(`${r},${c+1}`)) opciones.push({r, c: c+1}); // Derecha
        
        // Movimientos verticales para alinearse con la salida
        if (r > 0 && !visitados.has(`${r-1},${c}`)) opciones.push({r: r-1, c}); // Arriba
        if (r < filas - 1 && !visitados.has(`${r+1},${c}`)) opciones.push({r: r+1, c}); // Abajo

        // Si se encierra a sí mismo sin salida, devolvemos false para que lo intente de nuevo
        if (opciones.length === 0) return false; 

        let siguiente = opciones[Math.floor(Math.random() * opciones.length)];
        camino.push(siguiente);
        visitados.add(`${siguiente.r},${siguiente.c}`);
        r = siguiente.r; c = siguiente.c;
    }
    
    for (let i = 0; i < camino.length; i++) {
        let actual = camino[i];
        let dPrev = (i === 0) ? 3 : obtenerDireccion(actual, camino[i-1]); // La entrada viene de la izq (3)
        let dNext = (i === camino.length - 1) ? 1 : obtenerDireccion(actual, camino[i+1]); // La salida va a la der (1)
        
        let tipo = (Math.abs(dPrev - dNext) === 2) ? 'recta' : 'curva';
        matrizRed[actual.r][actual.c] = { tipo: tipo, rotacion: Math.floor(Math.random() * 4) };
    }

    // Relleno del resto del tablero con piezas al azar
    for(let i=0; i<filas; i++){
        for(let j=0; j<columnas; j++){
            if(!matrizRed[i][j]) {
                matrizRed[i][j] = {
                    tipo: Math.random() > 0.5 ? 'recta' : 'curva',
                    rotacion: Math.floor(Math.random() * 4)
                };
            }
        }
    }
    return true;
}

function obtenerDireccion(desde, hacia) {
    if (hacia.r < desde.r) return 0; // Arriba
    if (hacia.c > desde.c) return 1; // Derecha
    if (hacia.r > desde.r) return 2; // Abajo
    return 3; // Izquierda
}

// 2. RENDERIZADO DEL DOM
function dibujarTablero() {
    for(let r=0; r<filas; r++){
        for(let c=0; c<columnas; c++){
            let celda = document.createElement('div');
            celda.classList.add('celda');
            celda.dataset.f = r; celda.dataset.c = c;
            
            let datos = matrizRed[r][c];
            // Dibujar brazos fijos según el tipo (sin rotación)
            let brazos = datos.tipo === 'recta' ? [0, 2] : [0, 1]; // Recta: Arr/Aba. Curva: Arr/Der
            brazos.forEach(dir => {
                let brazo = document.createElement('div');
                brazo.classList.add('brazo', `dir-${dir}`);
                celda.appendChild(brazo);
            });

            // Aplicar la rotación visual
            celda.style.transform = `rotate(${datos.rotacion * 90}deg)`;
            celda.addEventListener('mousedown', () => rotarCelda(r, c, celda));
            tablero.appendChild(celda);
        }
    }
}

// 3. GIRO
function rotarCelda(r, c, elemento) {
    if(!jugando) return;
    if(!primerClick) { primerClick = true; iniciarCronometro(); }

    movimientos++;
    movDisplay.textContent = movimientos;

    let datos = matrizRed[r][c];
    datos.rotacion = (datos.rotacion + 1) % 4; // Suma 1, si llega a 4 vuelve a 0
    elemento.style.transform = `rotate(${datos.rotacion * 90}deg)`;
    
    evaluarRed();
}

function iniciarCronometro() {
    intervaloTiempo = setInterval(() => {
        tiempo++; tiempoDisplay.textContent = tiempo;
    }, 1000);
}

// 4. VERIFICACIÓN
function obtenerPuertos(tipo, rotacion) {
    // Retorna las direcciones (0,1,2,3) hacia las que apunta la pieza actual
    if (tipo === 'recta') return [rotacion % 2, (rotacion % 2) + 2];
    if (tipo === 'curva') return [rotacion, (rotacion + 1) % 4];
}

function evaluarRed() {
    // 1. Apagamos todo visualmente
    document.querySelectorAll('.celda').forEach(c => c.classList.remove('conectado'));
    nodoEntrada.classList.remove('activo'); nodoSalida.classList.remove('activo');

    // 2. Validamos si la celda inicial conecta con la "Entrada" (Izquierda=3)
    let inicio = matrizRed[filaInicio][0];
    if (!obtenerPuertos(inicio.tipo, inicio.rotacion).includes(3)) return; 
    
    nodoEntrada.classList.add('activo');

    // 3. Búsqueda de conexiones (Flood Fill)
    let pila = [{r: filaInicio, c: 0}];
    let conectados = new Set([`${filaInicio},0`]);

    while(pila.length > 0) {
        let actual = pila.pop();
        let datosAct = matrizRed[actual.r][actual.c];
        
        let idxDOM = (actual.r * columnas) + actual.c;
        tablero.children[idxDOM].classList.add('conectado');

        let puertos = obtenerPuertos(datosAct.tipo, datosAct.rotacion);

        puertos.forEach(dirSalida => {
            let rSig = actual.r, cSig = actual.c;
            if (dirSalida === 0) rSig--; else if (dirSalida === 1) cSig++;
            else if (dirSalida === 2) rSig++; else if (dirSalida === 3) cSig--;

            if (rSig >= 0 && rSig < filas && cSig >= 0 && cSig < columnas) {
                let dirEntradaRequerida = (dirSalida + 2) % 4; 
                let datosSig = matrizRed[rSig][cSig];
                
                if (obtenerPuertos(datosSig.tipo, datosSig.rotacion).includes(dirEntradaRequerida)) {
                    if (!conectados.has(`${rSig},${cSig}`)) {
                        conectados.add(`${rSig},${cSig}`);
                        pila.push({r: rSig, c: cSig});
                    }
                }
            }
        });
    }

    // 4. Comprobar victoria
    let fin = matrizRed[filaFin][columnas-1];
    if (conectados.has(`${filaFin},${columnas-1}`) && obtenerPuertos(fin.tipo, fin.rotacion).includes(1)) {
        victoria();
    }
}

function victoria() {
    jugando = false;
    clearInterval(intervaloTiempo);
    nodoSalida.classList.add('activo');
    
    let base = 500 * parseInt(dificultadActual);
    puntos = Math.max(0, base - (tiempo * 5) - (movimientos * 10));
    puntosDisplay.textContent = puntos;

    setTimeout(() => {
        alert(`¡Conexión Establecida!\n\nNivel: ${dificultadActual}\nTiempo: ${tiempo}s\nMovimientos: ${movimientos}\nPuntos Finales: ${puntos}`);
    }, 300);
}

function reiniciarJuego() { iniciarJuego(); }

ajustarDificultad('2');