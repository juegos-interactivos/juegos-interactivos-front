<template>
  <v-container fluid class="pa-4 pa-md-8">
    <v-row class="fill-height" align="stretch">
      <v-col cols="12" md="4" lg="3">
        <v-sheet
          class="rounded-xl pa-8 d-flex flex-column align-center shadow-custom"
          height="100%"
          min-height="500"
          color="white"
        >
          <div class="mb-6 position-relative">
            <v-avatar size="150" color="#e6f8f1">
              <v-icon size="80" color="#10b981">mdi-account</v-icon>
            </v-avatar>
          </div>

          <div class="text-h5 font-weight-bold mb-6" style="color: #2c3e50;">{{ profile.name }}</div>

          <v-divider class="w-100 mb-6" style="border-color: #10b981; opacity: 0.2;"></v-divider>

          <div class="d-flex flex-column align-start w-100 mb-auto">
            <div class="mb-4 w-100 text-left">
              <span class="font-weight-bold grey--text text--darken-1 text-uppercase caption">{{ $t('perfil.nivel') }}</span>
              <div class="text-h6 font-weight-bold" style="color: #10b981;">{{ profile.level }}</div>
            </div>
            <div class="mb-4 w-100 text-left">
              <span class="font-weight-bold grey--text text--darken-1 text-uppercase caption">{{ $t('perfil.usuario_desde') }}</span>
              <div class="text-body-1 font-weight-medium" style="color: #2c3e50;">{{ profile.registrationDate }}</div>
            </div>
            <div class="mb-4 w-100 text-left">
              <span class="font-weight-bold grey--text text--darken-1 text-uppercase caption">{{ $t('perfil.mejor_record') }}</span>
              <div class="text-body-1 font-weight-medium" style="color: #2c3e50;">{{ profile.bestRecord }}</div>
            </div>
          </div>

          <v-menu top offset-y rounded="xl" transition="slide-y-reverse-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="#10b981"
                class="rounded-pill font-weight-bold mt-8 px-8 transition-swing"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon left>mdi-cog</v-icon>
                {{ $t('perfil.ajustes') }}
              </v-btn>
            </template>

            <v-list class="rounded-xl pa-2 shadow-custom" color="white">
              <v-list-item @click="settingsAction('change_name')" class="rounded-lg mb-1 transition-swing menu-item-hover">
                <v-icon left color="#10b981" class="mr-3">mdi-pencil</v-icon>
                <v-list-item-title class="font-weight-bold" style="color: #2c3e50;">{{ $t('perfil.menu.cambiar_nombre') }}</v-list-item-title>
              </v-list-item>
              
              <v-list-item @click="settingsAction('delete_record')" class="rounded-lg mb-1 transition-swing menu-item-hover">
                <v-icon left color="#f59e0b" class="mr-3">mdi-trophy-broken</v-icon>
                <v-list-item-title class="font-weight-bold" style="color: #2c3e50;">{{ $t('perfil.menu.eliminar_record') }}</v-list-item-title>
              </v-list-item>
              
              <v-list-item @click="settingsAction('delete_account')" class="rounded-lg transition-swing menu-item-danger">
                <v-icon left color="#ef4444" class="mr-3">mdi-delete-alert</v-icon>
                <v-list-item-title class="font-weight-bold" style="color: #ef4444;">{{ $t('perfil.menu.borrar_cuenta') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="8" lg="9">
        <v-sheet
          class="rounded-xl pa-8 d-flex flex-column shadow-custom"
          height="100%"
          color="white"
        >
          <h2 class="text-h4 font-weight-bold mb-10 pl-2 d-flex align-center" style="color: #10b981;">
            <v-icon large color="#10b981" class="mr-3">mdi-podium</v-icon>
            {{ $t('perfil.ranking_title') }}
          </h2>

          <div class="px-md-4">
            <v-simple-table class="transparent-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left text-subtitle-1 font-weight-bold pb-4">{{ $t('perfil.tabla.juego') }}</th>
                    <th class="text-left text-subtitle-1 font-weight-bold pb-4">{{ $t('perfil.tabla.puesto') }}</th>
                    <th class="text-center text-subtitle-1 font-weight-bold pb-4">{{ $t('perfil.tabla.puntuacion') }}</th>
                    <th class="text-right text-subtitle-1 font-weight-bold pb-4">{{ $t('perfil.tabla.tiempo') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(game, i) in rankings" :key="i">
                    <td class="text-body-1 font-weight-bold pt-5 pb-5">{{ game.name }}</td>
                    <td class="text-body-1 font-weight-medium pt-5 pb-5">
                      <v-chip small color="#e6f8f1" text-color="#10b981" class="font-weight-bold">
                        #{{ game.rank }}
                      </v-chip>
                    </td>
                    <td class="text-center text-body-1 font-weight-bold pt-5 pb-5" style="color: #10b981;">{{ game.score }}</td>
                    <td class="text-right text-body-1 font-weight-medium pt-5 pb-5">{{ game.time }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
        name: 'NachoTrabaja',
        level: 12,
        registrationDate: '12/05/2021',
        bestRecord: '4200 (Buscaminas)'
      },
      rankings: [
        { name: 'Buscaminas', rank: '140', score: '4200', time: '11:30' },
        { name: 'Juego y', rank: '210', score: '2500', time: '08:15' },
        { name: 'Juego z', rank: '15', score: '8900', time: '22:10' }
      ]
    }
  },
  methods: {
    async settingsAction(action) {
      if (action === 'change_name') {
        const { value: newName } = await Swal.fire({
          title: this.$t('perfil.swal.change_name_title'),
          input: 'text',
          inputValue: this.profile.name,
          showCancelButton: true,
          confirmButtonText: this.$t('perfil.swal.btn_update'),
          cancelButtonText: this.$t('perfil.swal.btn_cancelar'),
          confirmButtonColor: '#10b981',
          cancelButtonColor: '#9e9e9e',
          reverseButtons: true,
          customClass: { popup: 'rounded-xl shadow-custom' }
        });

        if (newName && newName.trim() !== '') {
          this.profile.name = newName.trim();
          Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            iconColor: '#10b981',
            title: this.$t('perfil.swal.name_updated'),
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: 'rounded-xl shadow-custom' }
          });
        }
      } else if (action === 'delete_record') {
        Swal.fire({
          title: this.$t('perfil.swal.delete_record_title'),
          text: this.$t('perfil.swal.delete_record_text'),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#9e9e9e',
          confirmButtonText: this.$t('perfil.swal.btn_delete'),
          cancelButtonText: this.$t('perfil.swal.btn_cancelar'),
          reverseButtons: true,
          customClass: { popup: 'rounded-xl shadow-custom' }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: this.$t('perfil.swal.record_deleted'),
              icon: 'success',
              confirmButtonColor: '#10b981',
              customClass: { popup: 'rounded-xl shadow-custom' }
            });
          }
        });
      } else if (action === 'delete_account') {
        Swal.fire({
          title: this.$t('perfil.swal.borrar_titulo'),
          text: this.$t('perfil.swal.borrar_texto'),
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#9e9e9e',
          confirmButtonText: this.$t('perfil.swal.btn_borrar'),
          cancelButtonText: this.$t('perfil.swal.btn_cancelar'),
          reverseButtons: true,
          customClass: { popup: 'rounded-xl shadow-custom' }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: this.$t('perfil.swal.borrado_titulo'),
              text: this.$t('perfil.swal.borrado_texto'),
              icon: 'success',
              confirmButtonColor: '#10b981',
              customClass: { popup: 'rounded-xl shadow-custom' }
            });
          }
        });
      }
    }
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0px 8px 20px rgba(16, 185, 129, 0.1) !important;
}

.w-100 {
  width: 100%;
}

.menu-item-hover:hover {
  background-color: rgba(16, 185, 129, 0.1) !important;
}

.menu-item-danger:hover {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

.theme--light.v-data-table.transparent-table {
  background-color: transparent !important;
}

::v-deep .transparent-table > .v-data-table__wrapper > table > thead > tr > th {
  border-bottom: 2px solid rgba(16, 185, 129, 0.2) !important;
  color: #10b981 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

::v-deep .transparent-table > .v-data-table__wrapper > table > tbody > tr > td {
  border-bottom: 1px solid rgba(16, 185, 129, 0.1) !important;
  color: #2c3e50;
}

::v-deep .transparent-table > .v-data-table__wrapper > table > tbody > tr {
  transition: background-color 0.2s ease;
}

::v-deep .transparent-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: rgba(16, 185, 129, 0.05) !important;
}
</style>