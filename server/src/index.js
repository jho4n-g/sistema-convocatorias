import app from './app.js';
import { ConnectBD, CloseBD } from './config/bd-init.js';
import { DEFAULTS } from './const/env.js';
import transporter from './utils/validarCorreo.js';

const PORT = process.env.PORT ?? DEFAULTS.PORT;

let server;

async function startServer() {
  try {
    await ConnectBD();

    console.log('✅ Base de datos conectada correctamente');

    try {
      await transporter.verify();
      console.log('✅ Servidor SMTP conectado');
    } catch (smtpError) {
      console.error(
        '⚠️ El servidor iniciará sin correo SMTP:',
        smtpError.message,
      );
    }

    server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/`);
    });

    // opcional: manejar errores del server http
    server.on('error', (err) => {
      console.error('❌ Error del servidor HTTP:', err);
      process.exit(1);
    });
  } catch (e) {
    console.error('❌ Error al iniciar el servidor:', e);
    process.exit(1);
  }
}

// Apagado limpio
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT recibido. Cerrando...');
  try {
    if (server) await new Promise((res) => server.close(res));
    await CloseBD(); // cierra pool SQL
    console.log('✅ Conexión a PostgreSQL cerrada');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error al cerrar:', e);
    process.exit(1);
  }
});
startServer();
