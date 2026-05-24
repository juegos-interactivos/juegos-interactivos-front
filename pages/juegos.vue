<template>
  <v-container fluid class="pa-4 pa-md-8">
    <h2 class="text-h4 font-weight-bold mb-8 pl-2">Todos los juegos</h2>

    <v-alert v-if="$store.state.games.error" type="error" text>
      {{ $store.state.games.error }}
    </v-alert>

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
          :to="`/Juego${game.id}`"
          class="rounded-xl game-card transparent"
          elevation="0"
        >
          <v-sheet color="#9e9e9e" class="rounded-xl overflow-hidden shadow-custom relative-container">
            <v-img 
              :src="getImage(game.image)" 
              aspect-ratio="1.7778"
            >
              <v-btn
                icon
                class="action-btn visibility-btn"
                @click.stop.prevent="toggleVisibility(game.id)"
              >
                <v-icon size="28" color="black">
                  {{ game.isActive ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </v-btn>

              <v-btn
                icon
                class="action-btn favorite-btn"
                @click.stop.prevent="toggleFavorite(game.id)"
              >
                <v-icon 
                  size="32" 
                  :color="game.isFavorite ? '#ff3333' : 'black'"
                  :class="{ 'corazon-marcado': game.isFavorite }"
                >
                  {{ game.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </v-img>
          </v-sheet>

          <div class="text-center mt-3">
            <span class="text-h6 font-weight-bold black--text">
              {{ game.name }}
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PaginaJuegos',
  data() {
    return {
      searchQuery: '',
      gamesFallback: [
        { id: 1, name: 'Buscaminas Pro', image: 'buscaminas.jpeg', link: '/juegos/buscaminas', isFavorite: false, isActive: true },
        { id: 2, name: 'Pokemon', image: 'pokemon.jpg', link: '/juegos/aventura', isFavorite: false, isActive: true },
        { id: 3, name: 'Pixel Runner', image: 'pixel-runner.png', link: '/juegos/runner', isFavorite: false, isActive: true },
        { id: 4, name: 'Sudoku Master', image: 'sudoku.png', link: '/juegos/sudoku', isFavorite: false, isActive: true },
        { id: 5, name: 'Tower Defense', image: 'tower.png', link: '/juegos/tower', isFavorite: false, isActive: true },
        { id: 6, name: 'Neon Plats', image: 'neon.png', link: '/juegos/neon', isFavorite: false, isActive: true },
        { id: 7, name: 'Cerebro Activo', image: 'cerebro.png', link: '/juegos/puzzle', isFavorite: false, isActive: true },
        { id: 8, name: 'Dungeon Crawler', image: 'dungeon.png', link: '/juegos/dungeon', isFavorite: false, isActive: true },
        { id: 9, name: 'Speed Drifter', image: 'drifter.png', link: '/juegos/drifter', isFavorite: false, isActive: true }
      ]
    }
  },
  computed: {
    games() {
      const games = this.$store.getters['games/list'];
      return games.length ? games : this.gamesFallback;
    },
    sortedGames() {
      let list = [...this.games];

      if (this.searchQuery) {
        const searchTerm = this.searchQuery.toLowerCase();
        list = list.filter(game => game.name.toLowerCase().includes(searchTerm));
      }

      return list.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) return 0;
        return a.isFavorite ? -1 : 1;
      });
    }
  },
  async mounted() {
    this.$store.dispatch('auth/init');
    await this.$store.dispatch('games/fetchAll').catch(() => null);

    this.$nuxt.$on('search-game', (term) => {
      this.searchQuery = term;
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('search-game');
  },
  methods: {
    toggleFavorite(id) {
      const game = this.games.find(game => game.id === id);
      if (game) {
        if (!this.$store.state.games.items.length) {
          game.isFavorite = !game.isFavorite;
          return;
        }

        this.$store.commit('games/UPSERT_GAME', {
          ...game,
          isFavorite: !game.isFavorite
        });
        // TODO: implementar endpoint en el back para persistir favoritos y reemplazar este commit local por dispatch.
      }
    },
    async toggleVisibility(id) {
      if (!this.$store.state.games.items.length) {
        const game = this.gamesFallback.find(game => game.id === id);
        if (game) {
          game.isActive = !game.isActive;
        }
        return;
      }

      await this.$store.dispatch('games/toggle', id).catch(() => null);
    },
    getImage(fileName) {
      if (!fileName) {
        return null;
      }

      if (/^https?:\/\//.test(fileName) || fileName.startsWith('/')) {
        return fileName;
      }

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
