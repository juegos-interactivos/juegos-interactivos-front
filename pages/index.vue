<template>
  <v-container fluid class="pa-4 pa-md-8">
    <v-sheet 
      color="#9e9e9e" 
      class="rounded-xl pa-8 pa-md-16 text-center shadow-custom mb-8 d-flex flex-column justify-center align-center" 
      min-height="450"
    >
      <h1 class="text-h3 text-md-h2 font-weight-bold black--text mb-6">
        Bienvenido a G de Juegos
      </h1>
      
      <p class="text-h6 text-md-h5 black--text mb-10" style="max-width: 700px;">
        Descubre nuestra colección de mini-juegos, rompe tus propios récords y compite para liderar los ránkings.
      </p>
      
      <v-btn 
        color="black" 
        class="white--text font-weight-bold text-h6 rounded-pill px-10 py-6" 
        elevation="0" 
        to="/juegos"
      >
        Explorar Juegos
      </v-btn>
    </v-sheet>

    <v-row>
      <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
        <v-card 
          color="#9e9e9e" 
          class="rounded-xl pa-8 text-center shadow-custom" 
          elevation="0" 
          height="100%"
        >
          <v-icon size="64" color="black" class="mb-4">
            {{ feature.icon }}
          </v-icon>
          <h3 class="text-h5 font-weight-bold black--text mb-3">
            {{ feature.title }}
          </h3>
          <p class="black--text text-body-1 mb-0">
            {{ feature.desc }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PaginaInicio',
  data() {
    return {
      features: [
        { 
          icon: 'mdi-gamepad-variant', 
          title: 'Juega ya', 
          desc: 'Accede a una gran variedad de juegos rápidos y divertidos sin necesidad de descargas ni tiempos de espera.' 
        },
        { 
          icon: 'mdi-trophy', 
          title: 'Compite y gana', 
          desc: 'Supera tus propios límites, sube de nivel en tu perfil y compite contra otros usuarios en el ránking global.' 
        },
        { 
          icon: 'mdi-heart', 
          title: 'Guarda tus favoritos', 
          desc: 'Marca los juegos que más te gusten para tenerlos siempre a mano y supérate cada día.' 
        }
      ]
    }
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0px 4px 15px rgba(0,0,0,0.15) !important;
}
</style>