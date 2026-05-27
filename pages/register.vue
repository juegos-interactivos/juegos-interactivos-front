<template>
  <div class="register-wrapper">
    <v-sheet
      color="white"
      class="rounded-xl pa-10 d-flex flex-column shadow-custom"
      width="100%"
      max-width="450"
    >
      <div class="d-flex justify-center mb-6">
        <v-avatar size="80" color="#e6f8f1">
          <v-icon size="40" color="#10b981">mdi-account-plus</v-icon>
        </v-avatar>
      </div>

      <h2 class="text-center text-h5 font-weight-bold mb-8" style="color: #2c3e50;">
        {{ $t('register.title') }}
      </h2>

      <v-form @submit.prevent="register">
        <v-text-field
          v-model="name"
          :placeholder="$t('register.name_placeholder')"
          outlined
          color="#10b981"
          hide-details
          class="mb-5 rounded-lg input-custom"
          background-color="#f4f7f6"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :placeholder="$t('register.email_placeholder')"
          type="email"
          outlined
          color="#10b981"
          hide-details
          class="mb-5 rounded-lg input-custom"
          background-color="#f4f7f6"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :placeholder="$t('register.password_placeholder')"
          type="password"
          outlined
          color="#10b981"
          hide-details
          class="mb-5 rounded-lg input-custom"
          background-color="#f4f7f6"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          :placeholder="$t('register.confirm_password_placeholder')"
          type="password"
          outlined
          color="#10b981"
          hide-details
          class="mb-8 rounded-lg input-custom"
          background-color="#f4f7f6"
        ></v-text-field>

        <v-btn
          block
          color="#10b981"
          class="white--text font-weight-bold text-capitalize rounded-pill mb-8 auth-btn transition-swing"
          height="52"
          elevation="4"
          type="submit"
        >
          {{ $t('register.btn_create') }}
        </v-btn>
      </v-form>

      <div class="text-center">
        <nuxt-link 
          to="/login" 
          class="text-body-1 font-weight-bold text-decoration-none auth-link transition-swing" 
        >
          {{ $t('register.have_account') }}
        </nuxt-link>
      </div>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    register() {
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
  padding: 1rem;
  margin-top: 5rem;
  margin-bottom: 5rem;
}

.shadow-custom {
  box-shadow: 0px 8px 25px rgba(16, 185, 129, 0.15) !important;
}

::v-deep .input-custom fieldset {
  border-color: transparent;
  transition: border-color 0.3s ease;
}

::v-deep .input-custom.v-input--is-focused fieldset {
  border-color: #10b981 !important;
}

.auth-btn {
  letter-spacing: 0.5px;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 20px rgba(16, 185, 129, 0.3) !important;
}

.auth-link {
  color: #10b981 !important;
}

.auth-link:hover {
  color: #059669 !important;
  text-decoration: underline !important;
}
</style>