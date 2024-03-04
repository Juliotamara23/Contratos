const jsonUrl = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';

// Función para obtener y filtrar datos de la ciudad desde una URL JSON usando promesas
const getDataCiudad = (jsonUrl) => {
  return new Promise((resolve, reject) => {
    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};

// Función para mostrar datos en el elemento select
const mostrarData = (ciudad) => {
  console.log(ciudad);
  let body = "<option value=''>Seleccione una ciudad</option>";
  for (let i = 0; i < ciudad.length; i++) {
    ciudad[i].ciudades.forEach((ciudadNombre) => {
      body += `<option>${ciudadNombre}</option>`;
    });
  };
  document.getElementById('ciudad').innerHTML = body;
};

// Llamar a la función para obtener y mostrar datos
getDataCiudad(jsonUrl)
  .then(ciudad => mostrarData(ciudad))
  .catch(error => console.log(error));
