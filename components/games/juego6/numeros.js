const tiempoDisplay = document.getElementById('tiempo');
const intentosDisplay = document.getElementById('intentos');
const restantesDisplay = document.getElementById('restantes');
const puntosDisplay = document.getElementById('puntos');
const mensajePista = document.getElementById('mensaje-pista');
const historial = document.getElementById('historial');
const campoNumero = document.getElementById('campo-numero');
const btnAdivinar = document.getElementById('btn-adivinar');
const rangoMin = document.getElementById('rango-min');
const rangoMax = document.getElementById('rango-max');

let dificultadActual = '2';
let numeroSecreto = 0;
let intentos = 0;
let intentosMax = 0;
let puntos = 0;
let puntosBase = 0;
let penalizacion = 0;
let tiempo = 0;
let intervaloTiempo = null;
let jugando = false;
let primerIntento = false;
let rangoMaxActual = 0;

// Bloqueos de seguridad
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.keyCode == 123) return false;
    if (e.ctrlKey && e.shiftKey && [67, 75, 90, 69].includes(e.keyCode)) return false;
    if (e.key === 'Enter' && jugando) comprobarIntento();
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
    intentos = 0;
    tiempo = 0;
    primerIntento = false;
    jugando = true;
    historial.innerHTML = '';
    mensajePista.textContent = '';
    campoNumero.value = '';
    campoNumero.disabled = false;
    btnAdivinar.disabled = false;
    clearInterval(intervaloTiempo);
    tiempoDisplay.textContent = '0';
    intentosDisplay.textContent = '0';

    if (dificultadActual === '1') {
        rangoMaxActual = 50;
        intentosMax = 5;
        puntosBase = 500;
        penalizacion = 40;
    } else if (dificultadActual === '2') {
        rangoMaxActual = 200;
        intentosMax = 8;
        puntosBase = 1000;
        penalizacion = 100;
    } else {
        rangoMaxActual = 1000;
        intentosMax = 10;
        puntosBase = 3000;
        penalizacion = 200;
    }

    puntos = puntosBase;
    puntosDisplay.textContent = puntos;
    restantesDisplay.textContent = intentosMax;
    rangoMin.textContent = '1';
    rangoMax.textContent = rangoMaxActual;
    campoNumero.min = 1;
    campoNumero.max = rangoMaxActual;

    numeroSecreto = Math.floor(Math.random() * rangoMaxActual) + 1;
}

function iniciarCronometro() {
    intervaloTiempo = setInterval(() => {
        tiempo++;
        tiempoDisplay.textContent = tiempo;
    }, 1000);
}

function comprobarIntento() {
    if (!jugando) return;

    const valor = parseInt(campoNumero.value);
    if (isNaN(valor) || valor < 1 || valor > rangoMaxActual) {
        mensajePista.textContent = `⚠️ Introduce un número entre 1 y ${rangoMaxActual}`;
        mensajePista.style.color = '#f1c40f';
        return;
    }

    if (!primerIntento) {
        primerIntento = true;
        iniciarCronometro();
    }

    intentos++;
    intentosDisplay.textContent = intentos;
    const restantes = intentosMax - intentos;
    restantesDisplay.textContent = restantes;
    campoNumero.value = '';
    campoNumero.focus();

    if (valor === numeroSecreto) {
        // ACIERTO
        clearInterval(intervaloTiempo);
        jugando = false;
        campoNumero.disabled = true;
        btnAdivinar.disabled = true;

        agregarHistorial(valor, 'acierto', '¡Correcto!');
        mensajePista.textContent = '🎉 ¡Lo has adivinado!';
        mensajePista.style.color = '#2ecc71';
        puntosDisplay.textContent = puntos;

        setTimeout(() => {
            alert(`¡Felicidades!\n\nNúmero: ${numeroSecreto}\nIntentos: ${intentos}\nTiempo: ${tiempo}s\nPuntos Finales: ${puntos}`);
        }, 400);

    } else {
        // FALLO
        puntos = Math.max(0, puntos - penalizacion);
        puntosDisplay.textContent = puntos;

        if (valor < numeroSecreto) {
            mensajePista.textContent = '📈 El número es MAYOR';
            mensajePista.style.color = '#e74c3c';
            agregarHistorial(valor, 'mayor', 'mayor ↑');
        } else {
            mensajePista.textContent = '📉 El número es MENOR';
            mensajePista.style.color = '#3498db';
            agregarHistorial(valor, 'menor', 'menor ↓');
        }

        if (restantes <= 0) {
            terminarJuego();
        }
    }
}

function agregarHistorial(valor, tipo, pista) {
    const entrada = document.createElement('div');
    entrada.classList.add('entrada-historial', tipo);
    entrada.innerHTML = `<span>Intento ${intentos}: <b>${valor}</b></span><span class="pista-texto">${pista}</span>`;
    historial.insertBefore(entrada, historial.firstChild);
}

function terminarJuego() {
    jugando = false;
    clearInterval(intervaloTiempo);
    campoNumero.disabled = true;
    btnAdivinar.disabled = true;
    puntos = 0;
    puntosDisplay.textContent = '0';
    mensajePista.textContent = '💀 ¡Sin intentos!';
    mensajePista.style.color = '#e74c3c';

    setTimeout(() => {
        alert(`¡Sin intentos!\n\nEl número era: ${numeroSecreto}\nTiempo: ${tiempo}s\nPuntos Finales: 0`);
    }, 400);
}

function reiniciarJuego() {
    iniciarJuego();
}

ajustarDificultad('2');