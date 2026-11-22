export function getRadarErrorGuidance(message: string): string {
  if (message.toLocaleLowerCase("es-AR").includes("limitó temporalmente")) {
    return "INDEC aplicó un límite temporal a las consultas. Esperá unos minutos y usá «Actualizar datos» una sola vez. Evitá repetir consultas seguidas.";
  }
  return "La conexión con la fuente oficial no está disponible en este momento. Si administrás el sitio, revisá la configuración del servidor.";
}
