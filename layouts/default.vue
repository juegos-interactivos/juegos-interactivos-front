<template>
  <v-app>
    <v-app-bar app flat color="white" height="90">
      <div class="d-flex align-center">
        <img src="~/assets/sweetpea.png" alt="Logo" height="60" class="mr-3" />
        <div class="font-italic font-weight-medium" style="line-height: 1.2; color: #333;">
          Nombre en<br>progreso
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-sheet color="#9e9e9e" class="d-flex align-center rounded-pill px-6 py-2 menu-container">
        <div :class="['search-wrapper', { 'search-active': $route.path === '/juegos' }]">
          <v-text-field
            v-model="search"
            placeholder="Buscar"
            append-icon="mdi-magnify"
            solo
            flat
            rounded
            dense
            hide-details
            style="width: 250px;"
          ></v-text-field>
        </div>

        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2" to="/">
          Inicio
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2 mx-4" to="/juegos">
          Juegos
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2" to="/perfil">
          Perfil
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2 ml-4" to="/login">
          Inicia Sesión
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2 ml-4" to="/admin">
          Panel de administración
        </v-btn>
      </v-sheet>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      search: ''
    }
  },
  watch: {
    search(nuevoValor) {
      this.$nuxt.$emit('buscar-juego', nuevoValor);
    },
    $route(to) {
      if (to.path !== '/juegos') {
        this.search = '';
      }
    }
  }
}
</script>

<style scoped>
.menu-container {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.search-wrapper {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  margin-right: 0;
  transition: max-width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), 
              opacity 0.3s ease-in-out, 
              margin-right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.search-active {
  max-width: 250px;
  opacity: 1;
  margin-right: 24px;
}
</style>