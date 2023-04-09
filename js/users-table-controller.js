const DOMTemplates = {
    usersRow: ({ name, email, city, phone }) => `<tr class="new-row">
            <td>${escapeHTML(name)}</td>
            <td>${escapeHTML(email)}</td>
            <td>${escapeHTML(city)}</td>
            <td>${escapeHTML(phone)}</td>
        </tr>`,
    successMessage: (message) => `<span class="glyphicon glyphicon-ok" aria-hidden="true"></span class="text-success"> ${escapeHTML(message)}`,
    errorMessage: (error) => `<span class="glyphicon glyphicon-remove" aria-hidden="true"></span class="text-success"> ${escapeHTML(error)}`
}

addEventListener("DOMContentLoaded", () => {
    const dom = {
        usersTableBody: document.querySelector('#users-table > tbody'),
        addUserForm: {
            formElement: document.getElementById('add-new-user-form'),
            formGroups: {
                name: document.getElementById('group-name'),
                email: document.getElementById('group-email'),
                city: document.getElementById('group-city'),
                phone: document.getElementById('group-phone'),
                submit: document.getElementById('group-submit'),
            },
            inputs: {
                name: document.getElementById('name'),
                email: document.getElementById('email'),
                city: document.getElementById('city'),
                phone: document.getElementById('phone'),
                submit: document.getElementById('submit-button'),
            }
        },
    }
    const notifications = new Notifications(dom.addUserForm.formGroups.submit)

    dom.addUserForm.formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        submitForm(event)
            .then(handleAddUserResponse)
            .catch(handleAddUserError)
    });
    //controller is ready => enable the submit button
    dom.addUserForm.inputs.submit.disabled = false

    function submitForm(event) {
        setFormState('submitting')

        const formData = new FormData(event.target)
        // the append statements below should not be necessary in theory, but somehow I couldn't get the FormData
        // to load from the form element automatically and I don't have enough time to investigate further,
        // so here goes
        formData.append('name', dom.addUserForm.inputs.name.value)
        formData.append('city', dom.addUserForm.inputs.city.value)
        formData.append('email', dom.addUserForm.inputs.email.value)
        formData.append('phone', dom.addUserForm.inputs.phone.value)

        return fetch(
            "api/create.php", {
                method: "POST",
                body: formData
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        }).finally(() => setFormState('ready'));
    }

    function setFormState(newState) {
        const inputs = dom.addUserForm.inputs
        switch (newState) {
            case 'submitting':
                notifications.hide()
                Object.values(inputs).forEach(input => input.disabled = true)
                inputs.submit.innerText = 'Adding...'
                break;
            case 'ready':
                Object.values(inputs).forEach(input => input.disabled = false)
                inputs.submit.innerText = 'ADD USER'
                break;
        }
    }

    function handleAddUserResponse(data) {
        renderValidationErrors(data.errors)
        if (data.success) {
            notifications.showSuccess('User added!')
            addUserRowToTable(data.user)
            clearInputForm()
        }
    }

    function handleAddUserError() {
        notifications.showError('Oops, something went wrong! Please check your network connection and try again.')
    }


    function addUserRowToTable(user) {
        dom.usersTableBody.insertAdjacentHTML('beforeend', DOMTemplates.usersRow(user))
    }

    function renderValidationErrors(errors = {}) {
        Object.values(dom.addUserForm.formGroups).forEach(formGroup=> {
            formGroup.classList.remove('has-error')
            formGroup.querySelector('.help-block').textContent=''
        })

        for (const [fieldKey, errorMessage] of Object.entries(errors)) {
            const formGroup = dom.addUserForm.formGroups[fieldKey]
            if (formGroup) {
                formGroup.classList.add('has-error')
                formGroup.querySelector('.help-block').textContent = errorMessage
            } else {
                //backend errors that don't have a matching form group show up as error notifications
                notifications.showError(`${fieldKey}: ${errorMessage}`)
            }
        }
    }

    function clearInputForm() {
        dom.addUserForm.formElement.querySelectorAll('input').forEach(e => e.value ='')
    }
});

function escapeHTML(unsafeText) {
    const div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}

class Notifications {
    timer = undefined
    formGroupElement = undefined
    helpBlockElement = undefined

    constructor(formGroupElement) {
        this.formGroupElement = formGroupElement
        this.helpBlockElement = formGroupElement.querySelector('.help-block')
    }

    showError(message) {
        this.formGroupElement.classList.add('has-error')
        this.helpBlockElement.innerHTML = DOMTemplates.errorMessage(message)
        this.clearAutoHideTimer()
    }
    showSuccess(message) {
        this.formGroupElement.classList.add('has-success')
        this.helpBlockElement.innerHTML = DOMTemplates.successMessage(message)
        this.scheduleAutoHide()
    }
    hide() {
        this.helpBlockElement.innerHTML = ''
        this.formGroupElement.classList.remove('has-success', 'has-error')
    }
    clearAutoHideTimer() {
        if (this.timer) clearTimeout(this.timer)
    }
    scheduleAutoHide(delayMs = 5000) {
        this.clearAutoHideTimer()
        this.timer = setTimeout(() => this.hide(), delayMs)
    }
}
