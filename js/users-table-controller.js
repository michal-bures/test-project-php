$(document).ready(function () {
    const elements = {
        usersTable: $('#users-table'),
        usersTableBody: $('#users-table > tbody'),
        addUserForm: $('#add-new-user-form')
    }
    const inputFields = {
        name: $('#group-name'),
        email: $('#group-email'),
        city: $('#group-city')
    }

    elements.addUserForm.submit(function (event) {
        const formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            city: $("#city").val()
        };

        $.ajax({
            type: "POST",
            url: "api/create.php",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(handleAddUserResult);
        event.preventDefault();
    });

    function handleAddUserResult(data) {
        renderValidationErrors(data.errors)
        //TODO render success/fail toast
        if (data.success) {
            elements.usersTable.children('tbody').append(RowTemplate(data.user))
            clearInputForm()
        }
    }

    function RowTemplate({ name, email, city }) {
        return `<tr>
            <td>${escapeHTML(name)}</td>
            <td>${escapeHTML(email)}</td>
            <td>${escapeHTML(city)}</td>
        </tr>`;
    }

    function renderValidationErrors(errors = {}) {
        Object.values(inputFields).forEach(f=> {
            f.removeClass('has-error')
            f.children('.help-block').text('')
        })

        for (const [fieldKey, errorMessage] of Object.entries(errors)) {
            const field = inputFields[fieldKey]
            if (field) {
                field.addClass('has-error')
                field.children('.help-block').text(errorMessage)
            } else {
                //TODO if there's no matching field render in toast
            }
        }
    }

    function escapeHTML(unsafeText) {
        let div = document.createElement('div');
        div.innerText = unsafeText;
        return div.innerHTML;
    }

    function clearInputForm() {
        elements.addUserForm.find('input').val('')
    }
});


