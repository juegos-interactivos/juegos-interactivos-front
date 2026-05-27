<template>
  <v-dialog :value="value" @input="$emit('input', $event)" max-width="800">
    <v-card class="rounded-xl pa-4" color="white" elevation="0">
      <v-card-title class="text-h5 font-weight-bold mb-4 d-flex align-center" style="color: #2c3e50;">
        <v-icon color="#10b981" class="mr-3" large>mdi-gamepad-variant</v-icon>
        {{ $t('admin_dialog_juego.title') }} <span style="color: #10b981;" class="ml-2">{{ localGame.name }}</span>
      </v-card-title>
      
      <v-card-text>
        <v-sheet color="#f8fafc" class="pa-4 rounded-lg mb-6">
          <v-row>
            <v-col cols="12" sm="8" class="d-flex flex-column justify-center pb-0">
              <span class="text-caption font-weight-bold text-uppercase mb-1" style="color: #64748b;">{{ $t('admin_dialog_juego.game_name') }}</span>
              <span class="text-h6 font-weight-bold" style="color: #2c3e50;">{{ localGame.name }}</span>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center">
              <v-switch
                v-model="localGame.visible"
                :label="$t('admin_dialog_juego.visible')"
                color="#10b981"
                hide-details
                class="mt-0 font-weight-medium custom-switch"
              ></v-switch>
            </v-col>
          </v-row>
        </v-sheet>

        <h4 class="text-h6 font-weight-bold mt-8 mb-4 d-flex align-center" style="color: #2c3e50;">
          <v-icon left color="#64748b">mdi-format-list-numbered</v-icon>
          {{ $t('admin_dialog_juego.scores_table') }}
        </h4>
        
        <v-data-table
          :headers="headers"
          :items="scores"
          class="custom-table elevation-0"
          hide-default-footer
          disable-pagination
          style="background-color: transparent !important;"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon small class="transition-swing action-btn-hover" @click="deleteScore(item)">
              <v-icon color="#ef4444">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="px-6 pb-4 pt-6">
        <v-spacer></v-spacer>
        <v-btn text class="font-weight-bold transition-swing" color="#64748b" @click="$emit('input', false)">
          {{ $t('admin_dialog_juego.close') }}
        </v-btn>
        <v-btn color="#10b981" class="white--text font-weight-bold rounded-pill px-6 transition-swing btn-hover-shadow" elevation="2" @click="save">
          <v-icon left>mdi-content-save</v-icon>
          {{ $t('admin_dialog_juego.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'AdminDialogGame',
  props: {
    value: Boolean,
    game: Object
  },
  data() {
    return {
      localGame: {},
      scores: []
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t('admin_dialog_juego.headers.user'), value: 'user', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin_dialog_juego.headers.score'), value: 'score', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin_dialog_juego.headers.time'), value: 'time', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin_dialog_juego.headers.date'), value: 'date', class: 'text-caption font-weight-bold text-uppercase table-header-text' },
        { text: this.$t('admin_dialog_juego.headers.delete'), value: 'actions', sortable: false, class: 'text-caption font-weight-bold text-uppercase table-header-text', align: 'center' }
      ];
    }
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this.localGame = { ...this.game };
        this.scores = [
          { id: 201, user: 'NachoTrabaja', score: 4200, time: '11:30', date: '14/10/2023' },
          { id: 202, user: 'SpeedRunner', score: 5100, time: '09:15', date: '15/10/2023' },
          { id: 203, user: 'GamerPro99', score: 3800, time: '14:20', date: '16/10/2023' }
        ];
      }
    }
  },
  methods: {
    deleteScore(scoreItem) {
      Swal.fire({
        title: this.$t('admin_dialog_juego.swal.delete_score_title'),
        text: this.$t('admin_dialog_juego.swal.delete_score_text', { user: scoreItem.user }),
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#9e9e9e',
        confirmButtonText: this.$t('admin_dialog_juego.swal.btn_delete'),
        cancelButtonText: this.$t('admin_dialog_juego.swal.btn_cancel'),
        reverseButtons: true,
        customClass: { popup: 'rounded-xl shadow-custom' }
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.scores.indexOf(scoreItem);
          this.scores.splice(index, 1);
          Swal.fire({
            title: this.$t('admin_dialog_juego.swal.deleted_title'),
            text: this.$t('admin_dialog_juego.swal.deleted_text'),
            icon: 'success',
            confirmButtonColor: '#10b981',
            customClass: { popup: 'rounded-xl shadow-custom' }
          });
        }
      });
    },
    save() {
      this.$emit('save', this.localGame);
      this.$emit('input', false);
    }
  }
}
</script>

<style scoped>
::v-deep .custom-switch .v-label {
  color: #2c3e50 !important;
}

.btn-hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(16, 185, 129, 0.3) !important;
}

.action-btn-hover:hover {
  background-color: #fee2e2 !important;
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