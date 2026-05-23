<template>
  <v-sheet color="green darken-1" dark min-height="100%" class="py-6 px-2">
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
            color="blue darken-2"
            active-class="blue darken-3 white--text elevation-6"
            class="font-weight-bold"
          >
            {{ opcion.texto }}
          </v-btn>
        </v-btn-toggle>

        <v-btn
          color="red darken-1"
          class="ml-2 font-weight-bold"
          @click="reiniciarJuego"
        >
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
                Intentos: <strong class="ml-1">{{ intentos }}</strong>
              </v-chip>
            </v-col>

            <v-col cols="auto">
              <v-chip color="transparent" text-color="white" label>
                Puntos: <strong class="ml-1">{{ puntosVisibles }}</strong>
              </v-chip>
            </v-col>
          </v-row>
        </v-sheet>
      </v-row>

      <div
      class="juego-parejas__tablero d-flex flex-wrap justify-center mx-auto pa-1 pa-sm-5"
      :style="{ maxWidth: anchoTablero }"
      aria-label="Tablero de juego de parejas"
    >
      <button
        v-for="carta in cartas"
        :key="carta.id"
        type="button"
        class="juego-parejas__tarjeta"
        :class="{ 'juego-parejas__tarjeta--girada': carta.girada || carta.encontrada }"
        :style="estiloTarjeta"
        :aria-label="carta.girada || carta.encontrada ? `Pareja ${carta.valor}` : 'Carta oculta'"
        @click="girarTarjeta(carta)"
      >
        <span class="juego-parejas__frontal" aria-hidden="true"></span>
        <span
          class="juego-parejas__trasera"
          :style="{
            background: carta.color,
            fontSize: tamanoSimbolo
          }"
          aria-hidden="true"
        >
          {{ carta.simbolo }}
        </span>
      </button>
      </div>
    </v-container>
  </v-sheet>
</template>

<script>
const SIMBOLOS = ['★', '◆', '●', '▲', '♣', '♥', '☀', '☂', '♫', '⚑', '✿', '✦']

export default {
  name: 'Juego1',
  data() {
    return {
      dificultades: [
        { valor: '1', texto: 'Fácil', cantidad: 6, ancho: '600px' },
        { valor: '2', texto: 'Normal', cantidad: 12, ancho: '780px' },
        { valor: '3', texto: 'Difícil', cantidad: 24, ancho: '1450px' }
      ],
      dificultadActual: '2',
      cartas: [],
      cartasGiradas: [],
      bloqueado: false,
      parejasEncontradas: 0,
      tiempo: 0,
      intentos: 0,
      puntos: 0,
      intervaloTiempo: null,
      primerClick: false
    }
  },
  computed: {
    dificultadSeleccionada() {
      return this.dificultades.find(dificultad => dificultad.valor === this.dificultadActual)
    },
    cantidadTarjetas() {
      return this.dificultadSeleccionada.cantidad
    },
    anchoTablero() {
      return this.dificultadSeleccionada.ancho
    },
    puntosVisibles() {
      return this.puntos > 0 ? Math.round(this.puntos) : 0
    },
    estiloTarjeta() {
      if (this.$vuetify && this.$vuetify.breakpoint.xsOnly) {
        return {
          width: '92px',
          height: '124px'
        }
      }

      return {
        width: '150px',
        height: '200px'
      }
    },
    tamanoSimbolo() {
      return this.$vuetify && this.$vuetify.breakpoint.xsOnly ? '2.5rem' : '4rem'
    }
  },
  mounted() {
    this.iniciarJuego()
  },
  beforeDestroy() {
    this.detenerTiempo()
  },
  methods: {
    ajustarDificultad(dificultad) {
      this.dificultadActual = dificultad
      this.reiniciarJuego()
    },
    iniciarJuego() {
      this.detenerTiempo()
      this.cartasGiradas = []
      this.bloqueado = false
      this.parejasEncontradas = 0
      this.tiempo = 0
      this.intentos = 0
      this.puntos = 0
      this.primerClick = false
      this.cartas = this.crearCartas()
    },
    crearCartas() {
      const pares = []

      for (let valor = 1; valor <= this.cantidadTarjetas / 2; valor++) {
        pares.push(valor, valor)
      }

      return this.barajar(pares).map((valor, index) => ({
        id: `${valor}-${index}-${Date.now()}`,
        valor,
        simbolo: SIMBOLOS[valor - 1],
        color: this.colorCarta(valor),
        girada: false,
        encontrada: false
      }))
    },
    barajar(cartas) {
      return [...cartas].sort(() => Math.random() - 0.5)
    },
    colorCarta(valor) {
      const tono = (valor * 47) % 360
      return `linear-gradient(135deg, hsl(${tono}, 72%, 46%), hsl(${(tono + 35) % 360}, 78%, 58%))`
    },
    girarTarjeta(carta) {
      if (this.bloqueado || carta.girada || carta.encontrada || carta === this.cartasGiradas[0]) {
        return
      }

      if (!this.primerClick) {
        this.iniciarTiempo()
      }

      carta.girada = true
      this.cartasGiradas.push(carta)

      if (this.cartasGiradas.length === 2) {
        this.compararCartas()
      }
    },
    iniciarTiempo() {
      this.primerClick = true
      this.intervaloTiempo = setInterval(() => {
        this.tiempo += 1
        this.puntos -= Number(this.dificultadActual)
      }, 1000)
    },
    compararCartas() {
      this.bloqueado = true
      this.intentos += 1

      const [primeraCarta, segundaCarta] = this.cartasGiradas
      const multiplicador = Number(this.dificultadActual)

      if (primeraCarta.valor === segundaCarta.valor) {
        primeraCarta.encontrada = true
        segundaCarta.encontrada = true
        this.puntos += 150 * multiplicador
        this.cartasGiradas = []
        this.bloqueado = false
        this.parejasEncontradas += 1

        if (this.parejasEncontradas === this.cantidadTarjetas / 2) {
          this.finalizarJuego()
        }

        return
      }

      this.puntos -= 25 * multiplicador
      setTimeout(() => {
        primeraCarta.girada = false
        segundaCarta.girada = false
        this.cartasGiradas = []
        this.bloqueado = false
      }, 1000)
    },
    finalizarJuego() {
      this.detenerTiempo()
      setTimeout(() => {
        const mensaje = `Tiempo: ${this.tiempo}s\nIntentos: ${this.intentos}\nPuntos Finales: ${this.puntosVisibles}`

        if (this.$swal) {
          this.$swal('Felicidades', mensaje, 'success')
          return
        }

        window.alert(`Felicidades\n\n${mensaje}`)
      }, 500)
    },
    reiniciarJuego() {
      this.iniciarJuego()
    },
    detenerTiempo() {
      if (this.intervaloTiempo) {
        clearInterval(this.intervaloTiempo)
        this.intervaloTiempo = null
      }
    }
  }
}
</script>

<style scoped>
.juego-parejas__tablero {
  gap: 15px;
}

.juego-parejas__tarjeta {
  position: relative;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  perspective: 1000px;
}

.juego-parejas__frontal,
.juego-parejas__trasera {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #333;
  border-radius: 10px;
  backface-visibility: hidden;
  transition: transform 1s ease;
}

.juego-parejas__frontal {
  background: #e74c3c;
}

.juego-parejas__trasera {
  color: #fff;
  font-weight: 900;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  transform: rotateY(180deg);
}

.juego-parejas__tarjeta--girada .juego-parejas__frontal {
  transform: rotateY(180deg);
}

.juego-parejas__tarjeta--girada .juego-parejas__trasera {
  transform: rotateY(360deg);
}
</style>
