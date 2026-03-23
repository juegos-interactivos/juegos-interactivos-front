<template>
  <v-layout>
    <v-flex class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <h1>{{$t('welcome')}}</h1>
            <em>&mdash;John Johnson</em>
          </small>
          <br>
          <v-btn @click="mostrarAlerta">Probar Sweet Alert</v-btn>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
    mostrarAlerta() {
      this.$swal({
        // Título con texto en degradado y tipografía impactante
        title: '<span style="background: -webkit-linear-gradient(45deg, #00f2fe, #4facfe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.8em; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">¡Nacho, Modo Dios!</span>',
        
        // Inyectamos CSS puro para animar los botones y darle efecto cristal al modal + el contenido
        html: `
          <style>
            .swal2-popup.glass-popup {
              background: rgba(15, 23, 42, 0.9) !important;
              backdrop-filter: blur(10px) !important;
              border: 1px solid rgba(79, 172, 254, 0.3) !important;
              box-shadow: 0 0 50px rgba(79, 172, 254, 0.15) !important;
              border-radius: 24px !important;
              color: #fff !important;
            }
            .btn-neon-confirm {
              background: linear-gradient(45deg, #00f2fe, #4facfe) !important;
              border: none !important;
              border-radius: 50px !important;
              color: white !important;
              padding: 12px 35px !important;
              font-size: 1.1em !important;
              font-weight: bold !important;
              box-shadow: 0 8px 15px rgba(79, 172, 254, 0.4) !important;
              transition: all 0.3s ease !important;
              margin: 10px !important;
              cursor: pointer;
            }
            .btn-neon-confirm:hover {
              transform: translateY(-3px) scale(1.05) !important;
              box-shadow: 0 15px 25px rgba(79, 172, 254, 0.6) !important;
            }
            .btn-neon-cancel {
              background: transparent !important;
              border: 2px solid #4facfe !important;
              border-radius: 50px !important;
              color: #4facfe !important;
              padding: 10px 30px !important;
              font-size: 1em !important;
              font-weight: bold !important;
              transition: all 0.3s ease !important;
              margin: 10px !important;
              cursor: pointer;
            }
            .btn-neon-cancel:hover {
              background: rgba(79, 172, 254, 0.1) !important;
              transform: translateY(-2px) !important;
            }
          </style>

          <div style="margin-top: 10px;">
            <p style="font-size: 1.2em; color: #e2e8f0; margin-bottom: 20px;">
              El servidor te está llamando... 💻✨
            </p>
            <img src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif" style="border-radius: 15px; width: 100%; max-width: 280px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); margin-bottom: 15px;" alt="Coding cat" />
          </div>
        `,
        
        // Desactivamos los estilos aburridos de Sweet Alert para usar nuestro CSS
        buttonsStyling: false, 
        showCancelButton: true,
        confirmButtonText: '¡A picar código! 🚀',
        cancelButtonText: '5 minutitos más... ☕',
        
        // Asignamos las clases CSS que creamos arriba
        customClass: {
          popup: 'glass-popup',
          confirmButton: 'btn-neon-confirm',
          cancelButton: 'btn-neon-cancel'
        },
        
        // El backdrop (fondo detrás de la alerta) súper loco
        backdrop: `
          rgba(0, 0, 0, 0.85)
          url("https://sweetalert2.github.io/images/nyan-cat.gif")
          left top
          no-repeat
        `,
        padding: '2rem',
        width: '38rem',
        timer: 10000,
        timerProgressBar: true
      });
    }
  }
}
</script>