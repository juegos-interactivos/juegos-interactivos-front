<template>
  <div class="register-wrapper">
    <v-sheet
      color="#9e9e9e"
      class="rounded-xl pa-10 d-flex flex-column"
      width="100%"
      max-width="450"
    >
      <h2 class="text-center text-h5 font-weight-bold mb-8 black--text">
        {{ $t('register.title') }}
      </h2>

      <v-form @submit.prevent="registrar">
        <v-text-field
          v-model="nombre"
          :placeholder="$t('register.name_placeholder')"
          solo
          flat
          hide-details
          class="mb-5 rounded-lg"
          background-color="white"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :placeholder="$t('register.email_placeholder')"
          type="email"
          solo
          flat
          hide-details
          class="mb-5 rounded-lg"
          background-color="white"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :placeholder="$t('register.password_placeholder')"
          type="password"
          solo
          flat
          hide-details
          class="mb-5 rounded-lg"
          background-color="white"
        ></v-text-field>

        <v-text-field
          v-model="confirmarPassword"
          :placeholder="$t('register.confirm_password_placeholder')"
          type="password"
          solo
          flat
          hide-details
          class="mb-8 rounded-lg"
          background-color="white"
        ></v-text-field>

        <v-btn
          block
          color="#60d3d4"
          class="black--text font-weight-bold text-capitalize rounded-lg mb-8"
          height="48"
          elevation="0"
          type="submit"
        >
          {{ $t('register.btn_create') }}
        </v-btn>
      </v-form>

      <div class="text-center">
        <nuxt-link 
          to="/login" 
          class="text-body-2 font-weight-medium text-decoration-underline" 
          style="color: #2c4c6b;"
        >
          {{ $t('register.have_account') }}
        </nuxt-link>
      </div>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'Registro',
  data() {
    return {
      nombre: '',
      email: '',
      password: '',
      confirmarPassword: ''
    }
  },
  methods: {
    registrar() {
    }
  }
}
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 10rem;
}
</style>