// Función para cargar el encabezado y el pie de página
function loadCommonElements() {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    // Cargar encabezado
    fetch('/partials/_header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar _header.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => header.innerHTML = html)
        .catch(error => console.error(error));

    // Cargar pie de página
    fetch('/partials/_footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar _footer.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => footer.innerHTML = html)
        .catch(error => console.error(error));
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', loadCommonElements);