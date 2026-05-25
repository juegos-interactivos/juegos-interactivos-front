<template>
  <v-app>
    <v-container fluid class="fill-height d-flex flex-column justify-center align-center pa-4">
      <v-sheet
        color="#9e9e9e"
        class="rounded-xl pa-10 d-flex flex-column align-center text-center shadow-custom"
        max-width="500"
        width="100%"
      >
        <v-icon size="80" color="black" class="mb-6">mdi-alert-circle-outline</v-icon>
        
        <h1 class="text-h4 font-weight-bold black--text mb-8">
          {{ error.statusCode === 404 ? $t('error.page_not_found') : $t('error.other_error') }}
        </h1>
        
        <v-btn
          color="black"
          class="white--text font-weight-bold rounded-pill px-8"
          elevation="0"
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
  box-shadow: 0px 4px 15px rgba(0,0,0,0.15) !important;
}
</style>