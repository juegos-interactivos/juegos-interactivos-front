<template>
  <v-container fluid class="pa-4 pa-md-8">
    <h2 class="text-h4 font-weight-bold mb-8 pl-2 d-flex align-center" style="color: #10b981;">
      <v-icon large color="#10b981" class="mr-3">mdi-shield-account</v-icon>
      {{ $t('admin.title') }}
    </h2>

    <v-sheet color="white" class="rounded-xl shadow-custom overflow-hidden">
      <v-tabs v-model="tab" background-color="#f8fafc" color="#10b981" grow slider-size="4">
        <v-tab class="font-weight-bold text-subtitle-1 text-md-h6 text-capitalize py-4 transition-swing" style="color: #64748b;">
          <v-icon left class="mr-2">mdi-account-group</v-icon>
          {{ $t('admin.tabs.users') }}
        </v-tab>
        <v-tab class="font-weight-bold text-subtitle-1 text-md-h6 text-capitalize py-4 transition-swing" style="color: #64748b;">
          <v-icon left class="mr-2">mdi-gamepad-variant</v-icon>
          {{ $t('admin.tabs.games') }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" style="background-color: transparent;" class="pa-4 pa-md-8">
        <v-tab-item>
          <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center mb-8 gap-4">
            <h3 class="text-h5 font-weight-bold mb-4 mb-sm-0" style="color: #2c3e50;">{{ $t('admin.users.title') }}</h3>
            <v-text-field
              v-model="searchUsers"
              append-icon="mdi-magnify"
              :label="$t('admin.users.search')"
              single-line
              hide-details
              outlined
              dense
              rounded
              color="#10b981"
              background-color="#f4f7f6"
              class="search-input"
              style="max-width: 350px; width: 100%;"
            ></v-text-field>
          </div>

          <v-data-table
            :headers="headersUsers"
            :items="users"
            :search="searchUsers"
            class="custom-table"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                :color="item.status === 'Activo' ? '#e6f8f1' : '#fee2e2'"
                :text-color="item.status === 'Activo' ? '#10b981' : '#ef4444'"
                small
                class="font-weight-bold px-3"
              >
                {{ $t('admin.status.' + item.status.toLowerCase()) }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex justify-end">
                <v-btn icon small class="mr-2 transition-swing action-btn-hover" @click="openUserEditor(item)">
                  <v-icon color="#64748b" class="icon-hover-blue">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small class="transition-swing action-btn-hover" @click="banUser(item)">
                  <v-icon :color="item.status === 'Activo' ? '#ef4444' : '#10b981'">
                    {{ item.status === 'Activo' ? 'mdi-account-cancel' : 'mdi-account-check' }}
                  </v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-tab-item>

        <v-tab-item>
          <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center mb-8 gap-4">
            <h3 class="text-h5 font-weight-bold mb-4 mb-sm-0" style="color: #2c3e50;">{{ $t('admin.games.title') }}</h3>
            <v-btn 
              color="#10b981" 
              class="white--text font-weight-bold rounded-pill px-6 transition-swing btn-hover-shadow" 
              elevation="2"
            >
              <v-icon left>mdi-plus</v-icon>
              {{ $t('admin.games.add_game') }}
            </v-btn>
          </div>

          <v-data-table
            :headers="headersGames"
            :items="games"
            class="custom-table"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.image`]="{ item }">
              <v-avatar size="48" rounded class="my-2 shadow-sm border-avatar">
                <v-img :src="getImage(item.image)" style="background-color: #f1f5f9;"></v-img>
              </v-avatar>
            </template>
            <template v-slot:[`item.visible`]="{ item }">
              <v-icon :color="item.visible ? '#10b981' : '#94a3b8'">
                {{ item.visible ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex justify-end">
                <v-btn icon small class="mr-2 transition-swing action-btn-hover" @click="openGameEditor(item)">
                  <v-icon color="#64748b" class="icon-hover-blue">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small class="transition-swing action-btn-hover" @click="deleteGame(item)">
                  <v-icon color="#ef4444">mdi-delete</v-icon>
                </v-btn>
              </div>
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
        { text: this.$t('admin.users.headers.id'), value: 'id', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.users.headers.name'), value: 'name', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.users.headers.email'), value: 'email', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.users.headers.level'), value: 'level', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.users.headers.status'), value: 'status', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.users.headers.actions'), value: 'actions', sortable: false, class: 'text-caption font-weight-bold text-uppercase table-header-text text-right', align: 'right' }
      ];
    },
    headersGames() {
      return [
        { text: this.$t('admin.games.headers.id'), value: 'id', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.games.headers.banner'), value: 'image', sortable: false, class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.games.headers.name'), value: 'name', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin.games.headers.visibility'), value: 'visible', class: 'text-caption font-weight-bold text-uppercase table-header-text text-center', align: 'center' },
        { text: this.$t('admin.games.headers.actions'), value: 'actions', sortable: false, class: 'text-caption font-weight-bold text-uppercase table-header-text text-right', align: 'right' }
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
      this.showToast(this.$t('admin.toast.user_updated'));
    },
    banUser(user) {
      const isActive = user.status === 'Activo';
      const confirmColor = isActive ? '#ef4444' : '#10b981';
      
      Swal.fire({
        title: this.$t('admin.swal.ban.title'),
        text: isActive ? this.$t('admin.swal.ban.text_ban', { name: user.name }) : this.$t('admin.swal.ban.text_unban', { name: user.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#9e9e9e',
        confirmButtonText: this.$t('admin.swal.confirm'),
        cancelButtonText: this.$t('admin.swal.cancel'),
        reverseButtons: true,
        customClass: { popup: 'rounded-xl shadow-custom' }
      }).then((result) => {
        if (result.isConfirmed) {
          user.status = isActive ? 'Baneado' : 'Activo';
          Swal.fire({
            title: this.$t('admin.swal.success_title'), 
            text: isActive ? this.$t('admin.swal.ban.success_ban') : this.$t('admin.swal.ban.success_unban'), 
            icon: 'success',
            confirmButtonColor: '#10b981',
            customClass: { popup: 'rounded-xl shadow-custom' }
          });
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
      this.showToast(this.$t('admin.toast.game_updated'));
    },
    deleteGame(game) {
      Swal.fire({
        title: this.$t('admin.swal.delete_game.title'),
        text: this.$t('admin.swal.delete_game.text', { name: game.name }),
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#9e9e9e',
        confirmButtonText: this.$t('admin.swal.delete_game.confirm_btn'),
        cancelButtonText: this.$t('admin.swal.cancel'),
        reverseButtons: true,
        customClass: { popup: 'rounded-xl shadow-custom' }
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.games.indexOf(game);
          this.games.splice(index, 1);
          Swal.fire({
            title: this.$t('admin.swal.delete_game.success_title'), 
            text: this.$t('admin.swal.delete_game.success_text'), 
            icon: 'success',
            confirmButtonColor: '#10b981',
            customClass: { popup: 'rounded-xl shadow-custom' }
          });
        }
      });
    },
    showToast(title) {
      Swal.fire({ 
        toast: true, 
        position: 'bottom-end', 
        icon: 'success', 
        iconColor: '#10b981',
        title: title, 
        showConfirmButton: false, 
        timer: 2000,
        customClass: { popup: 'rounded-xl shadow-custom' }
      });
    }
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0px 8px 25px rgba(16, 185, 129, 0.1) !important;
}

.shadow-sm {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05) !important;
}

.border-avatar {
  border: 1px solid #e2e8f0;
}

.gap-4 {
  gap: 1rem;
}

::v-deep .v-tab--active {
  color: #10b981 !important;
  background-color: white;
}

::v-deep .search-input fieldset {
  border-color: transparent;
  transition: border-color 0.3s ease;
}

::v-deep .search-input.v-input--is-focused fieldset {
  border-color: #10b981 !important;
}

.btn-hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(16, 185, 129, 0.3) !important;
}

.action-btn-hover:hover {
  background-color: #f1f5f9 !important;
}

.action-btn-hover:hover .icon-hover-blue {
  color: #3b82f6 !important;
}

/* Custom Table Styles */
.theme--light.v-data-table.custom-table {
  background-color: transparent !important;
}

::v-deep .custom-table > .v-data-table__wrapper > table > thead > tr > th {
  border-bottom: 2px solid #e2e8f0 !important;
  color: #64748b !important;
  letter-spacing: 0.5px;
}

::v-deep .custom-table > .v-data-table__wrapper > table > tbody > tr > td {
  border-bottom: 1px solid #f1f5f9 !important;
  color: #2c3e50;
  font-weight: 500;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

::v-deep .custom-table > .v-data-table__wrapper > table > tbody > tr {
  transition: background-color 0.2s ease;
}

::v-deep .custom-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: #f8fafc !important;
}
</style>