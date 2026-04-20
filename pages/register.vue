<template>
  <div class="register-wrapper">
    <v-sheet
      color="#9e9e9e"
      class="rounded-xl pa-10 d-flex flex-column"
      width="100%"
      max-width="450"
    >
      <h2 class="text-center text-h5 font-weight-bold mb-8 black--text">
        Registrarse
      </h2>

      <v-form @submit.prevent="registrar">
        <v-text-field
          v-model="nombre"
          placeholder="Nombre"
          solo
          flat
          hide-details
          class="mb-5 rounded-lg"
          background-color="white"
        ></v-text-field>

        <v-text-field
          v-model="password"
          placeholder="Contraseña"
          type="password"
          solo
          flat
          hide-details
          class="mb-5 rounded-lg"
          background-color="white"
        ></v-text-field>

        <v-text-field
          v-model="confirmarPassword"
          placeholder="Confirmar contraseña"
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
          Crear
        </v-btn>
      </v-form>

      <div class="text-center">
        <nuxt-link 
          to="/login" 
          class="text-body-2 font-weight-medium text-decoration-underline" 
          style="color: #2c4c6b;"
        >
          Ya tienes una cuenta? Inicia Sesión
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
      password: '',
      confirmarPassword: ''
    }
  },
  methods: {
    registrar() {
      console.log('Intentando registrar con:', this.nombre, this.password, this.confirmarPassword)
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