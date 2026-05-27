export default {
  menu: {
    search: 'Search',
    home: 'Home',
    games: 'Games',
    profile: 'Profile',
    login: 'Login',
    admin: 'Admin Panel',
    lang_changed: 'Idioma actualizado'
  },
  index: {
    welcome_title: 'Welcome to G de Juegos',
    welcome_desc: 'Discover our collection of mini-games, break your own records, and compete to lead the leaderboards.',
    explore_btn: 'Explore Games',
    features: {
      play_now: {
        title: 'Play now',
        desc: 'Access a wide variety of quick and fun games without downloads or waiting times.'
      },
      compete: {
        title: 'Compete and win',
        desc: 'Push your own limits, level up your profile, and compete against other users on the global leaderboard.'
      },
      favorites: {
        title: 'Save your favorites',
        desc: 'Bookmark the games you like the most to always have them on hand and improve every day.'
      }
    }
  },
  juegos: {
    title: 'All games',
    added_favorite: 'Added to favorites',
    removed_favorite: 'Removed from favorites'
  },
  perfil: {
    nivel: 'Level',
    usuario_desde: 'User since',
    mejor_record: 'Best record',
    ajustes: 'Settings',
    menu: {
      cambiar_nombre: 'Change name',
      eliminar_record: 'Delete record',
      borrar_cuenta: 'Delete account'
    },
    ranking_title: 'Leaderboard',
    tabla: {
      juego: 'GAME',
      puesto: 'RANK',
      puntuacion: 'SCORE',
      tiempo: 'TIME'
    },
    swal: {
      borrar_titulo: 'Are you sure?',
      borrar_texto: 'This action will permanently delete your account.',
      btn_borrar: 'Delete',
      btn_cancelar: 'Cancel',
      borrado_titulo: 'Deleted!',
      borrado_texto: 'Your account has been successfully deleted.',
      change_name_title: 'Change name',
      btn_update: 'Update',
      name_updated: 'Name updated!',
      delete_record_title: 'Delete record?',
      delete_record_text: 'Your current record will be deleted.',
      btn_delete: 'Delete',
      record_deleted: 'Record deleted!'
    }
  },
  login: {
    title: 'Login',
    email_placeholder: 'Email address',
    password_placeholder: 'Password',
    btn_enter: 'Enter',
    no_account: "Don't have an account? Sign up"
  },
  register: {
    title: 'Sign Up',
    name_placeholder: 'Name',
    email_placeholder: 'Email address',
    password_placeholder: 'Password',
    confirm_password_placeholder: 'Confirm password',
    btn_create: 'Create',
    have_account: 'Already have an account? Login'
  },
  admin: {
    title: 'Administration Panel',
    tabs: {
      users: 'Users',
      games: 'Games'
    },
    users: {
      title: 'User Management',
      search: 'Search user',
      headers: {
        id: 'ID',
        name: 'NAME',
        email: 'EMAIL',
        level: 'LEVEL',
        status: 'STATUS',
        actions: 'ACTIONS'
      }
    },
    games: {
      title: 'Game Management',
      add_game: 'Add Game',
      headers: {
        id: 'ID',
        banner: 'BANNER',
        name: 'NAME',
        visibility: 'VISIBILITY',
        actions: 'ACTIONS'
      }
    },
    status: {
      activo: 'Active',
      baneado: 'Banned'
    },
    swal: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      success_title: 'Success!',
      ban: {
        title: 'Are you sure?',
        text_ban: 'You are about to ban the user {name}.',
        text_unban: 'You are about to unban the user {name}.',
        success_ban: 'The user has been successfully banned.',
        success_unban: 'The user has been successfully unbanned.'
      },
      delete_game: {
        title: 'Delete game?',
        text: 'You are about to permanently delete {name}.',
        confirm_btn: 'Delete',
        success_title: 'Deleted!',
        success_text: 'The game has been deleted.'
      }
    },
    toast: {
      user_updated: 'User updated',
      game_updated: 'Game updated'
    }
  },
  error: {
    page_not_found: 'Page not found (404)',
    other_error: 'An error occurred',
    home_page: 'Back to home'
  },
  admin_dialog_juego: {
    title: 'Game Options:',
    game_name: 'Game Name',
    visible: 'Visible',
    scores_table: 'Scoreboard',
    headers: {
      user: 'USER',
      score: 'SCORE',
      time: 'TIME',
      date: 'DATE',
      delete: 'DELETE'
    },
    close: 'Close',
    save: 'Save Changes',
    swal: {
      delete_score_title: 'Delete score?',
      delete_score_text: 'You are about to delete the score for {user}.',
      btn_delete: 'Delete',
      btn_cancel: 'Cancel',
      deleted_title: 'Deleted!',
      deleted_text: 'The score has been deleted.'
    }
  },
  admin_dialog_usuario: {
    title: 'User Options:',
    username_label: 'Username',
    email_label: 'Email address',
    scores_table: 'User Scores',
    btn_change_name: 'Change Name',
    btn_change_email: 'Change Email',
    close: 'Close',
    save: 'Save Changes',
    headers: {
      game: 'GAME',
      score: 'SCORE',
      time: 'TIME',
      date: 'DATE'
    },
    swal: {
      change_name_title: 'Change name',
      change_email_title: 'Change email',
      btn_update: 'Update',
      btn_cancel: 'Cancel'
    }
  }
}