<template>
  <v-container fluid class="pa-4 pa-md-8">
    <h2 class="text-h4 font-weight-bold mb-8 pl-2">{{ $t('juegos.title') }}</h2>

    <v-row>
      <v-col
        v-for="juego in juegosOrdenados"
        :key="juego.id"
        cols="12"
        sm="6"
        md="4"
        class="pa-4"
      >
        <v-card
          :to="juego.enlace"
          class="rounded-xl game-card transparent"
          elevation="0"
        >
          <v-sheet color="#9e9e9e" class="rounded-xl overflow-hidden shadow-custom relative-container">
            <v-img 
              :src="obtenerImagen(juego.imagen)" 
              aspect-ratio="1.7778"
            >
              <v-btn
                icon
                class="action-btn visibility-btn"
                @click.stop.prevent="toggleVisibilidad(juego.id)"
              >
                <v-icon size="28" color="black">
                  {{ juego.visible ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </v-btn>

              <v-btn
                icon
                class="action-btn favorite-btn"
                @click.stop.prevent="marcarFavorito(juego.id)"
              >
                <v-icon 
                  size="32" 
                  :color="juego.favorito ? '#ff3333' : 'black'"
                  :class="{ 'corazon-marcado': juego.favorito }"
                >
                  {{ juego.favorito ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </v-img>
          </v-sheet>

          <div class="text-center mt-3">
            <span class="text-h6 font-weight-bold black--text">
              {{ juego.nombre }}
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'GamesPage',
  data() {
    return {
      searchQuery: '',
      juegos: [
        { id: 1, nombre: 'Buscaminas Pro', imagen: 'buscaminas.jpeg', enlace: '/juegos/buscaminas', favorito: false, visible: true },
        { id: 2, nombre: 'Pokemon', imagen: 'pokemon.jpg', enlace: '/juegos/aventura', favorito: false, visible: true },
        { id: 3, nombre: 'Pixel Runner', imagen: 'pixel-runner.png', enlace: '/juegos/runner', favorito: false, visible: true },
        { id: 4, nombre: 'Sudoku Master', imagen: 'sudoku.png', enlace: '/juegos/sudoku', favorito: false, visible: true },
        { id: 5, nombre: 'Tower Defense', imagen: 'tower.png', enlace: '/juegos/tower', favorito: false, visible: true },
        { id: 6, nombre: 'Neon Plats', imagen: 'neon.png', enlace: '/juegos/neon', favorito: false, visible: true },
        { id: 7, nombre: 'Cerebro Activo', imagen: 'cerebro.png', enlace: '/juegos/puzzle', favorito: false, visible: true },
        { id: 8, nombre: 'Dungeon Crawler', imagen: 'dungeon.png', enlace: '/juegos/dungeon', favorito: false, visible: true },
        { id: 9, nombre: 'Speed Drifter', imagen: 'drifter.png', enlace: '/juegos/drifter', favorito: false, visible: true }
      ]
    }
  },
  computed: {
    juegosOrdenados() {
      let lista = [...this.juegos];

      if (this.searchQuery) {
        const termino = this.searchQuery.toLowerCase();
        lista = lista.filter(juego => juego.nombre.toLowerCase().includes(termino));
      }

      return lista.sort((a, b) => {
        if (a.favorito === b.favorito) return 0;
        return a.favorito ? -1 : 1;
      });
    }
  },
  mounted() {
    this.$nuxt.$on('search-game', (termino) => {
      this.searchQuery = termino;
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('search-game');
  },
  methods: {
    marcarFavorito(id) {
      const juego = this.juegos.find(j => j.id === id);
      if (juego) {
        juego.favorito = !juego.favorito;
      }
    },
    toggleVisibilidad(id) {
      const juego = this.juegos.find(j => j.id === id);
      if (juego) {
        juego.visible = !juego.visible;
      }
    },
    obtenerImagen(nombreArchivo) {
      try {
        return require(`@/assets/banners/${nombreArchivo}`);
      } catch (e) {
        return null; 
      }
    }
  }
}
</script>

<style scoped>
.game-card {
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none; 
}

.game-card:hover {
  transform: scale(1.03);
}

.shadow-custom {
  box-shadow: 0px 4px 10px rgba(0,0,0,0.1) !important;
}

::v-deep .v-image__image {
  background-size: cover !important;
  background-position: center center !important;
}

.transparent {
  background-color: transparent !important;
}

.relative-container {
  position: relative;
}

.action-btn {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7) !important; 
  backdrop-filter: blur(2px); 
  z-index: 2;
}

.favorite-btn {
  bottom: 12px;
  right: 12px;
}

.visibility-btn {
  top: 12px;
  right: 12px;
}

.corazon-marcado {
  -webkit-text-stroke: 1.5px black;
}
</style>