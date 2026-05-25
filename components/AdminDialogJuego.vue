<template>
  <v-dialog :value="value" @input="$emit('input', $event)" max-width="800">
    <v-card class="rounded-xl pa-4" color="#e0e0e0" elevation="0">
      <v-card-title class="text-h5 font-weight-bold black--text mb-4">
        {{ $t('admin_dialog_juego.title') }} {{ localGame.name }}
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="8" class="d-flex flex-column justify-center pb-0">
            <span class="text-caption grey--text text--darken-2 mb-1">{{ $t('admin_dialog_juego.game_name') }}</span>
            <span class="text-h6 font-weight-bold black--text">{{ localGame.name }}</span>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-center">
            <v-switch
              v-model="localGame.visible"
              :label="$t('admin_dialog_juego.visible')"
              color="green"
              hide-details
              class="mt-0"
            ></v-switch>
          </v-col>
        </v-row>

        <h4 class="text-h6 font-weight-bold black--text mt-8 mb-4">{{ $t('admin_dialog_juego.scores_table') }}</h4>
        
        <v-data-table
          :headers="headers"
          :items="scores"
          class="transparent-table elevation-0"
          hide-default-footer
          disable-pagination
          style="background-color: transparent !important;"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon small @click="deleteScore(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="px-6 pb-4 pt-6">
        <v-spacer></v-spacer>
        <v-btn color="#757575" text class="font-weight-bold" @click="$emit('input', false)">
          {{ $t('admin_dialog_juego.close') }}
        </v-btn>
        <v-btn color="black" class="white--text font-weight-bold rounded-pill px-6" elevation="0" @click="save">
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
        { text: this.$t('admin_dialog_juego.headers.user'), value: 'user', class: 'font-weight-bold black--text' },
        { text: this.$t('admin_dialog_juego.headers.score'), value: 'score', class: 'font-weight-bold black--text' },
        { text: this.$t('admin_dialog_juego.headers.time'), value: 'time', class: 'font-weight-bold black--text' },
        { text: this.$t('admin_dialog_juego.headers.date'), value: 'date', class: 'font-weight-bold black--text' },
        { text: this.$t('admin_dialog_juego.headers.delete'), value: 'actions', sortable: false, class: 'font-weight-bold black--text', align: 'center' }
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
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#757575',
        confirmButtonText: this.$t('admin_dialog_juego.swal.btn_delete'),
        cancelButtonText: this.$t('admin_dialog_juego.swal.btn_cancel'),
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.scores.indexOf(scoreItem);
          this.scores.splice(index, 1);
          Swal.fire(
            this.$t('admin_dialog_juego.swal.deleted_title'),
            this.$t('admin_dialog_juego.swal.deleted_text'),
            'success'
          );
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