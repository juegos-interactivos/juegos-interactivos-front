<template>
  <v-dialog :value="value" @input="$emit('input', $event)" max-width="800">
    <v-card class="rounded-xl pa-4" color="white" elevation="0">
      <v-card-title class="text-h5 font-weight-bold mb-4 d-flex align-center" style="color: #2c3e50;">
        <v-icon color="#10b981" class="mr-3" large>mdi-account-edit</v-icon>
        {{ $t('admin_dialog_usuario.title') }} <span style="color: #10b981;" class="ml-2">{{ localUser.name }}</span>
      </v-card-title>
      
      <v-card-text>
        <v-sheet color="#f8fafc" class="pa-4 rounded-lg mb-6">
          <v-row>
            <v-col cols="12" sm="6" class="d-flex flex-column justify-center pb-0">
              <span class="text-caption font-weight-bold text-uppercase mb-1" style="color: #64748b;">{{ $t('admin_dialog_usuario.username_label') }}</span>
              <span class="text-h6 font-weight-bold" style="color: #2c3e50;">{{ localUser.name }}</span>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex flex-column justify-center pb-0">
              <span class="text-caption font-weight-bold text-uppercase mb-1" style="color: #64748b;">{{ $t('admin_dialog_usuario.email_label') }}</span>
              <span class="text-h6 font-weight-bold" style="color: #2c3e50;">{{ localUser.email }}</span>
            </v-col>
          </v-row>
        </v-sheet>

        <h4 class="text-h6 font-weight-bold mt-8 mb-4 d-flex align-center" style="color: #2c3e50;">
          <v-icon left color="#64748b">mdi-format-list-numbered</v-icon>
          {{ $t('admin_dialog_usuario.scores_table') }}
        </h4>
        
        <v-data-table
          :headers="headers"
          :items="scores"
          class="custom-table elevation-0"
          hide-default-footer
          disable-pagination
          style="background-color: transparent !important;"
        ></v-data-table>
      </v-card-text>

      <v-card-actions class="px-6 pb-4 pt-6 flex-wrap">
        <v-btn color="#10b981" outlined class="font-weight-bold rounded-pill mr-2 mb-2 transition-swing action-btn-hover" @click="changeName">
          <v-icon left small>mdi-pencil</v-icon>
          {{ $t('admin_dialog_usuario.btn_change_name') }}
        </v-btn>
        <v-btn color="#10b981" outlined class="font-weight-bold rounded-pill mb-2 transition-swing action-btn-hover" @click="changeEmail">
          <v-icon left small>mdi-email-edit</v-icon>
          {{ $t('admin_dialog_usuario.btn_change_email') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn text class="font-weight-bold mb-2 transition-swing" color="#64748b" @click="$emit('input', false)">
          {{ $t('admin_dialog_usuario.close') }}
        </v-btn>
        <v-btn color="#10b981" class="white--text font-weight-bold rounded-pill px-6 mb-2 transition-swing btn-hover-shadow" elevation="2" @click="save">
          <v-icon left>mdi-content-save</v-icon>
          {{ $t('admin_dialog_usuario.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'AdminDialogUser',
  props: {
    value: Boolean,
    user: Object
  },
  data() {
    return {
      localUser: {},
      scores: []
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t('admin_dialog_usuario.headers.game'), value: 'game', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin_dialog_usuario.headers.score'), value: 'score', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin_dialog_usuario.headers.time'), value: 'time', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin_dialog_usuario.headers.date'), value: 'date', class: 'text-caption font-weight-bold text-uppercase table-header-text' }
      ];
    }
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this.localUser = { ...this.user };
        this.scores = [
          { id: 101, game: 'Buscaminas Pro', score: 4200, time: '11:30', date: '14/10/2023' },
          { id: 102, game: 'Sudoku Master', score: 1500, time: '05:45', date: '02/11/2023' },
          { id: 103, game: 'Pixel Runner', score: 8900, time: '03:20', date: '18/11/2023' }
        ];
      }
    }
  },
  methods: {
    async changeName() {
      const { value: newName } = await Swal.fire({
        title: this.$t('admin_dialog_usuario.swal.change_name_title'),
        input: 'text',
        inputValue: this.localUser.name,
        showCancelButton: true,
        confirmButtonText: this.$t('admin_dialog_usuario.swal.btn_update'),
        cancelButtonText: this.$t('admin_dialog_usuario.swal.btn_cancel'),
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#9e9e9e',
        reverseButtons: true,
        customClass: { popup: 'rounded-xl shadow-custom' }
      });

      if (newName && newName.trim() !== '') {
        this.localUser.name = newName.trim();
      }
    },
    async changeEmail() {
      const { value: newEmail } = await Swal.fire({
        title: this.$t('admin_dialog_usuario.swal.change_email_title'),
        input: 'email',
        inputValue: this.localUser.email,
        showCancelButton: true,
        confirmButtonText: this.$t('admin_dialog_usuario.swal.btn_update'),
        cancelButtonText: this.$t('admin_dialog_usuario.swal.btn_cancel'),
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#9e9e9e',
        reverseButtons: true,
        customClass: { popup: 'rounded-xl shadow-custom' }
      });

      if (newEmail && newEmail.trim() !== '') {
        this.localUser.email = newEmail.trim();
      }
    },
    save() {
      this.$emit('save', this.localUser);
      this.$emit('input', false);
    }
  }
}
</script>

<style scoped>
.btn-hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(16, 185, 129, 0.3) !important;
}

.action-btn-hover:hover {
  background-color: rgba(16, 185, 129, 0.05) !important;
}

/* Custom Table Styles */
::v-deep .custom-table > .v-data-table__wrapper > table > thead > tr > th {
  border-bottom: 2px solid #e2e8f0 !important;
  color: #64748b !important;
  letter-spacing: 0.5px;
}

::v-deep .custom-table > .v-data-table__wrapper > table > tbody > tr > td {
  border-bottom: 1px solid #f1f5f9 !important;
  color: #2c3e50;
  font-weight: 500;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

::v-deep .custom-table > .v-data-table__wrapper > table > tbody > tr {
  transition: background-color 0.2s ease;
}

::v-deep .custom-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: #f8fafc !important;
}
</style>