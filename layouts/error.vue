<template>
  <v-app style="background-color: #f4f7f6;">
    <v-container fluid class="fill-height d-flex flex-column justify-center align-center pa-4">
      <v-sheet
        color="white"
        class="rounded-xl pa-10 d-flex flex-column align-center text-center shadow-custom"
        max-width="500"
        width="100%"
      >
        <div class="icon-wrapper mb-6 d-flex justify-center align-center">
          <v-icon size="60" color="#ef4444">mdi-alert-circle-outline</v-icon>
        </div>
        
        <h1 class="text-h4 font-weight-bold mb-8" style="color: #2c3e50;">
          {{ error.statusCode === 404 ? $t('error.page_not_found') : $t('error.other_error') }}
        </h1>
        
        <v-btn
          color="#10b981"
          class="white--text font-weight-bold rounded-pill px-8 transition-swing error-btn"
          elevation="4"
          height="52"
          to="/"
        >
          {{ $t('error.home_page') }}
        </v-btn>
      </v-sheet>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'ErrorPage',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    const title = this.error.statusCode === 404 
      ? this.$t('error.page_not_found') 
      : this.$t('error.other_error')
    return {
      title
    }
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0px 8px 25px rgba(16, 185, 129, 0.1) !important;
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  background-color: #fee2e2;
  border-radius: 50%;
}

.error-btn {
  letter-spacing: 0.5px;
}

.error-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 20px rgba(16, 185, 129, 0.3) !important;
}
</style>