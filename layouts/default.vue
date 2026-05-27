<template>
  <v-app>
    <v-app-bar app elevation="1" color="white" height="90">
      <nuxt-link to="/" class="d-flex align-center text-decoration-none">
        <img src="~/assets/sweetpea.png" alt="Logo" height="60" class="mr-3" />
        <div class="font-italic font-weight-bold text-h6" style="line-height: 1.2; color: #10b981;">
          G de<br>Juegos
        </div>
      </nuxt-link>

      <v-spacer></v-spacer>

      <v-sheet color="#10b981" class="d-flex align-center rounded-pill px-6 py-2 menu-container shadow-custom">
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
            background-color="white"
            color="#10b981"
            style="width: 250px;"
          ></v-text-field>
        </div>

        <v-btn text class="white--text font-weight-bold text-h6 text-none px-4 rounded-pill transition-swing" active-class="active-nav-btn" to="/">
          {{ $t('menu.home') }}
        </v-btn>
        <v-btn text class="white--text font-weight-bold text-h6 text-none px-4 mx-2 rounded-pill transition-swing" active-class="active-nav-btn" to="/juegos">
          {{ $t('menu.games') }}
        </v-btn>
        <v-btn text class="white--text font-weight-bold text-h6 text-none px-4 rounded-pill transition-swing" active-class="active-nav-btn" to="/perfil">
          {{ $t('menu.profile') }}
        </v-btn>
        <v-btn text class="white--text font-weight-bold text-h6 text-none px-4 ml-2 rounded-pill transition-swing" active-class="active-nav-btn" to="/login">
          {{ $t('menu.login') }}
        </v-btn>
        <v-btn text class="white--text font-weight-bold text-h6 text-none px-4 ml-2 rounded-pill transition-swing" active-class="active-nav-btn" to="/admin">
          {{ $t('menu.admin') }}
        </v-btn>
      </v-sheet>
    </v-app-bar>

    <v-main style="background-color: #f4f7f6;">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-menu top offset-y rounded="xl" transition="slide-y-reverse-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#10b981"
          class="white--text font-weight-bold lang-selector shadow-custom"
          elevation="4"
          fab
          large
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-translate</v-icon>
          <span class="ml-1">{{ currentLanguage }}</span>
        </v-btn>
      </template>
      
      <v-list color="white" class="rounded-xl pa-2 shadow-custom">
        <v-list-item 
          @click="changeLanguage('es')" 
          class="rounded-lg mb-1 transition-swing" 
          :class="{'active-lang': $i18n.locale === 'es'}"
        >
          <v-list-item-title class="font-weight-bold text-center" :class="{'white--text': $i18n.locale === 'es', 'green--text text--darken-2': $i18n.locale !== 'es'}">ES</v-list-item-title>
        </v-list-item>
        <v-list-item 
          @click="changeLanguage('en')" 
          class="rounded-lg transition-swing" 
          :class="{'active-lang': $i18n.locale === 'en'}"
        >
          <v-list-item-title class="font-weight-bold text-center" :class="{'white--text': $i18n.locale === 'en', 'green--text text--darken-2': $i18n.locale !== 'en'}">EN</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      search: ''
    }
  },
  computed: {
    currentLanguage() {
      return this.$i18n.locale ? this.$i18n.locale.toUpperCase() : 'ES';
    }
  },
  watch: {
    search(newValue) {
      this.$nuxt.$emit('search-game', newValue);
    },
    $route(to) {
      if (to.path !== '/juegos') {
        this.search = '';
      }
    }
  },
  methods: {
    changeLanguage(code) {
      if (this.$i18n.locale !== code) {
        if (typeof this.$i18n.setLocale === 'function') {
          this.$i18n.setLocale(code);
        } else {
          this.$i18n.locale = code;
        }
        
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          iconColor: '#10b981',
          title: this.$t('menu.lang_changed'),
          showConfirmButton: false,
          timer: 2000,
          background: '#ffffff',
          color: '#10b981',
          customClass: {
            popup: 'rounded-xl shadow-custom'
          }
        });
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

.lang-selector {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 100;
  border-radius: 28px !important;
  width: auto !important;
  padding: 0 20px !important;
}

.shadow-custom {
  box-shadow: 0px 8px 20px rgba(16, 185, 129, 0.2) !important;
}

.active-nav-btn {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.active-lang {
  background-color: #10b981 !important;
}

::v-deep .v-list-item:hover:not(.active-lang) {
  background-color: rgba(16, 185, 129, 0.1) !important;
}

::v-deep .v-btn:hover::before {
  opacity: 0.1;
}
</style>