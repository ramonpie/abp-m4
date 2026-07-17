class Tarea {
  constructor(descripcion) {
    this.id = crypto.randomUUID();    // Genera un ID único universal (UUID v4) usando la API crypto nativa del navegador
    this.descripcion = descripcion;
    this.estado = false;   // Estado por defecto en (False: incompleta / True:Finalizada)
    this.fechaCreacion = moment().format("YYYY-MM-DD");  // Fecha de creación formateada con Moment.js
    this.fechaTermino = null;   // Fecha de cierre de la tarea
    
  }
}

export default Tarea;

