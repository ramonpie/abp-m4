import GestorTareas from "./clases/GestorTareas.js";
import { cambiaModoPantalla, configuracionInicialPantalla, cambiarTamanoLetra } from './configuracion-usuario.js';


const gestorTareas = new GestorTareas();

const crearFilaTabla = (tarea) => {
    let { id, descripcion, estado, fechaCreacion, fechaTermino } = tarea;

    let estadoTexto = estado ? "Finalizado" : "Pendiente";
    
    let estiloBagde = estado ? "text-bg-success" : "text-bg-warning";
    
    //_---------------------------------------------------------------------
    const fechaInicio = fechaCreacion ? moment(fechaCreacion) : moment();
    const fechaInicioFormato = fechaInicio.format('DD-MM-YYYY');

    const fechaFin = fechaTermino ? moment(fechaTermino) : moment();
    
    const diferenciaDias =  fechaFin.diff(fechaInicio, 'days');
    //const diferenciaMes =  fechaFin.diff(fechaInicio, 'months');
    //const diferenciaAno =  fechaFin.diff(fechaInicio, 'years');
    
    let textoDuracion = diferenciaDias === 0 ? "Now" : `${diferenciaDias} dias`;
     
    //------------------------------------------------------------------------------
    
    return `
        <tr>
            <th scope="row">${id}</th>
            <td>${descripcion}</td>
            <td><span class="badge ${estiloBagde}">${estadoTexto}</span></td>
            <td>${fechaInicioFormato}</td>
            <td>${textoDuracion}</td>
            <td>
                <button class="btn btn-secondary bi bi-pencil-fill btn-editar-tarea" data-id="${id}"></button>
                <button class="btn btn-warning  btn-cambiar-estado" data-id="${id}">Cambiar Estado</button>
                <button class="btn btn-danger bi bi-trash btn-eliminar-tarea" data-id="${id}"></button>
            </td>
        </tr> `;
};

const mostrarStatusTareas = () => {
    document.getElementById("span-tareas-total").innerText = gestorTareas.cantidadTareas();
    document.getElementById("span-tareas-pendientes").innerText = gestorTareas.cantidadTareasPendientes();
    document.getElementById("span-tareas-finalizadas").innerText = gestorTareas.cantidadTareasFinalizadas();
    
 }


const actualizarTablaTareas = (tareas = []) => {
    mostrarStatusTareas();

    if (tareas.length == 0) {
        document.querySelector("#tabla-tareas").classList.add("d-none");
        document.querySelector("#mensaje-sin-tareas").classList.remove("d-none");
        return;
    }

    document.querySelector("#tabla-tareas").classList.remove("d-none");
    document.querySelector("#mensaje-sin-tareas").classList.add("d-none");

    let acumuladorFilas = "";
    for (const tarea of tareas) {
        acumuladorFilas += crearFilaTabla(tarea);
    }

    document.querySelector("#tabla-tareas tbody").innerHTML = acumuladorFilas;
};

const alternarBotonesCrearTarea = () => {
    const botonCrearTarea = document.getElementById("btn-crear-tarea");
    const botonCrearTareaSpinner = document.getElementById("btn-crear-tarea-spinner");

    botonCrearTarea.classList.toggle("d-none");
    botonCrearTareaSpinner.classList.toggle("d-none");
};


//EVENTO FOMULARIO PARA CREAR TAREAS

const formCrearTarea = document.getElementById("form-crear-tarea");

formCrearTarea.addEventListener("submit", (event) => {
    try {
        event.preventDefault();

        //OBTENER EL VALOR INGRESADO POR EL USUARIO EN EL INPUT CON NAME descripcion
        const dataForm = new FormData(formCrearTarea);
        let descripcion = dataForm.get("descripcion");

        const tarea = gestorTareas.crearTarea(descripcion);

        //ALTERNAR ENTRE MOSTRAR Y OCULTAR UN BOTÓN PARA EVITAR QUE EL USUARIO REALICE MÁS DE 1 CLIC
        alternarBotonesCrearTarea();

        setTimeout(async () => {
            alert(
                `Se ha creado correctamente la tarea: ${tarea.descripcion}.\nID: ${tarea.id}`,
            );

            const tareas = await gestorTareas.obtenerTareas();

            actualizarTablaTareas(tareas);

            //regreso botones a la normalidad
            alternarBotonesCrearTarea();

            //TERMINANDO DE CREAR EL FORMULARIO LIMPIAMOS EL INPUT
            formCrearTarea.reset();
        }, 1000);
    } catch (error) {
        console.log(error);
    }
});

//DELEGACIÓN EVENTO BOTONES EDITAR Y ELIMINAR TAREAS

document
  .querySelector("#tabla-tareas tbody")
  .addEventListener("click", async (event) => {
    const elemento = event.target;

    if (elemento.tagName != "BUTTON") return;

    const id = elemento.dataset.id;

    if (elemento.className.includes("btn-editar-tarea")) {
      //AQUÍ EDITAMOS LA DESCRIPCION CON FORMULARIO MODAL
           
      let tarea = gestorTareas.obtenerTareaPorId(id);
      const inputDescripcion = document.getElementById('input-descripcion');
      const inputId = document.getElementById('input-id');

      if (tarea.estado) {
         alert("Tarea no puede ser modificada por estar finalizada");
         return;
      } else {
            inputDescripcion.value = tarea.descripcion;
            inputId.value = tarea.id;
            modal.showModal();  //Abrir el modal
      }
      
    } else if (elemento.className.includes("btn-cambiar-estado")) {
      //AQUÍ EDITAMOS EL ESTADO
      let confirmacion = false;

      let tarea = gestorTareas.obtenerTareaPorId(id);

      if (tarea.estado) {
        confirmacion = confirm(
          "Está seguro de remover el estado finalizado y dejar tarea pendiente?",
        );
      } else {
        confirmacion = confirm("Está seguro de finalizar la tarea?");
      }

      if (confirmacion) {
        gestorTareas.cambiarEstadoTarea(id);
      }
    } else if (elemento.className.includes("btn-eliminar-tarea")) {
      //AQUÍ ELIMINAMOS LA TAREA

      let confirmacion = confirm(
        `Está seguro de eliminar la tarea con id: ${id}?`,
      );

      if (!confirmacion) return;

      let respuesta = gestorTareas.eliminarTarea(id);

      if (respuesta) {
        alert("Tarea eliminada correctamente");
      } else {
        alert("Error al intentar eliminar la tarea, vuelva a intentar...");
      }
    }

    // AL FINAL ACTUALIZAR LA TABLA DE TAREAS

    const tareas = await gestorTareas.obtenerTareas();
    actualizarTablaTareas(tareas);
});

//EVENTO DE CARGA INICIAL DE LA PÁGINA DESPUÉS DEL DOM
addEventListener("DOMContentLoaded", (event) => {
  setTimeout(async () => {
    try {
        const tareas = await gestorTareas.obtenerTareas();
        actualizarTablaTareas(tareas);
        document.getElementById("spinner-tabla-loader").classList.add("d-none");

        // CONFIGURACION INICIAL USUARIO ========
        configuracionInicialPantalla();
        cambiarTamanoLetra(0);
      
    } catch (error) {
        console.log(error);
    }
  }, 700);
});


//====== CONFIGURACION DE USUARIO: COLOR PANTALLA - TAMAÑO LETRAS (CON PERSISTENCIA) ========

//Configuracion Pantalla
const botonModo = document.getElementById('btn-modo');
botonModo.addEventListener('click', () => cambiaModoPantalla());

//Configuracion Letras
const btnAumentar = document.getElementById('btn-aumentar');
const btnDisminuir = document.getElementById('btn-disminuir');
btnAumentar.addEventListener('click', () => cambiarTamanoLetra(2));
btnDisminuir.addEventListener('click', () => cambiarTamanoLetra(-2));
 
//===========================================================================
const modal = document.getElementById('modal-tarea');
const btnCerrar = document.getElementById('btn-cerrar-modal');
const formTarea = document.getElementById('form-tarea');
const inputDescripcion = document.getElementById('input-descripcion');
const inputID = document.getElementById('input-id');

// FORMULARIO MODAL
// Cerrar el modal con el botón Cancelar
btnCerrar.addEventListener('click', () => {
    modal.close();
});

// Procesar los datos al presionar "Guardar"
formTarea.addEventListener('submit', async (e) => {
    let nuevaDescripcion = inputDescripcion.value;
    const IdExistente = inputID.value
    let confirmacion = false;

    nuevaDescripcion = nuevaDescripcion.trim();
        
    gestorTareas.cambiarDescripcionTarea(IdExistente, nuevaDescripcion);
    const tareas = await gestorTareas.obtenerTareas();
    actualizarTablaTareas(tareas);
           
    
    formTarea.reset(); // Limpia el input para la próxima vez
});

