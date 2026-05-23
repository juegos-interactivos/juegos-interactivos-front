<template>
  <v-sheet color="blue-grey darken-4" dark min-height="100%" class="py-6 px-2 network-game">
    <v-container fluid>
      <v-row justify="center" align="center" class="mb-3">
        <v-btn-toggle
          :value="dificultadActual"
          mandatory
          dense
          class="transparent"
          @change="ajustarDificultad"
        >
          <v-btn
            v-for="opcion in dificultades"
            :key="opcion.valor"
            :value="opcion.valor"
            color="teal darken-1"
            active-class="teal darken-2 white--text elevation-6"
            class="font-weight-bold"
          >
            {{ opcion.texto }}
          </v-btn>
        </v-btn-toggle>

        <v-btn color="red darken-1" class="ml-2 font-weight-bold" @click="reiniciarJuego">
          Nueva Red
        </v-btn>
      </v-row>

      <v-row justify="center" class="mb-5">
        <v-sheet color="rgba(0, 0, 0, 0.40)" rounded class="px-4 py-2">
          <v-row dense justify="center" align="center">
            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Tiempo: <strong class="ml-1">{{ tiempo }}</strong>s
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Movimientos: <strong class="ml-1">{{ movimientos }}</strong>
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Puntos: <strong class="ml-1">{{ puntos }}</strong>
              </v-chip>
            </v-col>
          </v-row>
        </v-sheet>
      </v-row>

      <v-row justify="center" align="center" no-gutters>
        <v-col cols="auto">
          <v-sheet
            rounded
            class="network-game__endpoint px-3 py-5 font-weight-bold"
            :class="{ 'network-game__endpoint--active': entradaActiva }"
          >
            IN
          </v-sheet>
        </v-col>

        <v-col cols="auto" class="mx-2">
          <v-sheet
            color="#333"
            rounded
            class="network-game__board pa-1"
            :style="{
              gridTemplateColumns: `repeat(${columnas}, ${tamanoCelda})`
            }"
          >
            <v-sheet
              v-for="celda in celdas"
              :key="celda.id"
              role="button"
              tabindex="0"
              color="#2d3436"
              class="network-game__cell"
              :class="{ 'network-game__cell--connected': celda.conectada }"
              :width="tamanoCelda"
              :height="tamanoCelda"
              :style="{ transform: `rotate(${celda.rotacion * 90}deg)` }"
              :aria-label="`Pieza fila ${celda.r + 1}, columna ${celda.c + 1}`"
              @mousedown.prevent="rotarCelda(celda)"
              @keydown.enter.prevent="rotarCelda(celda)"
              @keydown.space.prevent="rotarCelda(celda)"
            >
              <span
                v-for="direccion in brazosBase(celda.tipo)"
                :key="direccion"
                class="network-game__arm"
                :class="`network-game__arm--${direccion}`"
              ></span>
            </v-sheet>
          </v-sheet>
        </v-col>

        <v-col cols="auto">
          <v-sheet
            rounded
            class="network-game__endpoint px-3 py-5 font-weight-bold"
            :class="{ 'network-game__endpoint--active': salidaActiva }"
          >
            OUT
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: 'Juego4',
  data() {
    return {
      dificultades: [
        { valor: '1', texto: 'Fácil', filas: 5, columnas: 5 },
        { valor: '2', texto: 'Normal', filas: 7, columnas: 7 },
        { valor: '3', texto: 'Difícil', filas: 9, columnas: 9 }
      ],
      dificultadActual: '2',
      filas: 7,
      columnas: 7,
      tiempo: 0,
      movimientos: 0,
      puntos: 0,
      intervaloTiempo: null,
      jugando: false,
      primerClick: false,
      matrizRed: [],
      celdas: [],
      filaInicio: 0,
      filaFin: 0,
      entradaActiva: false,
      salidaActiva: false
    }
  },
  computed: {
    dificultadSeleccionada() {
      return this.dificultades.find(dificultad => dificultad.valor === this.dificultadActual)
    },
    tamanoCelda() {
      if (this.$vuetify && this.$vuetify.breakpoint.xsOnly) {
        return this.dificultadActual === '3' ? '34px' : '42px'
      }

      return this.dificultadActual === '3' ? '58px' : '70px'
    }
  },
  mounted() {
    this.iniciarJuego()
  },
  beforeDestroy() {
    this.detenerCronometro()
  },
  methods: {
    ajustarDificultad(dificultad) {
      this.dificultadActual = dificultad
      this.reiniciarJuego()
    },
    iniciarJuego() {
      this.detenerCronometro()
      this.filas = this.dificultadSeleccionada.filas
      this.columnas = this.dificultadSeleccionada.columnas
      this.tiempo = 0
      this.movimientos = 0
      this.puntos = 0
      this.jugando = true
      this.primerClick = false
      this.entradaActiva = false
      this.salidaActiva = false
      this.filaInicio = Math.floor(this.filas / 2)
      this.filaFin = Math.floor(this.filas / 2)

      if (!this.generarCaminoLogico()) {
        this.iniciarJuego()
        return
      }

      this.dibujarTablero()
      this.evaluarRed()
    },
    generarCaminoLogico() {
      this.matrizRed = Array.from({ length: this.filas }, () => Array(this.columnas).fill(null))

      let c = 0
      let r = this.filaInicio
      const camino = [{ r, c }]
      const visitados = new Set([`${r},${c}`])

      while (c !== this.columnas - 1 || r !== this.filaFin) {
        const opciones = []

        if (c < this.columnas - 1 && !visitados.has(`${r},${c + 1}`)) {
          opciones.push({ r, c: c + 1 })
        }

        if (r > 0 && !visitados.has(`${r - 1},${c}`)) {
          opciones.push({ r: r - 1, c })
        }

        if (r < this.filas - 1 && !visitados.has(`${r + 1},${c}`)) {
          opciones.push({ r: r + 1, c })
        }

        if (!opciones.length) {
          return false
        }

        const siguiente = opciones[Math.floor(Math.random() * opciones.length)]
        camino.push(siguiente)
        visitados.add(`${siguiente.r},${siguiente.c}`)
        r = siguiente.r
        c = siguiente.c
      }

      camino.forEach((actual, index) => {
        const direccionPrevia = index === 0 ? 3 : this.obtenerDireccion(actual, camino[index - 1])
        const direccionSiguiente = index === camino.length - 1 ? 1 : this.obtenerDireccion(actual, camino[index + 1])
        const tipo = Math.abs(direccionPrevia - direccionSiguiente) === 2 ? 'recta' : 'curva'
        const rotacion = Math.floor(Math.random() * 4)
        this.matrizRed[actual.r][actual.c] = {
          id: `${actual.r}-${actual.c}`,
          r: actual.r,
          c: actual.c,
          tipo,
          rotacion,
          conectada: false
        }
      })

      for (let fila = 0; fila < this.filas; fila += 1) {
        for (let columna = 0; columna < this.columnas; columna += 1) {
          if (!this.matrizRed[fila][columna]) {
            const rotacion = Math.floor(Math.random() * 4)
            this.matrizRed[fila][columna] = {
              id: `${fila}-${columna}`,
              r: fila,
              c: columna,
              tipo: Math.random() > 0.5 ? 'recta' : 'curva',
              rotacion,
              conectada: false
            }
          }
        }
      }

      return true
    },
    dibujarTablero() {
      this.celdas = this.matrizRed.reduce((resultado, fila) => resultado.concat(fila), [])
    },
    obtenerDireccion(desde, hacia) {
      if (hacia.r < desde.r) {
        return 0
      }
      if (hacia.c > desde.c) {
        return 1
      }
      if (hacia.r > desde.r) {
        return 2
      }
      return 3
    },
    brazosBase(tipo) {
      return tipo === 'recta' ? [0, 2] : [0, 1]
    },
    rotarCelda(celda) {
      if (!this.jugando) {
        return
      }

      if (!this.primerClick) {
        this.primerClick = true
        this.iniciarCronometro()
      }

      this.movimientos += 1
      celda.rotacion = (celda.rotacion + 1) % 4
      this.evaluarRed()
    },
    iniciarCronometro() {
      this.intervaloTiempo = setInterval(() => {
        this.tiempo += 1
      }, 1000)
    },
    obtenerPuertos(tipo, rotacion) {
      if (tipo === 'recta') {
        return [rotacion % 2, (rotacion % 2) + 2]
      }

      return [rotacion, (rotacion + 1) % 4]
    },
    evaluarRed() {
      this.celdas.forEach((celda) => {
        celda.conectada = false
      })
      this.entradaActiva = false
      this.salidaActiva = false

      const inicio = this.matrizRed[this.filaInicio][0]
      if (!this.obtenerPuertos(inicio.tipo, inicio.rotacion).includes(3)) {
        return
      }

      this.entradaActiva = true

      const pila = [{ r: this.filaInicio, c: 0 }]
      const conectados = new Set([`${this.filaInicio},0`])

      while (pila.length > 0) {
        const actual = pila.pop()
        const datosActuales = this.matrizRed[actual.r][actual.c]
        datosActuales.conectada = true

        this.obtenerPuertos(datosActuales.tipo, datosActuales.rotacion).forEach((direccionSalida) => {
          let rSiguiente = actual.r
          let cSiguiente = actual.c

          if (direccionSalida === 0) {
            rSiguiente -= 1
          } else if (direccionSalida === 1) {
            cSiguiente += 1
          } else if (direccionSalida === 2) {
            rSiguiente += 1
          } else {
            cSiguiente -= 1
          }

          if (
            rSiguiente >= 0 &&
            rSiguiente < this.filas &&
            cSiguiente >= 0 &&
            cSiguiente < this.columnas
          ) {
            const direccionEntrada = (direccionSalida + 2) % 4
            const datosSiguientes = this.matrizRed[rSiguiente][cSiguiente]

            if (
              this.obtenerPuertos(datosSiguientes.tipo, datosSiguientes.rotacion).includes(direccionEntrada) &&
              !conectados.has(`${rSiguiente},${cSiguiente}`)
            ) {
              conectados.add(`${rSiguiente},${cSiguiente}`)
              pila.push({ r: rSiguiente, c: cSiguiente })
            }
          }
        })
      }

      const fin = this.matrizRed[this.filaFin][this.columnas - 1]
      if (
        conectados.has(`${this.filaFin},${this.columnas - 1}`) &&
        this.obtenerPuertos(fin.tipo, fin.rotacion).includes(1)
      ) {
        this.victoria()
      }
    },
    victoria() {
      this.jugando = false
      this.detenerCronometro()
      this.salidaActiva = true
      const base = 500 * Number(this.dificultadActual)
      this.puntos = Math.max(0, base - (this.tiempo * 5) - (this.movimientos * 10))

      setTimeout(() => {
        const mensaje = `Nivel: ${this.dificultadActual}\nTiempo: ${this.tiempo}s\nMovimientos: ${this.movimientos}\nPuntos Finales: ${this.puntos}`

        if (this.$swal) {
          this.$swal('Conexión Establecida', mensaje, 'success')
          return
        }

        window.alert(`Conexión Establecida\n\n${mensaje}`)
      }, 300)
    },
    reiniciarJuego() {
      this.iniciarJuego()
    },
    detenerCronometro() {
      if (this.intervaloTiempo) {
        clearInterval(this.intervaloTiempo)
        this.intervaloTiempo = null
      }
    }
  }
}
</script>

<style scoped>
.network-game {
  font-family: monospace, sans-serif;
  user-select: none;
}

.network-game__endpoint {
  border: 2px solid #808e9b;
  color: #808e9b;
  background: #333;
}

.network-game__endpoint--active {
  border-color: #0fb9b1;
  color: #0fb9b1;
  box-shadow: 0 0 10px #0fb9b1;
}

.network-game__board {
  display: grid;
  gap: 2px;
}

.network-game__cell {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-out;
}

.network-game__cell::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 28%;
  height: 28%;
  border-radius: 50%;
  background: #808e9b;
  transform: translate(-50%, -50%);
}

.network-game__arm {
  position: absolute;
  background: #808e9b;
}

.network-game__arm--0 {
  top: 0;
  left: 50%;
  width: 28%;
  height: 50%;
  transform: translateX(-50%);
}

.network-game__arm--1 {
  top: 50%;
  right: 0;
  width: 50%;
  height: 28%;
  transform: translateY(-50%);
}

.network-game__arm--2 {
  bottom: 0;
  left: 50%;
  width: 28%;
  height: 50%;
  transform: translateX(-50%);
}

.network-game__arm--3 {
  top: 50%;
  left: 0;
  width: 50%;
  height: 28%;
  transform: translateY(-50%);
}

.network-game__cell--connected::after,
.network-game__cell--connected .network-game__arm {
  background: #0fb9b1;
  box-shadow: 0 0 8px #0fb9b1;
}
</style>
