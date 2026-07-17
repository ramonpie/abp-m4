import Tarea from "./Tarea.js";

const getData = async () => {
    let urlBase = location.origin;
    let urlJson = urlBase + "/tareas.json";
    const response = await response.JSON();

    console.log(data);
};

class GestorTareas {
    constructor() {
        this.tareas = [];
    }

    // [C] - CREATE: Añade una nueva tarea al array
    crearTarea(descripcion) {
        if (!descripcion || descripcion.trim() === "") {
            throw new Error("La descripción no puede estar vacía.");
        }
        const nuevaTarea = new Tarea(descripcion);
        this.tareas.push(nuevaTarea);

        this.#persistirTareas();
        return nuevaTarea;
    }

    // [R] - READ: Obtiene todas las tareas o una específica por ID
    obtenerTareas() {
        this.#leerTareasStorage();
        return this.tareas;
    }

    obtenerTareaPorId(id) {
        return this.tareas.find(tarea => tarea.id === id) || null;
    }
 // [U] - UPDATE: Modifica la descripción de una tarea
    cambiarDescripcionTarea(id, descripcion) {
        const tarea = this.obtenerTareaPorId(id);
        if (!tarea) {
            console.error(`Tarea con ID ${id} no encontrada.`);
            return false;
        }

        if (!descripcion || descripcion.trim() === "") {
            throw new Error("La descripción no puede estar vacía.");
        }

        tarea.descripcion = descripcion.trim();
        
        this.#persistirTareas();
        return tarea;
    }

    // [U] - UPDATE: Modifica el estado de una tarea
    cambiarEstadoTarea(id) {
        const tarea = this.obtenerTareaPorId(id);
        if (!tarea) {
            console.error(`Tarea con ID ${id} no encontrada.`);
            return false;
        }

        tarea.estado = !tarea.estado;
        if (tarea.estado) {
            tarea.fechaTermino = moment().format("YYYY-MM-DD");
        }else {
               tarea.fechaTermino = null; 
        }
        
        this.#persistirTareas();
        return tarea;
    }

    // [D] - DELETE: Elimina una tarea por su ID
    eliminarTarea(id) {
        const indice = this.tareas.findIndex(tarea => tarea.id === id);
        if (indice === -1) {
            console.error(`No se pudo eliminar: Tarea con ID ${id} no encontrada.`);
            return false;
        }
        
        // Elimina el elemento del array
        this.tareas.splice(indice, 1);

        this.#persistirTareas();
        return true;
    }

    cantidadTareas() {
      return this.tareas.length;
    }
    
    cantidadTareasPendientes() {
      const pendientes = this.tareas.filter(tarea => !tarea.estado);
      return pendientes.length;
    }
    
    cantidadTareasFinalizadas() {
      const finalizadas = this.tareas.filter(tarea => tarea.estado);
      return finalizadas.length;

    }

    //FUNCIONES PRIVADAS
    #persistirTareas() {
      //CREAMOS PERSISTENCIA EN LOCALSTORAGE - ALMACENAMOS EN EL LOCALSTORAGE
      localStorage.setItem("tareas", JSON.stringify(this.tareas));

    }

    async #leerTareasStorage() {
        //OBTENEMOS LAS TAREAS ALMACENADAS EN EL LOCAL STORAGE
        const tareas = localStorage.getItem("tareas");

        if (tareas) {
            this.tareas = JSON.parse(tareas);
        } else {
            this.tareas = await getData();
        }

        return;
    }

}

export default GestorTareas;