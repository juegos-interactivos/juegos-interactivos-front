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
              v-model="searchUsuarios"
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
            :headers="headersUsuarios"
            :items="usuarios"
            :search="searchUsuarios"
            class="transparent-table"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.estado`]="{ item }">
              <v-chip
                :color="item.estado === 'Activo' ? 'green darken-1' : 'red darken-1'"
                text-color="white"
                small
                class="font-weight-bold"
              >
                {{ item.estado }}
              </v-chip>
            </template>
            <template v-slot:[`item.acciones`]="{ item }">
              <v-btn icon small class="mr-2" @click="abrirEditorUsuario(item)">
                <v-icon color="black">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="banearUsuario(item)">
                <v-icon :color="item.estado === 'Activo' ? 'red' : 'green'">
                  {{ item.estado === 'Activo' ? 'mdi-cancel' : 'mdi-check-circle' }}
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
            :headers="headersJuegos"
            :items="juegos"
            class="transparent-table"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.imagen`]="{ item }">
              <v-avatar size="40" rounded class="my-2">
                <v-img :src="obtenerImagen(item.imagen)" style="background-color: #757575;"></v-img>
              </v-avatar>
            </template>
            <template v-slot:[`item.visible`]="{ item }">
              <v-icon :color="item.visible ? 'green darken-1' : 'grey darken-2'">
                {{ item.visible ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
            <template v-slot:[`item.acciones`]="{ item }">
              <v-btn icon small class="mr-2" @click="abrirEditorJuego(item)">
                <v-icon color="black">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="eliminarJuego(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>

    <AdminDialogUsuario 
      v-model="dialogUsuario" 
      :usuario="usuarioSeleccionado" 
      @guardar="actualizarUsuario" 
    />

    <AdminDialogJuego 
      v-model="dialogJuego" 
      :juego="juegoSeleccionado" 
      @guardar="actualizarJuego" 
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
      searchUsuarios: '',
      dialogUsuario: false,
      dialogJuego: false,
      usuarioSeleccionado: {},
      juegoSeleccionado: {},
      
      headersUsuarios: [
        { text: 'ID', value: 'id', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'NOMBRE', value: 'nombre', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'EMAIL', value: 'email', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'NIVEL', value: 'nivel', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'ESTADO', value: 'estado', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'ACCIONES', value: 'acciones', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text text-right', align: 'right' }
      ],
      usuarios: [
        { id: 1, nombre: 'NachoTrabaja', email: 'nacho@ejemplo.com', nivel: 12, estado: 'Activo' },
        { id: 2, nombre: 'GamerPro99', email: 'gamerpro@ejemplo.com', nivel: 45, estado: 'Activo' },
        { id: 3, nombre: 'ToxicPlayer', email: 'toxic@ejemplo.com', nivel: 8, estado: 'Baneado' }
      ],
      
      headersJuegos: [
        { text: 'ID', value: 'id', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'BANNER', value: 'imagen', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'NOMBRE', value: 'nombre', class: 'text-subtitle-1 font-weight-bold black--text' },
        { text: 'VISIBILIDAD', value: 'visible', class: 'text-subtitle-1 font-weight-bold black--text text-center', align: 'center' },
        { text: 'ACCIONES', value: 'acciones', sortable: false, class: 'text-subtitle-1 font-weight-bold black--text text-right', align: 'right' }
      ],
      juegos: [
        { id: 1, nombre: 'Buscaminas Pro', imagen: 'buscaminas.jpeg', visible: true },
        { id: 2, nombre: 'Pokemon', imagen: 'pokemon.jpg', visible: true },
        { id: 3, nombre: 'Pixel Runner', imagen: 'pixel-runner.png', visible: false }
      ]
    }
  },
  methods: {
    obtenerImagen(nombreArchivo) {
      try {
        return require(`@/assets/banners/${nombreArchivo}`);
      } catch (e) {
        return null;
      }
    },
    abrirEditorUsuario(usuario) {
      this.usuarioSeleccionado = usuario;
      this.dialogUsuario = true;
    },
    actualizarUsuario(datosNuevos) {
      const index = this.usuarios.findIndex(u => u.id === datosNuevos.id);
      if (index !== -1) {
        this.$set(this.usuarios, index, datosNuevos);
      }
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Usuario actualizado', showConfirmButton: false, timer: 1500 });
    },
    banearUsuario(usuario) {
      const accion = usuario.estado === 'Activo' ? 'banear' : 'desbanear';
      const color = usuario.estado === 'Activo' ? '#d33' : '#4CAF50';
      
      Swal.fire({
        title: `¿Estás seguro?`,
        text: `Vas a ${accion} al usuario ${usuario.nombre}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: color,
        cancelButtonColor: '#757575',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          usuario.estado = usuario.estado === 'Activo' ? 'Baneado' : 'Activo';
          Swal.fire('¡Éxito!', `El usuario ha sido ${accion}do correctamente.`, 'success');
        }
      });
    },
    abrirEditorJuego(juego) {
      this.juegoSeleccionado = juego;
      this.dialogJuego = true;
    },
    actualizarJuego(datosNuevos) {
      const index = this.juegos.findIndex(j => j.id === datosNuevos.id);
      if (index !== -1) {
        this.$set(this.juegos, index, datosNuevos);
      }
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Juego actualizado', showConfirmButton: false, timer: 1500 });
    },
    eliminarJuego(juego) {
      Swal.fire({
        title: '¿Eliminar juego?',
        text: `Vas a eliminar permanentemente ${juego.nombre}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#757575',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.juegos.indexOf(juego);
          this.juegos.splice(index, 1);
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