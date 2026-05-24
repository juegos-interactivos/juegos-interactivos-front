<template>
  <v-container fluid class="pa-4">
    <v-row class="fill-height" align="stretch">
      <v-col cols="12" md="4" lg="3">
        <v-sheet
          color="#9e9e9e"
          class="rounded-xl pa-6 d-flex flex-column"
          height="100%"
          min-height="500"
        >
          <div class="d-flex justify-center mb-6 mt-4">
            <v-sheet 
              color="white" 
              width="140" 
              height="140" 
              class="d-flex align-center justify-center rounded-lg" 
              elevation="0"
            >
              <v-icon size="120" color="grey darken-2">mdi-account</v-icon>
            </v-sheet>
          </div>

          <div class="text-h6 text-center mb-8">{{ profile.nickname }}</div>
          <div class="text-body-1 mb-4">Nivel: {{ profile.level }}</div>
          <div class="text-body-1 mb-4">Usuario desde: {{ profile.registeredAt }}</div>
          <div class="text-body-1 mb-auto">Mejor record: {{ profile.bestRecord }}</div>

          <div class="text-center mt-8">
            <v-menu top offset-y rounded="lg">
              <template v-slot:activator="{ on, attrs }">
                <span 
                  class="caption text-decoration-underline" 
                  style="cursor: pointer;"
                  v-bind="attrs"
                  v-on="on"
                >
                  Ajustes
                </span>
              </template>

              <v-list>
                <v-list-item @click="handleSettingsAction('change_name')">
                  <v-list-item-title>Cambiar nombre</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click="handleSettingsAction('delete_record')">
                  <v-list-item-title>Eliminar record</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click="handleSettingsAction('delete_account')">
                  <v-list-item-title class="red--text font-weight-bold">Borrar cuenta</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="8" lg="9">
        <v-sheet
          color="#9e9e9e"
          class="rounded-xl pa-8 d-flex flex-column relative"
          height="100%"
          style="position: relative;"
        >
          <h2 class="text-center text-h4 font-weight-bold mb-10">Ranking</h2>

          <div class="px-md-8">
            <v-simple-table class="transparent-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left text-h6 font-weight-bold black--text pb-2">JUEGO</th>
                    <th class="text-left text-h6 font-weight-bold black--text pb-2">PUESTO</th>
                    <th class="text-center text-h6 font-weight-bold black--text pb-2">PUNTUACIÓN</th>
                    <th class="text-right text-h6 font-weight-bold black--text pb-2">TIEMPO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(game, i) in rankings" :key="i">
                    <td class="text-h6 font-weight-regular pt-4 pb-4">{{ game.name }}</td>
                    <td class="text-h6 font-weight-regular pt-4 pb-4">{{ game.rank }}</td>
                    <td class="text-center text-h6 font-weight-regular pt-4 pb-4">{{ game.score }}</td>
                    <td class="text-right text-h6 font-weight-regular pt-4 pb-4">{{ game.time }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <v-spacer></v-spacer>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      profileFallback: {
        nickname: 'Invitado',
        level: 0,
        registeredAt: '-',
        bestRecord: '-'
      },
      rankingsFallback: [
        { name: 'Buscaminas', rank: '140', score: '4200', time: '11:30' },
        { name: 'Juego y', rank: 'Puesto', score: 'Puntuación', time: 'Tiempo' },
        { name: 'Juego z', rank: 'Puesto', score: 'Puntuación', time: 'Tiempo' }
      ]
    }
  },
  computed: {
    profile() {
      const user = this.$store.state.auth.user;

      if (!user) {
        return this.profileFallback;
      }

      return {
        nickname: user.nickname,
        level: user.level || 0,
        registeredAt: user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '-',
        bestRecord: user.best_record || '-'
      };
    },
    rankings() {
      const rankings = this.$store.getters['user_games/rankings'];
      return rankings.length ? rankings : this.rankingsFallback;
    }
  },
  async mounted() {
    this.$store.dispatch('auth/init');
    await Promise.all([
      this.$store.dispatch('auth/me').catch(() => null),
      this.$store.dispatch('games/fetchAll').catch(() => null)
    ]);
  },
  methods: {
    handleSettingsAction(action) {
      if (action === 'change_name') {
      } else if (action === 'delete_record') {
      } else if (action === 'delete_account') {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará tu cuenta permanentemente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#757575',
          confirmButtonText: 'Borrar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              '¡Borrada!',
              'Tu cuenta ha sido eliminada correctamente.',
              'success'
            );
          }
        });
      }
    }
  }
}
</script>

<style scoped>
.theme--light.v-data-table.transparent-table {
  background-color: transparent !important;
}

.transparent-table > .v-data-table__wrapper > table > thead > tr > th {
  border-bottom: 2px solid rgba(0, 0, 0, 0.6) !important;
}

.transparent-table > .v-data-table__wrapper > table > tbody > tr > td {
  border-bottom: none !important;
}

.transparent-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
