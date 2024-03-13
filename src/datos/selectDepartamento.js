const jsonUrl = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';

// Función para obtener y filtrar datos de la departamento desde una URL JSON usando promesas
const getDataDepartamento = (jsonUrl) => {
  return new Promise((resolve, reject) => {
    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};

// Función para mostrar datos en el elemento select
function mostrarData(departamentos) {
  let body = "";
  for (let i = 0; i < departamentos.length; i++) {
    // Verificar si departamentos[i].departamento es un array
    if (Array.isArray(departamentos[i].departamento)) {
      departamentos[i].departamento.forEach((departamentoNombre) => {
        body += `<option>${departamentoNombre}</option>`;
      });
    } else {
      // Si no es un array, agregar el valor directamente
      body += `<option>${departamentos[i].departamento}</option>`;
    }
  }
  document.getElementById('departamento').innerHTML += body;
}

// Llamar a la función para obtener y mostrar datos
getDataDepartamento(jsonUrl)
  .then(departamentos => mostrarData(departamentos))
  .catch(error => console.log(error));
