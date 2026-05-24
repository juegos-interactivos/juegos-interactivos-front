<template>
  <v-dialog :value="value" @input="$emit('input', $event)" max-width="800">
    <v-card class="rounded-xl pa-4" color="#e0e0e0" elevation="0">
      <v-card-title class="text-h5 font-weight-bold black--text mb-4">
        Opciones de Usuario: {{ localUser.nickname }}
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" class="d-flex flex-column justify-center pb-0">
            <span class="text-caption grey--text text--darken-2 mb-1">Nombre de usuario</span>
            <span class="text-h6 font-weight-bold black--text">{{ localUser.nickname }}</span>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex flex-column justify-center pb-0">
            <span class="text-caption grey--text text--darken-2 mb-1">Correo electrónico</span>
            <span class="text-h6 font-weight-bold black--text">{{ localUser.mail }}</span>
          </v-col>
        </v-row>

        <h4 class="text-h6 font-weight-bold black--text mt-8 mb-4">Puntuaciones del Usuario</h4>
        
        <v-data-table
          :headers="headers"
          :items="scores"
          class="transparent-table elevation-0"
          hide-default-footer
          disable-pagination
          style="background-color: transparent !important;"
        ></v-data-table>
      </v-card-text>

      <v-card-actions class="px-6 pb-4 pt-6 flex-wrap">
        <v-btn color="black" outlined class="font-weight-bold rounded-pill mr-2 mb-2" @click="changeName">
          Cambiar Nombre
        </v-btn>
        <v-btn color="black" outlined class="font-weight-bold rounded-pill mb-2" @click="changeEmail">
          Cambiar Email
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="#757575" text class="font-weight-bold mb-2" @click="$emit('input', false)">
          Cerrar
        </v-btn>
        <v-btn color="black" class="white--text font-weight-bold rounded-pill px-6 mb-2" elevation="0" @click="save">
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'AdminDialogUsuario',
  props: {
    value: Boolean,
    user: Object
  },
  data() {
    return {
      localUser: {},
      headers: [
        { text: 'JUEGO', value: 'game', class: 'font-weight-bold black--text' },
        { text: 'PUNTUACIÓN', value: 'score', class: 'font-weight-bold black--text' },
        { text: 'TIEMPO', value: 'time', class: 'font-weight-bold black--text' },
        { text: 'FECHA', value: 'date', class: 'font-weight-bold black--text' }
      ],
      scores: []
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
        title: 'Cambiar nombre',
        input: 'text',
        inputValue: this.localUser.nickname,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'black',
        cancelButtonColor: '#757575',
        reverseButtons: true
      });

      if (newName && newName.trim() !== '') {
        this.localUser.nickname = newName.trim();
      }
    },
    async changeEmail() {
      const { value: newEmail } = await Swal.fire({
        title: 'Cambiar email',
        input: 'email',
        inputValue: this.localUser.mail,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'black',
        cancelButtonColor: '#757575',
        reverseButtons: true
      });

      if (newEmail && newEmail.trim() !== '') {
        this.localUser.mail = newEmail.trim();
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
