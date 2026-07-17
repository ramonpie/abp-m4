export const getData = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();

  const tareas = data.map((tarea) => {
    const nuevaTarea = new Tarea(tarea.title);
    nuevaTarea.estado = tarea.completed;
    return nuevaTarea;
  });

  return tareas;
};
