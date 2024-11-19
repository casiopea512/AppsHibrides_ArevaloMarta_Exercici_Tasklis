document.addEventListener("DOMContentLoaded", function () {
    $("#accordion").accordion({ collapsible: true });

    var dialog, editDialog, form,
        taskName = $("#taskName"),
        taskDescription = $("#taskDescription"),
        allFields = $([]).add(taskName).add(taskDescription);

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
        dialog.dialog("close");
        return true;
    }

    function deleteTask(event) {
        var contentToDelete = $(this).parent();
        var headerToDelete = contentToDelete.prev("h3");
        headerToDelete.remove();
        contentToDelete.remove();
        $("#accordion").accordion("refresh");
    }

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
                    editDialog.dialog("close");
                },
                Cancel: function () {
                    editDialog.dialog("close");
                }
            }
        });

        editDialog.dialog("open");
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

    editDialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addTask();
    });

    $("#create-task").button().on("click", function () {
        dialog.dialog("open");
    });

    $("#accordion").on("click", ".delete-task", deleteTask);
    $("#accordion").on("click", ".edit-task", editTask);
});
