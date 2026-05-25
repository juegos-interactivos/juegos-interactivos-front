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
            :placeholder="$t('menu.search')"
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
          {{ $t('menu.home') }}
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2 mx-4" to="/juegos">
          {{ $t('menu.games') }}
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2" to="/perfil">
          {{ $t('menu.profile') }}
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2 ml-4" to="/login">
          {{ $t('menu.login') }}
        </v-btn>
        <v-btn text class="black--text font-weight-bold text-h5 text-none px-2 ml-4" to="/admin">
          {{ $t('menu.admin') }}
        </v-btn>
      </v-sheet>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-menu top offset-y rounded="xl" transition="slide-y-reverse-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#9e9e9e"
          class="black--text font-weight-bold lang-selector shadow-custom"
          elevation="0"
          rounded
          v-bind="attrs"
          v-on="on"
        >
          <v-icon left color="black">mdi-translate</v-icon>
          {{ idiomaActual }}
        </v-btn>
      </template>
      
      <v-list color="#9e9e9e" class="rounded-xl pa-2 shadow-custom">
        <v-list-item 
          @click="cambiarIdioma('es')" 
          class="rounded-lg mb-1" 
          :class="{'active-lang': $i18n.locale === 'es'}"
        >
          <v-list-item-title class="font-weight-bold text-center black--text">ES</v-list-item-title>
        </v-list-item>
        <v-list-item 
          @click="cambiarIdioma('en')" 
          class="rounded-lg" 
          :class="{'active-lang': $i18n.locale === 'en'}"
        >
          <v-list-item-title class="font-weight-bold text-center black--text">EN</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      search: ''
    }
  },
  computed: {
    idiomaActual() {
      // Retorna el idioma actual en mayúsculas (ES o EN)
      return this.$i18n.locale ? this.$i18n.locale.toUpperCase() : 'ES';
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
  },
  methods: {
    cambiarIdioma(codigo) {
      if (this.$i18n.locale !== codigo) {
        // En Nuxt-i18n, se recomienda usar setLocale()
        if (typeof this.$i18n.setLocale === 'function') {
          this.$i18n.setLocale(codigo);
        } else {
          // Fallback para configuraciones más sencillas de vue-i18n
          this.$i18n.locale = codigo;
        }
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

/* Estilos del selector de idiomas flotante */
.lang-selector {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 100;
}

.shadow-custom {
  box-shadow: 0px 4px 15px rgba(0,0,0,0.15) !important;
}

.active-lang {
  background-color: rgba(255, 255, 255, 0.4) !important;
}

::v-deep .v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>