//MODULO DE CONFIGURACION DEL USUARIO DE COLOR PANTALLA Y TAMAÑO LETRAS


//Configuracion INICIAL Pantalla
export const configuracionInicialPantalla = () => {
    //OBTENEMOS LAS TAREAS ALMACENADAS EN EL LOCAL STORAGE
    const modoPantalla = localStorage.getItem("modoPantallaUsuario");
          
    if (modoPantalla === 'dark-mode') {
           document.body.classList.add("dark-mode");
       
    } 
}

//Cambia color Pantalla - con persistencia
export function cambiaModoPantalla() {
  // Pone la clase si no está, o la quita si ya existe
  document.body.classList.toggle('dark-mode');
  const modoUsuario = document.body.className;
  
   // Guardamos configuracion en LocalStorage (Persistencia) 
   localStorage.setItem("modoPantallaUsuario", modoUsuario);
}

//Cambia tamaño Letras
export function cambiarTamanoLetra(incremento) {

  let fontSizeUsuario = localStorage.getItem("fontSizeUsuario");
  
  fontSizeUsuario = Number(fontSizeUsuario);
  fontSizeUsuario = fontSizeUsuario + incremento;
  //console.log("FontSize:", fontSizeUsuario);

  // Guardamos configuracion en LocalStorage (Persistencia) 
  localStorage.setItem("fontSizeUsuario", fontSizeUsuario);

  // 1. Obtenemos el tamaño de fuente actual en píxeles (ej: "16px")
  const tamanoActualString = window.getComputedStyle(document.body).fontSize;
  
  // 2. Convertimos el texto a un número entero (ej: 16)
  const tamanoActualNum = parseInt(tamanoActualString);
  let nuevoTamano = 0;

  // 3. Calculamos el nuevo tamaño sumando o restando
  if ( incremento === 0) {
    nuevoTamano = tamanoActualNum + fontSizeUsuario;
  }else {
    nuevoTamano = tamanoActualNum + incremento;
  };
  //console.log("nuevoTamano:", nuevoTamano);

  // 4. Aplicamos el nuevo tamaño al body
  document.body.style.fontSize = nuevoTamano + 'px';
}


// Función para cambiar el tamaño de fuente de todos los elementos del body - con persistencia
function cambiarTamanoLetra2(incremento) {
  let fontSizeUsuario = localStorage.getItem("fontSizeUsuario");
  console.log("Font:", Number(fontSizeUsuario));
  fontSizeUsuario = Number(fontSizeUsuario)

  if (fontSizeUsuario != 0) {
    fontSizeUsuario = fontSizeUsuario + incremento;
  } else { 
    fontSizeUsuario = incremento;
  }
  // Guardamos configuracion en LocalStorage (Persistencia) 
  localStorage.setItem("fontSizeUsuario", fontSizeUsuario);
  
    // Seleccionamos TODOS los elementos de la página
  const todosLosElementos = document.querySelectorAll('*');
  
  todosLosElementos.forEach(elemento => {
    // Saltamos los botones de control para que no cambien de tamaño ellos mismos
    if (elemento.id === 'btn-aumentar' || elemento.id === 'btn-disminuir' || elemento.id === 'btn-modo') return;
    
    const tamanoActualString = window.getComputedStyle(elemento).fontSize;
    const tamanoActualNum = parseInt(tamanoActualString);
    const nuevoTamano = tamanoActualNum + incremento;
    console.log(incremento);    
    elemento.style.fontSize = nuevoTamano + 'px';
  });
}

