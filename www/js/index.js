document.addEventListener("DOMContentLoaded", function () {
    
    // Inicializar el acordeón
    $("#accordion").accordion({
        collapsible: true
    });
    
    var dialog, form,
        taskName = $("#taskName"),
        taskDescription = $("#taskDescription"),
        // array de los datos
        allFields = $([]).add(taskName).add(taskDescription);

    function addTask() {
        // Crear nuevo encabezado y contenido para el acordeón
        var newHeader = $("<h3>" + taskName.val() + "</h3>");
        var newContent = $(`
            <div>
                <p>${taskDescription.val()}</p>
                <button class="delete-task">Delete</button>
            </div>
        `);

        // Añadir el nuevo encabezado y contenido al acordeón
        $("#accordion").append(newHeader);
        $("#accordion").append(newContent);

        // Refrescar el acordeón
        $("#accordion").accordion("refresh");

        // Cerrar el diálogo
        dialog.dialog("close");
        return true;
    }

    // eliminar
    function deleteTask(event) {
        // Prevenir acción predeterminada
        // event.preventDefault();

        // Encontrar el contenido y el encabezado relacionados
        var contentToDelete = $(this).parent();
        var headerToDelete = contentToDelete.prev("h3");

        // Eliminar encabezado y contenido
        headerToDelete.remove();
        contentToDelete.remove();

        // Refrescar el acordeón
        $("#accordion").accordion("refresh");
    }


    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Add Task": addTask,
            Cancel: function () {
                dialog.dialog("close");
            }
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addTask();
    });

    $("#create-task").button().on("click", function () {
        dialog.dialog("open");
    });

     // Delegar el evento de clic para el botón "Delete"
    $("#accordion").on("click", ".delete-task", deleteTask);

    
});