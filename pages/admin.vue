<template>
  <v-container fluid class="pa-4 pa-md-8">
    <h2 class="text-h4 font-weight-bold mb-8 pl-2">{{ $t('admin.title') }}</h2>

    <v-sheet color="#9e9e9e" class="rounded-xl pa-4 pa-md-8 shadow-custom">
      <v-tabs v-model="tab" background-color="transparent" color="black" grow>
        <v-tab class="font-weight-bold text-h6">{{ $t('admin.tabs.users') }}</v-tab>
        <v-tab class="font-weight-bold text-h6">{{ $t('admin.tabs.games') }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" style="background-color: transparent;" class="mt-8">
        <v-tab-item>
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h5 font-weight-bold">{{ $t('admin.users.title') }}</h3>
            <v-text-field
              v-model="searchUsers"
              append-icon="mdi-magnify"
              :label="$t('admin.users.search')"
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
            :headers="headersUsers"
            :items="users"
            :search="searchUsers"
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
                {{ $t('admin.status.' + item.status.toLowerCase()) }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon small class="mr-2" @click="openUserEditor(item)">
                <v-icon color="black">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="banUser(item)">
                <v-icon :color="item.status === 'Activo' ? 'red' : 'green'">
                  {{ item.status === 'Activo' ? 'mdi-cancel' : 'mdi-check-circle' }}
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>

        <v-tab-item>
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h5 font-weight-bold">{{ $t('admin.games.title') }}</h3>
            <v-btn color="black" class="white--text font-weight-bold rounded-pill" elevation="0">
              <v-icon left>mdi-plus</v-icon>
              {{ $t('admin.games.add_game') }}
            </v-btn>
          </div>

          <v-data-table
            :headers="headersGames"
            :items="games"
            class="transparent-table"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.image`]="{ item }">
              <v-avatar size="40" rounded class="my-2">
                <v-img :src="getImage(item.image)" style="background-color: #757575;"></v-img>
              </v-avatar>
            </template>
            <template v-slot:[`item.visible`]="{ item }">
              <v-icon :color="item.visible ? 'green darken-1' : 'grey darken-2'">
                {{ item.visible ? 'mdi-eye' : 'mdi-eye-off' }}
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
      v-model="dialogUser" 
      :user="selectedUser" 
      @save="updateUser" 
    />

    <AdminDialogJuego 
      v-model="dialogGame" 
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
      searchUsers: '',
      dialogUser: false,
      dialogGame: false,
      selectedUser: {},
      selectedGame: {},
      
      users: [
        { id: 1, name: 'NachoTrabaja', email: 'nacho@ejemplo.com', level: 12, status: 'Activo' },
        { id: 2, name: 'GamerPro99', email: 'gamerpro@ejemplo.com', level: 45, status: 'Activo' },
        { id: 3, name: 'ToxicPlayer', email: 'toxic@ejemplo.com', level: 8, status: 'Baneado' }
      ],
      
      games: [
        { id: 1, name: 'Buscaminas Pro', image: 'buscaminas.jpeg', visible: true },
        { id: 2, name: 'Pokemon', image: 'pokemon.jpg', visible: true },
        { id: 3, name: 'Pixel Runner', image: 'pixel-runner.png', visible: false }
      ]
    }
  },
  computed: {
    headersUsers() {
      return [
        { text: this.$t('admin.users.headers.id'), value: 'id', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.users.headers.name'), value: 'name', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.users.headers.email'), value: 'email', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.users.headers.level'), value: 'level', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.users.headers.status'), value: 'status', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.users.headers.actions'), value: 'actions', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text text-right', align: 'right' }
      ];
    },
    headersGames() {
      return [
        { text: this.$t('admin.games.headers.id'), value: 'id', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.games.headers.banner'), value: 'image', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.games.headers.name'), value: 'name', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: this.$t('admin.games.headers.visibility'), value: 'visible', class: 'text-subtitle-1 font-weight-bold black--text text-center', align: 'center' },
        { text: this.$t('admin.games.headers.actions'), value: 'actions', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text text-right', align: 'right' }
      ];
    }
  },
  methods: {
    getImage(fileName) {
      try {
        return require(`@/assets/banners/${fileName}`);
      } catch (e) {
        return null;
      }
    },
    openUserEditor(user) {
      this.selectedUser = user;
      this.dialogUser = true;
    },
    updateUser(newData) {
      const index = this.users.findIndex(u => u.id === newData.id);
      if (index !== -1) {
        this.$set(this.users, index, newData);
      }
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: this.$t('admin.toast.user_updated'), showConfirmButton: false, timer: 1500 });
    },
    banUser(user) {
      const isActive = user.status === 'Activo';
      const color = isActive ? '#d33' : '#4CAF50';
      
      Swal.fire({
        title: this.$t('admin.swal.ban.title'),
        text: isActive ? this.$t('admin.swal.ban.text_ban', { name: user.name }) : this.$t('admin.swal.ban.text_unban', { name: user.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: color,
        cancelButtonColor: '#757575',
        confirmButtonText: this.$t('admin.swal.confirm'),
        cancelButtonText: this.$t('admin.swal.cancel'),
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          user.status = isActive ? 'Baneado' : 'Activo';
          Swal.fire(
            this.$t('admin.swal.success_title'), 
            isActive ? this.$t('admin.swal.ban.success_ban') : this.$t('admin.swal.ban.success_unban'), 
            'success'
          );
        }
      });
    },
    openGameEditor(game) {
      this.selectedGame = game;
      this.dialogGame = true;
    },
    updateGame(newData) {
      const index = this.games.findIndex(g => g.id === newData.id);
      if (index !== -1) {
        this.$set(this.games, index, newData);
      }
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: this.$t('admin.toast.game_updated'), showConfirmButton: false, timer: 1500 });
    },
    deleteGame(game) {
      Swal.fire({
        title: this.$t('admin.swal.delete_game.title'),
        text: this.$t('admin.swal.delete_game.text', { name: game.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#757575',
        confirmButtonText: this.$t('admin.swal.delete_game.confirm_btn'),
        cancelButtonText: this.$t('admin.swal.cancel'),
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.games.indexOf(game);
          this.games.splice(index, 1);
          Swal.fire(
            this.$t('admin.swal.delete_game.success_title'), 
            this.$t('admin.swal.delete_game.success_text'), 
            'success'
          );
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