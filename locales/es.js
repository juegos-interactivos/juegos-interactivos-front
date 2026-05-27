export default {
  menu: {
    search: 'Buscar',
    home: 'Inicio',
    games: 'Juegos',
    profile: 'Perfil',
    login: 'Inicia Sesión',
    admin: 'Panel de administración',
    lang_changed: 'Language updated'
  },
  index: {
    welcome_title: 'Bienvenido a G de Juegos',
    welcome_desc: 'Descubre nuestra colección de mini-juegos, rompe tus propios récords y compite para liderar los ránkings.',
    explore_btn: 'Explorar Juegos',
    features: {
      play_now: {
        title: 'Juega ya',
        desc: 'Accede a una gran variedad de juegos rápidos y divertidos sin necesidad de descargas ni tiempos de espera.'
      },
      compete: {
        title: 'Compite y gana',
        desc: 'Supera tus propios límites, sube de nivel en tu perfil y compite contra otros usuarios en el ránking global.'
      },
      favorites: {
        title: 'Guarda tus favoritos',
        desc: 'Marca los juegos que más te gusten para tenerlos siempre a mano y supérate cada día.'
      }
    }
  },
  juegos: {
    title: 'Todos los juegos',
    added_favorite: 'Añadido a favoritos',
    removed_favorite: 'Eliminado de favoritos'
  },
  perfil: {
    nivel: 'Nivel',
    usuario_desde: 'Usuario desde',
    mejor_record: 'Mejor record',
    ajustes: 'Ajustes',
    menu: {
      cambiar_nombre: 'Cambiar nombre',
      eliminar_record: 'Eliminar record',
      borrar_cuenta: 'Borrar cuenta'
    },
    ranking_title: 'Ranking',
    tabla: {
      juego: 'JUEGO',
      puesto: 'PUESTO',
      puntuacion: 'PUNTUACIÓN',
      tiempo: 'TIEMPO'
    },
    swal: {
      borrar_titulo: '¿Estás seguro?',
      borrar_texto: 'Esta acción eliminará tu cuenta permanentemente.',
      btn_borrar: 'Borrar',
      btn_cancelar: 'Cancelar',
      borrado_titulo: '¡Borrada!',
      borrado_texto: 'Tu cuenta ha sido eliminada correctamente.',
      change_name_title: 'Cambiar nombre',
      btn_update: 'Actualizar',
      name_updated: '¡Nombre actualizado!',
      delete_record_title: '¿Eliminar récord?',
      delete_record_text: 'Se eliminará tu récord actual.',
      btn_delete: 'Eliminar',
      record_deleted: '¡Récord eliminado!'
    }
  },
  login: {
    title: 'Iniciar Sesión',
    email_placeholder: 'Correo electrónico',
    password_placeholder: 'Contraseña',
    btn_enter: 'Entrar',
    no_account: '¿No tienes cuenta? Regístrate'
  },
  register: {
    title: 'Registrarse',
    name_placeholder: 'Nombre',
    email_placeholder: 'Correo electrónico',
    password_placeholder: 'Contraseña',
    confirm_password_placeholder: 'Confirmar contraseña',
    btn_create: 'Crear',
    have_account: '¿Ya tienes una cuenta? Inicia Sesión'
  },
  admin: {
    title: 'Panel de Administración',
    tabs: {
      users: 'Usuarios',
      games: 'Juegos'
    },
    users: {
      title: 'Gestión de Usuarios',
      search: 'Buscar usuario',
      headers: {
        id: 'ID',
        name: 'NOMBRE',
        email: 'EMAIL',
        level: 'NIVEL',
        status: 'ESTADO',
        actions: 'ACCIONES'
      }
    },
    games: {
      title: 'Gestión de Juegos',
      add_game: 'Añadir Juego',
      headers: {
        id: 'ID',
        banner: 'BANNER',
        name: 'NOMBRE',
        visibility: 'VISIBILIDAD',
        actions: 'ACCIONES'
      }
    },
    status: {
      activo: 'Activo',
      baneado: 'Baneado'
    },
    swal: {
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      success_title: '¡Éxito!',
      ban: {
        title: '¿Estás seguro?',
        text_ban: 'Vas a banear al usuario {name}.',
        text_unban: 'Vas a desbanear al usuario {name}.',
        success_ban: 'El usuario ha sido baneado correctamente.',
        success_unban: 'El usuario ha sido desbaneado correctamente.'
      },
      delete_game: {
        title: '¿Eliminar juego?',
        text: 'Vas a eliminar permanentemente {name}.',
        confirm_btn: 'Eliminar',
        success_title: '¡Eliminado!',
        success_text: 'El juego ha sido borrado.'
      }
    },
    toast: {
      user_updated: 'Usuario actualizado',
      game_updated: 'Juego actualizado'
    }
  },
  error: {
    page_not_found: 'Página no encontrada (404)',
    other_error: 'Ha ocurrido un error',
    home_page: 'Volver al inicio'
  },
  admin_dialog_juego: {
    title: 'Opciones de Juego:',
    game_name: 'Nombre del juego',
    visible: 'Visible',
    scores_table: 'Tabla de Puntuaciones',
    headers: {
      user: 'USUARIO',
      score: 'PUNTUACIÓN',
      time: 'TIEMPO',
      date: 'FECHA',
      delete: 'ELIMINAR'
    },
    close: 'Cerrar',
    save: 'Guardar Cambios',
    swal: {
      delete_score_title: '¿Borrar puntuación?',
      delete_score_text: 'Eliminarás la puntuación de {user}.',
      btn_delete: 'Borrar',
      btn_cancel: 'Cancelar',
      deleted_title: '¡Borrada!',
      deleted_text: 'La puntuación ha sido eliminada.'
    }
  },
  admin_dialog_usuario: {
    title: 'Opciones de Usuario:',
    username_label: 'Nombre de usuario',
    email_label: 'Correo electrónico',
    scores_table: 'Puntuaciones del Usuario',
    btn_change_name: 'Cambiar Nombre',
    btn_change_email: 'Cambiar Email',
    close: 'Cerrar',
    save: 'Guardar Cambios',
    headers: {
      game: 'JUEGO',
      score: 'PUNTUACIÓN',
      time: 'TIEMPO',
      date: 'FECHA'
    },
    swal: {
      change_name_title: 'Cambiar nombre',
      change_email_title: 'Cambiar email',
      btn_update: 'Actualizar',
      btn_cancel: 'Cancelar'
    }
  }
}