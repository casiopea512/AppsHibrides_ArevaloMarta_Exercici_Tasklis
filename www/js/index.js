document.addEventListener("DOMContentLoaded", function () {
    // Inicializar el acordeón de jQuery UI
    $("#accordion").accordion({ collapsible: true });

    var dialog, editDialog, form,
        taskName = $("#taskName"),
        taskDescription = $("#taskDescription"),
        allFields = $([]).add(taskName).add(taskDescription);

    // Función para cargar tareas desde localStorage
    function loadTasks() {
        var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        $("#accordion").empty(); // Limpiar el contenido actual del acordeón
        tasks.forEach(function (task) {
            var newHeader = $("<h3>" + task.name + "</h3>");
            var newContent = $(
                `<div>
                    <p>${task.description}</p>
                    <button class="edit-task">Edit</button>
                    <button class="delete-task">Delete</button>
                </div>`
            );
            $("#accordion").append(newHeader);
            $("#accordion").append(newContent);
        });
        $("#accordion").accordion("refresh");
    }

    // Función para guardar las tareas en localStorage
    function saveTasks() {
        var tasks = [];
        $("#accordion h3").each(function () {
            var header = $(this);
            var content = header.next("div");
            tasks.push({
                name: header.text(),
                description: content.find("p").text()
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Función para agregar una tarea
    function addTask() {
        var newHeader = $("<h3>" + taskName.val() + "</h3>");
        var newContent = $(
            `<div>
                <p>${taskDescription.val()}</p>
                <button class="edit-task">Edit</button>
                <button class="delete-task">Delete</button>
            </div>`
        );
        $("#accordion").append(newHeader);
        $("#accordion").append(newContent);
        $("#accordion").accordion("refresh");
        
        // Guardar en el localStorage
        saveTasks();

        dialog.dialog("close");
        return true;
    }

    // Función para eliminar una tarea
    function deleteTask(event) {
        var contentToDelete = $(this).parent();
        var headerToDelete = contentToDelete.prev("h3");
        headerToDelete.remove();
        contentToDelete.remove();

        // Guardar en el localStorage después de eliminar
        saveTasks();
        $("#accordion").accordion("refresh");
    }

    // Función para editar una tarea
    function editTask(event) {
        var contentToEdit = $(this).parent();
        var headerToEdit = contentToEdit.prev("h3");

        taskName.val(headerToEdit.text());
        taskDescription.val(contentToEdit.find("p").text());

        editDialog.dialog({
            buttons: {
                "Save Changes": function () {
                    headerToEdit.text(taskName.val());
                    contentToEdit.find("p").text(taskDescription.val());

                    // Guardar en el localStorage después de editar
                    saveTasks();

                    editDialog.dialog("close");
                },
                Cancel: function () {
                    editDialog.dialog("close");
                }
            }
        });

        editDialog.dialog("open");
    }

    // Inicializar el diálogo para agregar tareas
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
        },
        open: function () {
            // Limpiar los campos de entrada al abrir el diálogo
            taskName.val('');
            taskDescription.val('');
        }
    });

    // Inicializar el diálogo para editar tareas
    editDialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true
    });

    // Procesar el formulario al enviarlo
    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addTask();
    });

    // Abrir el formulario de tarea al hacer clic en el botón
    $("#create-task").button().on("click", function () {
        dialog.dialog("open");
    });

    // Eventos para editar y eliminar tareas
    $("#accordion").on("click", ".delete-task", deleteTask);
    $("#accordion").on("click", ".edit-task", editTask);

    // Cargar las tareas desde el localStorage al iniciar la página
    loadTasks();
});
