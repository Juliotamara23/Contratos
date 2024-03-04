// Función para cargar los roles en el select
function cargarRoles() {
    fetch('/rol')
        .then(response => response.json())
        .then(data => mostrarData(data))
        .catch(error => console.error('Error al cargar los roles:', error));
}

// Función para mostrar datos en el elemento select
function mostrarData(rol) {
    let select = document.getElementById('rol');
    select.innerHTML = "<option value=''>Seleccione un cargo</option>";

    rol.forEach(rol => {
        select.innerHTML += `<option>${rol.rol_nombre}</option>`;
    });
}

// Llamar a la función al cargar la página
cargarRoles();