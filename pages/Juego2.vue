<template>
  <v-sheet color="blue-grey darken-3" dark min-height="100%" class="py-6 px-2 mole-game">
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
            color="green darken-2"
            active-class="green darken-3 white--text elevation-6"
            class="font-weight-bold"
          >
            {{ opcion.texto }}
          </v-btn>
        </v-btn-toggle>

        <v-btn color="red darken-1" class="ml-2 font-weight-bold" @click="reiniciarJuego">
          Reiniciar
        </v-btn>
      </v-row>

      <v-row justify="center" class="mb-3">
        <v-sheet color="rgba(0, 0, 0, 0.30)" rounded class="px-4 py-2">
          <v-row dense justify="center" align="center">
            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Tiempo: <strong class="ml-1">{{ tiempo }}</strong>s
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Golpeados: <strong class="ml-1">{{ golpeados }}</strong>
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Escapados: <strong class="ml-1">{{ escapados }}</strong>/3
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

      <v-sheet
        color="transparent"
        class="mole-game__board mx-auto pa-4 pa-sm-5"
        :style="{
          gridTemplateColumns: `repeat(${columnas}, ${tamanoAgujero})`,
          gap: espacioTablero
        }"
      >
        <v-sheet
          v-for="agujero in agujeros"
          :key="agujero.id"
          color="#1a1a1a"
          class="mole-game__hole rounded-circle"
          :class="[
            agujero.activeType ? `mole-game__hole--${agujero.activeType}` : '',
            agujero.feedback ? `mole-game__hole--${agujero.feedback}` : ''
          ]"
          :width="tamanoAgujero"
          :height="tamanoAgujero"
        >
          <button
            type="button"
            class="mole-game__mole"
            aria-label="Topo"
            @mousedown.prevent="golpearTopo(agujero)"
          >
            <span class="mole-game__mole-nose"></span>
          </button>

          <button
            type="button"
            class="mole-game__cat"
            aria-label="Gato"
            @mousedown.prevent="golpearGato(agujero)"
          >
            <span class="mole-game__cat-face"></span>
            <span class="mole-game__cat-eyes"></span>
          </button>
        </v-sheet>
      </v-sheet>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: 'Juego2',
  data() {
    return {
      dificultades: [
        { valor: '1', texto: 'Fácil', agujeros: 4, columnas: 2 },
        { valor: '2', texto: 'Normal', agujeros: 9, columnas: 3 },
        { valor: '3', texto: 'Difícil', agujeros: 16, columnas: 4 }
      ],
      dificultadActual: '2',
      agujeros: [],
      tiempo: 0,
      puntos: 0,
      escapados: 0,
      golpeados: 0,
      velocidadActual: 1500,
      intervaloTiempo: null,
      timers: [],
      jugando: false,
      primerGolpe: false,
      gatoIniciado: false,
      segundoTopoIniciado: false
    }
  },
  computed: {
    dificultadSeleccionada() {
      return this.dificultades.find(dificultad => dificultad.valor === this.dificultadActual)
    },
    columnas() {
      return this.dificultadSeleccionada.columnas
    },
    cantidadAgujeros() {
      return this.dificultadSeleccionada.agujeros
    },
    tamanoAgujero() {
      return this.$vuetify && this.$vuetify.breakpoint.xsOnly ? '78px' : '100px'
    },
    espacioTablero() {
      return this.$vuetify && this.$vuetify.breakpoint.xsOnly ? '12px' : '20px'
    }
  },
  mounted() {
    this.iniciarJuego()
  },
  beforeDestroy() {
    this.limpiarTimers()
  },
  methods: {
    ajustarDificultad(dificultad) {
      this.dificultadActual = dificultad
      this.reiniciarJuego()
    },
    iniciarJuego() {
      this.limpiarTimers()
      this.tiempo = 0
      this.puntos = 0
      this.escapados = 0
      this.golpeados = 0
      this.velocidadActual = 1500
      this.jugando = true
      this.primerGolpe = false
      this.gatoIniciado = false
      this.segundoTopoIniciado = false
      this.agujeros = Array.from({ length: this.cantidadAgujeros }, (_, index) => ({
        id: index,
        activeType: null,
        identificador: null,
        feedback: null,
        timeoutId: null
      }))
      this.$nextTick(this.aparecerPrimerTopo)
    },
    iniciarCronometro() {
      this.intervaloTiempo = setInterval(() => {
        this.tiempo += 1

        if (this.tiempo % 5 === 0 && this.velocidadActual > 400) {
          this.velocidadActual -= 50
        }

        if (this.tiempo === 10 && !this.gatoIniciado) {
          this.gatoIniciado = true
          this.mostrarEntidad('gato', 'gato1')
        }

        if (
          this.tiempo === 20 &&
          !this.segundoTopoIniciado &&
          (this.dificultadActual === '2' || this.dificultadActual === '3')
        ) {
          this.segundoTopoIniciado = true
          this.mostrarEntidad('topo', 'topo2')
        }
      }, 1000)
    },
    obtenerAgujeroLibre() {
      const libres = this.agujeros.filter(agujero => !agujero.activeType)
      if (!libres.length) {
        return null
      }

      return libres[Math.floor(Math.random() * libres.length)]
    },
    aparecerPrimerTopo() {
      const agujero = this.obtenerAgujeroLibre()
      if (!agujero) {
        return
      }

      agujero.activeType = 'topo'
      agujero.identificador = 'topo1'
    },
    mostrarEntidad(tipo, identificador) {
      if (!this.jugando) {
        return
      }

      const agujero = this.obtenerAgujeroLibre()
      if (!agujero) {
        this.registrarTimeout(() => this.mostrarEntidad(tipo, identificador), 300)
        return
      }

      agujero.activeType = tipo
      agujero.identificador = identificador
      agujero.timeoutId = this.registrarTimeout(() => {
        if (agujero.activeType !== tipo || agujero.identificador !== identificador) {
          return
        }

        agujero.activeType = null

        if (tipo === 'topo') {
          this.topoEscapa(agujero, identificador)
          return
        }

        this.registrarTimeout(() => this.mostrarEntidad('gato', identificador), 1000 + Math.random() * 1000)
      }, this.velocidadActual)
    },
    golpearTopo(agujero) {
      if (!this.jugando || agujero.activeType !== 'topo') {
        return
      }

      if (!this.primerGolpe) {
        this.primerGolpe = true
        this.iniciarCronometro()
      }

      clearTimeout(agujero.timeoutId)
      agujero.activeType = null
      this.aplicarFeedback(agujero, 'acierto')
      this.golpeados += 1
      this.puntos += (50 * Number(this.dificultadActual)) + Math.floor(this.tiempo / 2)

      const identificador = agujero.identificador
      this.registrarTimeout(() => this.mostrarEntidad('topo', identificador), 300 + Math.random() * 300)
    },
    golpearGato(agujero) {
      if (!this.jugando || agujero.activeType !== 'gato') {
        return
      }

      clearTimeout(agujero.timeoutId)
      agujero.activeType = null
      this.aplicarFeedback(agujero, 'fallo')
      this.puntos = Math.max(0, this.puntos - (100 * Number(this.dificultadActual)))

      const identificador = agujero.identificador
      this.registrarTimeout(() => this.mostrarEntidad('gato', identificador), 1000 + Math.random() * 1000)
    },
    topoEscapa(agujero, identificador) {
      if (!this.jugando) {
        return
      }

      this.escapados += 1
      this.aplicarFeedback(agujero, 'fallo')
      this.puntos = Math.max(0, this.puntos - (25 * Number(this.dificultadActual)))

      if (this.escapados >= 3) {
        this.terminarJuego()
        return
      }

      this.registrarTimeout(() => this.mostrarEntidad('topo', identificador), 500 + Math.random() * 400)
    },
    aplicarFeedback(agujero, tipo) {
      agujero.feedback = tipo
      this.registrarTimeout(() => {
        agujero.feedback = null
      }, 200)
    },
    terminarJuego() {
      this.jugando = false
      this.limpiarTimers(false)
      this.agujeros.forEach((agujero) => {
        agujero.activeType = null
        agujero.timeoutId = null
      })

      this.registrarTimeout(() => {
        const mensaje = `Topos golpeados: ${this.golpeados}\nTiempo sobrevivido: ${this.tiempo}s\nPuntuación Final: ${this.puntos}`

        if (this.$swal) {
          this.$swal('Partida Terminada', mensaje, 'info')
          return
        }

        window.alert(`Partida Terminada\n\n${mensaje}`)
      }, 100)
    },
    reiniciarJuego() {
      this.iniciarJuego()
    },
    registrarTimeout(callback, delay) {
      const timeoutId = setTimeout(() => {
        this.timers = this.timers.filter(id => id !== timeoutId)
        callback()
      }, delay)
      this.timers.push(timeoutId)
      return timeoutId
    },
    limpiarTimers(incluirTimeouts = true) {
      if (this.intervaloTiempo) {
        clearInterval(this.intervaloTiempo)
        this.intervaloTiempo = null
      }

      if (incluirTimeouts) {
        this.timers.forEach(clearTimeout)
        this.timers = []
      }
    }
  }
}
</script>

<style scoped>
.mole-game {
  user-select: none;
}

.mole-game__board {
  display: grid;
  justify-content: center;
  align-content: center;
}

.mole-game__hole {
  position: relative;
  overflow: hidden;
  border: 6px solid #3e2723;
  box-shadow: inset 0 10px 15px rgba(0, 0, 0, 0.5);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.mole-game__hole--acierto {
  border-color: #2ecc71;
  box-shadow: inset 0 10px 20px rgba(46, 204, 113, 0.6);
}

.mole-game__hole--fallo {
  border-color: #e74c3c;
  box-shadow: inset 0 10px 20px rgba(231, 76, 60, 0.6);
}

.mole-game__mole,
.mole-game__cat {
  position: absolute;
  bottom: -100%;
  left: 10%;
  width: 80%;
  height: 90%;
  padding: 0;
  border: 0;
  border-radius: 50% 50% 0 0;
  cursor: pointer;
  transition: bottom 0.1s ease;
}

.mole-game__mole {
  background: #795548;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.2);
}

.mole-game__mole::before {
  content: '';
  position: absolute;
  top: 25%;
  left: 20%;
  width: 12px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 40px 0 0 #fff, 5px 3px 0 #000, 45px 3px 0 #000;
}

.mole-game__mole-nose {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 35px;
  height: 25px;
  border-radius: 50%;
  background: #ffab91;
  transform: translate(-50%, -50%);
}

.mole-game__mole-nose::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 50%;
  width: 10px;
  height: 8px;
  border-radius: 50%;
  background: #212121;
  transform: translateX(-50%);
}

.mole-game__cat {
  background: #546e7a;
}

.mole-game__cat::before,
.mole-game__cat::after {
  content: '';
  position: absolute;
  top: -15px;
  width: 0;
  height: 0;
  border-right: 18px solid transparent;
  border-bottom: 30px solid #546e7a;
  border-left: 18px solid transparent;
}

.mole-game__cat::before {
  left: 2px;
  transform: rotate(-10deg);
}

.mole-game__cat::after {
  right: 2px;
  transform: rotate(10deg);
}

.mole-game__cat-eyes {
  position: absolute;
  top: 25px;
  left: 15px;
  width: 16px;
  height: 12px;
  border-radius: 50%;
  background: #cddc39;
  box-shadow: 35px 0 0 #cddc39;
}

.mole-game__cat-eyes::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 4px;
  height: 8px;
  border-radius: 50%;
  background: #000;
  box-shadow: 35px 0 0 #000;
}

.mole-game__cat-face {
  position: absolute;
  top: 45px;
  left: 50%;
  width: 10px;
  height: 8px;
  border-radius: 50%;
  background: #ff8a80;
  transform: translateX(-50%);
}

.mole-game__cat-face::before,
.mole-game__cat-face::after {
  content: '';
  position: absolute;
  top: 2px;
  width: 30px;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 0 rgba(255, 255, 255, 0.5), 0 -8px 0 rgba(255, 255, 255, 0.5);
}

.mole-game__cat-face::before {
  right: 15px;
  transform: rotate(5deg);
}

.mole-game__cat-face::after {
  left: 15px;
  transform: rotate(-5deg);
}

.mole-game__hole--topo .mole-game__mole,
.mole-game__hole--gato .mole-game__cat {
  bottom: 0;
}
</style>
