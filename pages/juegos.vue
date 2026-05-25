<template>
  <v-container fluid class="pa-4 pa-md-8">
    <h2 class="text-h4 font-weight-bold mb-8 pl-2" style="color: #10b981;">
      {{ $t('juegos.title') }}
    </h2>

    <v-row>
      <v-col
        v-for="game in sortedGames"
        :key="game.id"
        cols="12"
        sm="6"
        md="4"
        class="pa-4"
      >
        <v-card
          :to="game.link"
          class="rounded-xl game-card transparent"
          elevation="0"
        >
          <v-sheet class="rounded-xl overflow-hidden shadow-custom relative-container" style="background-color: white;">
            <v-img 
              :src="getImage(game.image)" 
              aspect-ratio="1.7778"
            >
              <v-btn
                icon
                class="action-btn visibility-btn transition-swing"
                @click.stop.prevent="toggleVisibility(game.id)"
              >
                <v-icon size="28" :color="game.isVisible ? '#10b981' : 'grey darken-1'">
                  {{ game.isVisible ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </v-btn>

              <v-btn
                icon
                class="action-btn favorite-btn transition-swing"
                @click.stop.prevent="toggleFavorite(game.id)"
              >
                <v-icon 
                  size="32" 
                  :color="game.isFavorite ? '#ef4444' : 'grey darken-1'"
                  :class="{ 'corazon-marcado': game.isFavorite }"
                >
                  {{ game.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </v-img>
          </v-sheet>

          <div class="text-center mt-4">
            <span class="text-h6 font-weight-bold" style="color: #2c3e50;">
              {{ game.name }}
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'GamesPage',
  data() {
    return {
      searchQuery: '',
      games: [
        { id: 1, name: 'Buscaminas Pro', image: 'buscaminas.jpeg', link: '/juegos/buscaminas', isFavorite: false, isVisible: true },
        { id: 2, name: 'Pokemon', image: 'pokemon.jpg', link: '/juegos/aventura', isFavorite: false, isVisible: true },
        { id: 3, name: 'Pixel Runner', image: 'pixel-runner.png', link: '/juegos/runner', isFavorite: false, isVisible: true },
        { id: 4, name: 'Sudoku Master', image: 'sudoku.png', link: '/juegos/sudoku', isFavorite: false, isVisible: true },
        { id: 5, name: 'Tower Defense', image: 'tower.png', link: '/juegos/tower', isFavorite: false, isVisible: true },
        { id: 6, name: 'Neon Plats', image: 'neon.png', link: '/juegos/neon', isFavorite: false, isVisible: true },
        { id: 7, name: 'Cerebro Activo', image: 'cerebro.png', link: '/juegos/puzzle', isFavorite: false, isVisible: true },
        { id: 8, name: 'Dungeon Crawler', image: 'dungeon.png', link: '/juegos/dungeon', isFavorite: false, isVisible: true },
        { id: 9, name: 'Speed Drifter', image: 'drifter.png', link: '/juegos/drifter', isFavorite: false, isVisible: true }
      ]
    }
  },
  computed: {
    sortedGames() {
      let list = [...this.games];

      if (this.searchQuery) {
        const term = this.searchQuery.toLowerCase();
        list = list.filter(game => game.name.toLowerCase().includes(term));
      }

      return list.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) return 0;
        return a.isFavorite ? -1 : 1;
      });
    }
  },
  mounted() {
    this.$nuxt.$on('search-game', (term) => {
      this.searchQuery = term;
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('search-game');
  },
  methods: {
    toggleFavorite(id) {
      const game = this.games.find(g => g.id === id);
      if (game) {
        game.isFavorite = !game.isFavorite;
        
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: game.isFavorite ? 'success' : 'info',
          iconColor: game.isFavorite ? '#ef4444' : '#10b981',
          title: game.isFavorite ? this.$t('juegos.added_favorite') : this.$t('juegos.removed_favorite'),
          showConfirmButton: false,
          timer: 2000,
          background: '#ffffff',
          color: '#2c3e50',
          customClass: {
            popup: 'rounded-xl shadow-custom'
          }
        });
      }
    },
    toggleVisibility(id) {
      const game = this.games.find(g => g.id === id);
      if (game) {
        game.isVisible = !game.isVisible;
      }
    },
    getImage(fileName) {
      try {
        return require(`@/assets/banners/${fileName}`);
      } catch (e) {
        return null; 
      }
    }
  }
}
</script>

<style scoped>
.game-card {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  text-decoration: none; 
}

.game-card:hover {
  transform: translateY(-5px);
}

.game-card:hover .shadow-custom {
  box-shadow: 0px 12px 25px rgba(16, 185, 129, 0.3) !important;
}

.shadow-custom {
  box-shadow: 0px 8px 20px rgba(16, 185, 129, 0.15) !important;
  transition: box-shadow 0.3s ease-in-out;
}

::v-deep .v-image__image {
  background-size: cover !important;
  background-position: center center !important;
  transition: transform 0.5s ease;
}

.game-card:hover ::v-deep .v-image__image {
  transform: scale(1.05);
}

.transparent {
  background-color: transparent !important;
}

.relative-container {
  position: relative;
}

.action-btn {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.85) !important; 
  backdrop-filter: blur(4px); 
  z-index: 2;
  transition: all 0.2s ease-in-out;
}

.action-btn:hover {
  transform: scale(1.1);
  background-color: #ffffff !important;
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
  -webkit-text-stroke: 1.5px #ef4444;
}
</style>