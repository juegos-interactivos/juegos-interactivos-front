<template>
  <v-container fluid class="pa-4 pa-md-8">
    <h2 class="text-h4 font-weight-bold mb-8 pl-2">Panel de Administración</h2>

    <v-sheet color="#9e9e9e" class="rounded-xl pa-4 pa-md-8 shadow-custom">
      <v-tabs v-model="tab" background-color="transparent" color="black" grow>
        <v-tab class="font-weight-bold text-h6">Usuarios</v-tab>
        <v-tab class="font-weight-bold text-h6">Juegos</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" style="background-color: transparent;" class="mt-8">
        <v-tab-item>
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h5 font-weight-bold">Gestión de Usuarios</h3>
            <v-text-field
              v-model="userSearch"
              append-icon="mdi-magnify"
              label="Buscar usuario"
              single-line
              hide-details
              solo
              flat
              rounded
              dense
              style="max-width: 300px;"
            ></v-text-field>
          </div>

          <v-data-table
            :headers="userHeaders"
            :items="users"
            :search="userSearch"
            :loading="$store.state.users.loading"
            class="transparent-table"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                :color="item.status === 'Activo' ? 'green darken-1' : 'red darken-1'"
                text-color="white"
                small
                class="font-weight-bold"
              >
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon small class="mr-2" @click="openUserEditor(item)">
                <v-icon color="black">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="toggleUserStatus(item)">
                <v-icon :color="item.status === 'Activo' ? 'red' : 'green'">
                  {{ item.status === 'Activo' ? 'mdi-cancel' : 'mdi-check-circle' }}
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>

        <v-tab-item>
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h5 font-weight-bold">Gestión de Juegos</h3>
            <v-btn color="black" class="white--text font-weight-bold rounded-pill" elevation="0">
              <v-icon left>mdi-plus</v-icon>
              Añadir Juego
            </v-btn>
          </div>

          <v-data-table
            :headers="gameHeaders"
            :items="games"
            :loading="$store.state.games.loading"
            class="transparent-table"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.image`]="{ item }">
              <v-avatar size="40" rounded class="my-2">
                <v-img :src="getImage(item.image)" style="background-color: #757575;"></v-img>
              </v-avatar>
            </template>
            <template v-slot:[`item.isActive`]="{ item }">
              <v-icon :color="item.isActive ? 'green darken-1' : 'grey darken-2'">
                {{ item.isActive ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon small class="mr-2" @click="openGameEditor(item)">
                <v-icon color="black">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="deleteGame(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>

    <AdminDialogUsuario 
      v-model="dialogUsuario" 
      :user="selectedUser" 
      @save="updateUser" 
    />

    <AdminDialogJuego 
      v-model="dialogJuego" 
      :game="selectedGame" 
      @save="updateGame" 
    />
  </v-container>
</template>

<script>
import Swal from 'sweetalert2';
import AdminDialogUsuario from '@/components/AdminDialogUsuario.vue';
import AdminDialogJuego from '@/components/AdminDialogJuego.vue';

export default {
  name: 'AdminPanel',
  components: {
    AdminDialogUsuario,
    AdminDialogJuego
  },
  data() {
    return {
      tab: 0,
      userSearch: '',
      dialogUsuario: false,
      dialogJuego: false,
      selectedUser: {},
      selectedGame: {},
      
      userHeaders: [
        { text: 'ID', value: 'id', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'NOMBRE', value: 'nickname', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'EMAIL', value: 'mail', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'NIVEL', value: 'level', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'ESTADO', value: 'status', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'ACCIONES', value: 'actions', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text text-right', align: 'right' }
      ],
      usersFallback: [
        { id: 1, nickname: 'NachoTrabaja', mail: 'nacho@ejemplo.com', level: 12, status: 'Activo' },
        { id: 2, nickname: 'GamerPro99', mail: 'gamerpro@ejemplo.com', level: 45, status: 'Activo' },
        { id: 3, nickname: 'ToxicPlayer', mail: 'toxic@ejemplo.com', level: 8, status: 'Baneado' }
      ],
      
      gameHeaders: [
        { text: 'ID', value: 'id', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'BANNER', value: 'image', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'NOMBRE', value: 'name', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'VISIBILIDAD', value: 'isActive', class: 'text-subtitle-1 font-weight-bold black--text text-center', align: 'center' },
        { text: 'ACCIONES', value: 'actions', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text text-right', align: 'right' }
      ],
      gamesFallback: [
        { id: 1, name: 'Buscaminas Pro', image: 'buscaminas.jpeg', isActive: true },
        { id: 2, name: 'Pokemon', image: 'pokemon.jpg', isActive: true },
        { id: 3, name: 'Pixel Runner', image: 'pixel-runner.png', isActive: false }
      ]
    }
  },
  computed: {
    users() {
      const users = this.$store.getters['users/list'];
      return users.length ? users : this.usersFallback;
    },
    games() {
      const games = this.$store.getters['games/list'];
      return games.length ? games : this.gamesFallback;
    }
  },
  async mounted() {
    this.$store.dispatch('auth/init');
    await Promise.all([
      this.$store.dispatch('users/fetchAll').catch(() => null),
      this.$store.dispatch('games/fetchAll').catch(() => null)
    ]);
  },
  methods: {
    getImage(fileName) {
      if (!fileName) {
        return null;
      }

      if (/^https?:\/\//.test(fileName) || fileName.startsWith('/')) {
        return fileName;
      }

      try {
        return require(`@/assets/banners/${fileName}`);
      } catch (e) {
        return null;
      }
    },
    openUserEditor(user) {
      this.selectedUser = user;
      this.dialogUsuario = true;
    },
    async updateUser(newData) {
      try {
        if (this.$store.state.users.items.length) {
          await this.$store.dispatch('users/update', newData);
        } else {
          const index = this.usersFallback.findIndex(user => user.id === newData.id);
          if (index !== -1) {
            this.$set(this.usersFallback, index, newData);
          }
        }
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Usuario actualizado', showConfirmButton: false, timer: 1500 });
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    },
    toggleUserStatus(user) {
      const action = user.status === 'Activo' ? 'banear' : 'desbanear';
      const color = user.status === 'Activo' ? '#d33' : '#4CAF50';
      
      Swal.fire({
        title: `¿Estás seguro?`,
        text: `Vas a ${action} al usuario ${user.nickname}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: color,
        cancelButtonColor: '#757575',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          user.status = user.status === 'Activo' ? 'Baneado' : 'Activo';
          Swal.fire('¡Éxito!', `El usuario ha sido ${action}do correctamente.`, 'success');
        }
      });
    },
    openGameEditor(game) {
      this.selectedGame = game;
      this.dialogJuego = true;
    },
    async updateGame(newData) {
      try {
        if (this.$store.state.games.items.length) {
          await this.$store.dispatch('games/update', newData);
        } else {
          const index = this.gamesFallback.findIndex(game => game.id === newData.id);
          if (index !== -1) {
            this.$set(this.gamesFallback, index, newData);
          }
        }
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Juego actualizado', showConfirmButton: false, timer: 1500 });
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    },
    deleteGame(game) {
      Swal.fire({
        title: '¿Eliminar juego?',
        text: `Vas a eliminar permanentemente ${game.name}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#757575',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.$store.state.games.items.length) {
            this.$store.dispatch('games/destroy', game.id)
              .then(() => Swal.fire('¡Eliminado!', 'El juego ha sido borrado.', 'success'))
              .catch(error => Swal.fire('Error', error.message, 'error'));
            return;
          }

          const index = this.gamesFallback.indexOf(game);
          this.gamesFallback.splice(index, 1);
          Swal.fire('¡Eliminado!', 'El juego ha sido borrado.', 'success');
        }
      });
    }
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0px 4px 15px rgba(0,0,0,0.15) !important;
}

::v-deep .theme--light.v-tabs-items {
  background-color: transparent !important;
}

::v-deep .v-tab--active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px 8px 0 0;
}

.theme--light.v-data-table.transparent-table {
  background-color: transparent !important;
}

::v-deep .transparent-table > .v-data-table__wrapper > table > thead > tr > th {
  border-bottom: 2px solid rgba(0, 0, 0, 0.6) !important;
}

::v-deep .transparent-table > .v-data-table__wrapper > table > tbody > tr > td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

::v-deep .transparent-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
