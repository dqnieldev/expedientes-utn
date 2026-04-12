import app from "./app.js";
import { restaurarScheduler } from "./backups/scheduler.service.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  restaurarScheduler(); // Restaurar scheduler al iniciar el servidor
});