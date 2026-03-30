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

      <v-sheet color="#9e9e9e" class="d-flex align-center rounded-pill px-4" height="60" min-width="40%">
        <v-text-field
          v-if="$route.path === '/juegos'"
          v-model="search"
          placeholder="Buscar"
          append-icon="mdi-magnify"
          solo
          flat
          rounded
          dense
          hide-details
          style="max-width: 250px;"
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2" to="/">
          Inicio
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2 mx-4" to="/juegos">
          Juegos
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2" to="/perfil">
          Perfil
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
  }
}
</script>