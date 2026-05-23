<template>
  <v-sheet :color="colorFondo" dark min-height="100%" class="py-6 px-2 simon-game">
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

      <v-row justify="center" class="mb-5">
        <v-sheet color="rgba(0, 0, 0, 0.40)" rounded class="px-4 py-2">
          <v-row dense justify="center" align="center">
            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Nivel: <strong class="ml-1">{{ nivel }}</strong>
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
        class="simon-game__board mx-auto pa-4 pa-sm-5"
        :class="{ 'simon-game__board--blocked': bloqueado }"
        :style="{
          gridTemplateColumns: `repeat(${columnas}, ${tamanoBoton})`,
          gap: espacioTablero
        }"
      >
        <v-btn
          v-for="boton in botones"
          :key="boton.indice"
          depressed
          tile
          class="simon-game__button rounded-lg"
          :class="{ 'simon-game__button--active': boton.iluminado }"
          :style="{
            width: tamanoBoton,
            height: tamanoBoton,
            minWidth: tamanoBoton,
            backgroundColor: boton.color,
            color: boton.color
          }"
          :aria-label="`Botón ${boton.indice + 1}`"
          @mousedown.prevent="manejarClickUsuario(boton.indice)"
        ></v-btn>
      </v-sheet>
    </v-container>
  </v-sheet>
</template>

<script>
const COLORES = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#ff6b81', '#ecf0f1']

export default {
  name: 'Juego3',
  data() {
    return {
      dificultades: [
        { valor: '1', texto: 'Fácil', botones: 4, columnas: 2 },
        { valor: '2', texto: 'Normal', botones: 6, columnas: 3 },
        { valor: '3', texto: 'Difícil', botones: 9, columnas: 3 }
      ],
      dificultadActual: '2',
      nivel: 0,
      puntos: 0,
      secuenciaMaquina: [],
      secuenciaUsuario: [],
      bloqueado: true,
      botones: [],
      timeoutsPendientes: [],
      colorFondo: 'blue-grey darken-4'
    }
  },
  computed: {
    dificultadSeleccionada() {
      return this.dificultades.find(dificultad => dificultad.valor === this.dificultadActual)
    },
    cantidadBotones() {
      return this.dificultadSeleccionada.botones
    },
    columnas() {
      return this.dificultadSeleccionada.columnas
    },
    tamanoBoton() {
      return this.$vuetify && this.$vuetify.breakpoint.xsOnly ? '86px' : '120px'
    },
    espacioTablero() {
      return this.$vuetify && this.$vuetify.breakpoint.xsOnly ? '10px' : '15px'
    }
  },
  mounted() {
    this.iniciarJuego()
  },
  beforeDestroy() {
    this.limpiarTimeouts()
  },
  methods: {
    ajustarDificultad(dificultad) {
      this.dificultadActual = dificultad
      this.reiniciarJuego()
    },
    iniciarJuego() {
      this.limpiarTimeouts()
      this.nivel = 0
      this.puntos = 0
      this.secuenciaMaquina = []
      this.secuenciaUsuario = []
      this.bloqueado = true
      this.colorFondo = 'blue-grey darken-4'
      this.botones = Array.from({ length: this.cantidadBotones }, (_, indice) => ({
        indice,
        color: COLORES[indice],
        iluminado: false
      }))
      this.registrarTimeout(this.siguienteNivel, 1000)
    },
    siguienteNivel() {
      this.nivel += 1
      this.secuenciaUsuario = []
      this.secuenciaMaquina.push(Math.floor(Math.random() * this.cantidadBotones))
      this.reproducirSecuencia()
    },
    reproducirSecuencia() {
      this.bloqueado = true

      this.secuenciaMaquina.forEach((indiceBoton, index) => {
        this.registrarTimeout(() => this.iluminarBoton(indiceBoton), (index + 1) * 600)
      })

      this.registrarTimeout(() => {
        this.bloqueado = false
      }, (this.secuenciaMaquina.length * 600) + 500)
    },
    iluminarBoton(indice) {
      const boton = this.botones[indice]
      if (!boton) {
        return
      }

      boton.iluminado = true
      this.registrarTimeout(() => {
        boton.iluminado = false
      }, 300)
    },
    manejarClickUsuario(indice) {
      if (this.bloqueado) {
        return
      }

      this.iluminarBoton(indice)
      this.secuenciaUsuario.push(indice)

      const pasoActual = this.secuenciaUsuario.length - 1
      if (this.secuenciaUsuario[pasoActual] !== this.secuenciaMaquina[pasoActual]) {
        this.terminarJuego()
        return
      }

      const multiplicador = Number(this.dificultadActual)
      this.puntos += 10 * multiplicador

      if (this.secuenciaUsuario.length === this.secuenciaMaquina.length) {
        this.bloqueado = true
        this.puntos += 50 * multiplicador
        this.registrarTimeout(this.siguienteNivel, 1000)
      }
    },
    terminarJuego() {
      this.bloqueado = true
      this.colorFondo = 'red darken-3'
      this.registrarTimeout(() => {
        this.colorFondo = 'blue-grey darken-4'
      }, 300)

      this.registrarTimeout(() => {
        const mensaje = `Nivel alcanzado: ${this.nivel}\nPuntuación Final: ${this.puntos}`

        if (this.$swal) {
          this.$swal('Te equivocaste', mensaje, 'error')
          return
        }

        window.alert(`Te equivocaste\n\n${mensaje}`)
      }, 500)
    },
    reiniciarJuego() {
      this.iniciarJuego()
    },
    registrarTimeout(callback, delay) {
      const timeoutId = setTimeout(() => {
        this.timeoutsPendientes = this.timeoutsPendientes.filter(id => id !== timeoutId)
        callback()
      }, delay)
      this.timeoutsPendientes.push(timeoutId)
      return timeoutId
    },
    limpiarTimeouts() {
      this.timeoutsPendientes.forEach(clearTimeout)
      this.timeoutsPendientes = []
    }
  }
}
</script>

<style scoped>
.simon-game {
  user-select: none;
}

.simon-game__board {
  display: grid;
  justify-content: center;
  align-content: center;
}

.simon-game__button {
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  opacity: 0.5;
  transition: opacity 0.1s, transform 0.1s, border-color 0.1s, box-shadow 0.1s;
}

.simon-game__button--active {
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px currentColor;
  opacity: 1;
  transform: scale(1.05);
}

.simon-game__board--blocked .simon-game__button {
  cursor: not-allowed;
}
</style>
