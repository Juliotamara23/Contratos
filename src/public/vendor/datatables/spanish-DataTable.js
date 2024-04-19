//Datatable sencilla que permite encabezados con rowspan
$(document).ready(function () {
    $('#dataTable').DataTable({
        columnDefs: [
            {
                targets: -1,
                className: 'dt[-head|-body]-center'
            }
          ],
        "dom": 'T<"clear">lfrtip',
        "tableTools": {
            "sRowSelect": "multi",
            "aButtons": [
                {
                    "sExtends": "select_none",
                    "sButtonText": "Borrar selección"
                }]
        },
        "pagingType": "simple_numbers",
        //Actualizo las etiquetas de mi tabla para mostrarlas en español
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por página.",
            "zeroRecords": "No se encontró registro.",
            "info": "  _START_ de _END_ (_TOTAL_ registros totales).",
    "infoEmpty": "0 de 0 de 0 registros",
        "infoFiltered": "(Encontrado de _MAX_ registros)",
"search": "Buscar: ",
    "processing": "Procesando la información",
        "paginate": {
    "first": " |< ",
        "previous": "Ant.",
            "next": "Sig.",
                "last": " >| "
}
        }
    });
} );