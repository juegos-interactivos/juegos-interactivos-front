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

          <div class="text-h6 text-center mb-8">{{ perfil.nombre }}</div>
          <div class="text-body-1 mb-4">Nivel: {{ perfil.nivel }}</div>
          <div class="text-body-1 mb-4">Usuario desde: {{ perfil.fechaRegistro }}</div>
          <div class="text-body-1 mb-auto">Mejor record: {{ perfil.mejorRecord }}</div>

          <div class="text-center mt-8">
            <span class="caption" style="cursor: pointer;">Ajustes</span>
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
                  <tr v-for="(juego, i) in rankings" :key="i">
                    <td class="text-h6 font-weight-regular pt-4 pb-4">{{ juego.nombre }}</td>
                    <td class="text-h6 font-weight-regular pt-4 pb-4">{{ juego.puesto }}</td>
                    <td class="text-center text-h6 font-weight-regular pt-4 pb-4">{{ juego.puntuacion }}</td>
                    <td class="text-right text-h6 font-weight-regular pt-4 pb-4">{{ juego.tiempo }}</td>
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
export default {
  data() {
    return {
      perfil: {
        nombre: 'NachoTrabaja',
        nivel: 12,
        fechaRegistro: '12/05/2021',
        mejorRecord: '4200 (Buscaminas)'
      },
      rankings: [
        { nombre: 'Buscaminas', puesto: '140', puntuacion: '4200', tiempo: '11:30' },
        { nombre: 'Juego y', puesto: 'Puesto', puntuacion: 'Puntuación', tiempo: 'Tiempo' },
        { nombre: 'Juego z', puesto: 'Puesto', puntuacion: 'Puntuación', tiempo: 'Tiempo' }
      ]
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