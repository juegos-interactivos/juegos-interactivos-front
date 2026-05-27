<template>
  <v-container fluid class="pa-4 pa-md-8">
    <v-sheet 
      color="white" 
      class="rounded-xl pa-8 pa-md-16 text-center shadow-custom mb-10 d-flex flex-column justify-center align-center" 
      min-height="450"
    >
      <h1 class="text-h3 text-md-h2 font-weight-bold mb-6" style="color: #10b981;">
        {{ $t('index.welcome_title') }}
      </h1>
      
      <p class="text-h6 text-md-h5 mb-10" style="max-width: 700px; color: #2c3e50;">
        {{ $t('index.welcome_desc') }}
      </p>
      
      <v-btn 
        color="#10b981" 
        class="white--text font-weight-bold text-h6 rounded-pill px-10 py-6 explore-btn transition-swing" 
        elevation="4" 
        to="/juegos"
      >
        {{ $t('index.explore_btn') }}
      </v-btn>
    </v-sheet>

    <v-row>
      <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
        <v-card 
          color="white" 
          class="rounded-xl pa-8 text-center shadow-custom feature-card transition-swing" 
          elevation="0" 
          height="100%"
        >
          <div class="icon-wrapper mb-6 mx-auto d-flex justify-center align-center">
            <v-icon size="40" color="#10b981">
              {{ feature.icon }}
            </v-icon>
          </div>
          <h3 class="text-h5 font-weight-bold mb-3" style="color: #2c3e50;">
            {{ feature.title }}
          </h3>
          <p class="text-body-1 mb-0" style="color: #64748b;">
            {{ feature.desc }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HomePage',
  computed: {
    features() {
      return [
        { 
          icon: 'mdi-gamepad-variant', 
          title: this.$t('index.features.play_now.title'), 
          desc: this.$t('index.features.play_now.desc') 
        },
        { 
          icon: 'mdi-trophy', 
          title: this.$t('index.features.compete.title'), 
          desc: this.$t('index.features.compete.desc') 
        },
        { 
          icon: 'mdi-heart', 
          title: this.$t('index.features.favorites.title'), 
          desc: this.$t('index.features.favorites.desc') 
        }
      ]
    }
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0px 8px 20px rgba(16, 185, 129, 0.1) !important;
}

.feature-card {
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 12px 25px rgba(16, 185, 129, 0.2) !important;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #e6f8f1;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.feature-card:hover .icon-wrapper {
  transform: scale(1.1);
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 25px rgba(16, 185, 129, 0.4) !important;
}
</style>