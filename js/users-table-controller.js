const DOMTemplates = {
    usersRow: ({ name, email, city, phone }) => `<tr>
            <td>${escapeHTML(name)}</td>
            <td>${escapeHTML(email)}</td>
            <td>${escapeHTML(city)}</td>
            <td>${escapeHTML(phone)}</td>
        </tr>`,
    successMessage: (message) => `<span class="glyphicon glyphicon-ok" aria-hidden="true"></span class="text-success"> ${escapeHTML(message)}`,
    errorMessage: (error) => `<span class="glyphicon glyphicon-remove" aria-hidden="true"></span class="text-success"> ${escapeHTML(error)}`
}

$(document).ready(function () {
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
        submitForm()
            .then(handleAddUserRequestSuccess)
            .catch(handleAddUserRequestError)
    });

    function submitForm() {
        const { inputs } = dom.addUserForm;
        const formData = {
            name: inputs.name.value,
            email: inputs.email.value,
            city: inputs.city.value,
            phone: inputs.phone.value
        };
        setFormState('submitting')

        return fetch(
            "api/create.php", {
                method: "post",
                body: JSON.stringify(formData)
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
                inputs.submit.innerText = 'Adding user...'
                break;
            case 'ready':
                Object.values(inputs).forEach(input => input.disabled = false)
                inputs.submit.innerText = 'Add user'
                break;
        }
    }

    function handleAddUserRequestSuccess(data) {
        console.log('SUCCESS', data)
        renderValidationErrors(data.errors)
        if (data.success) {
            notifications.showSuccess('User added!')
            addUserRowToTable(data.user)
            clearInputForm()
        }
    }

    function handleAddUserRequestError(error) {
        notifications.showError('Oops, something went wrong! Please check your network connection and try again.')
    }


    function addUserRowToTable(user) {
        dom.usersTableBody.append(DOMTemplates.usersRow(user))
    }

    function renderValidationErrors(errors = {}) {
        Object.values(dom.addUserForm.formGroups).forEach(formGroup=> {
            formGroup.classList.remove('has-error')
            formGroup.querySelector('.help-block').textContet=''
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

const MESSAGE_COOLDOWN_IN_MS = 5000
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
    scheduleAutoHide(delayMs = MESSAGE_COOLDOWN_IN_MS) {
        this.clearAutoHideTimer()
        this.timer = setTimeout(() => this.hide(), delayMs)
    }
}
