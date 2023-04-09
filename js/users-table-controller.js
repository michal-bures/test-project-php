const DOMTemplates = {
    usersRow: ({ name, email, city, phone }) => `<tr class="user-row new-row">
            <td>${escapeHTML(name)}</td>
            <td>${escapeHTML(email)}</td>
            <td class="city-cell">${escapeHTML(city)}</td>
            <td>${escapeHTML(phone)}</td>
        </tr>`,
    successMessage: (message) => `<span class="glyphicon glyphicon-ok" aria-hidden="true"></span class="text-success"> ${escapeHTML(message)}`,
    errorMessage: (error) => `<span class="glyphicon glyphicon-remove" aria-hidden="true"></span class="text-success"> ${escapeHTML(error)}`
}

window.addEventListener("DOMContentLoaded", () => {
    const dom = {
        usersTable: {
            body: document.querySelector('#users-table > tbody'),
            filterCityInput: document.getElementById('filter-city'),
            filterStatusRow: document.getElementById('filter-status-row'),
            filterStatusMessage: document.getElementById('filter-status-message'),
            resetFilterButton: document.getElementById('reset-filter-button')
        },
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
        userRows: () => document.querySelectorAll('tr.user-row')
    }
    const notifications = new Notifications(dom.addUserForm.formGroups.submit);

    dom.addUserForm.formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        submitForm(event)
            .then(handleAddUserResponse)
            .catch(handleAddUserError);
    });

    dom.usersTable.filterCityInput.addEventListener('input', (event) => {
        applyCityFilter(event.target.value);
    })

    dom.usersTable.resetFilterButton.addEventListener('click', () => {
        dom.usersTable.filterCityInput.value='';
        applyCityFilter('');
    })

    //controller is ready => enable the submit button
    dom.addUserForm.inputs.submit.disabled = false;

    function submitForm(event) {
        setFormState('submitting');

        const formData = new FormData(event.target);
        // the append statements below should not be necessary in theory, but somehow I couldn't get the FormData
        // to load from the form element automatically and I don't have enough time to investigate further,
        // so here goes
        formData.append('name', dom.addUserForm.inputs.name.value);
        formData.append('city', dom.addUserForm.inputs.city.value);
        formData.append('email', dom.addUserForm.inputs.email.value);
        formData.append('phone', dom.addUserForm.inputs.phone.value);

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
        const inputs = dom.addUserForm.inputs;
        switch (newState) {
            case 'submitting':
                notifications.hide();
                Object.values(inputs).forEach(input => input.disabled = true);
                inputs.submit.innerText = 'Adding...';
                break;
            case 'ready':
                Object.values(inputs).forEach(input => input.disabled = false);
                inputs.submit.innerText = 'ADD USER';
                break;
        }
    }

    function handleAddUserResponse(data) {
        renderValidationErrors(data.errors);
        if (data.success) {
            notifications.showSuccess('User added!');
            addUserRowToTable(data.user);
            clearInputForm();
        }
    }

    function handleAddUserError() {
        notifications.showError('Oops, something went wrong! Please check your network connection and try again.');
    }


    function addUserRowToTable(user) {
        dom.usersTable.body.insertAdjacentHTML('beforeend', DOMTemplates.usersRow(user));
    }

    function renderValidationErrors(errors = {}) {
        Object.values(dom.addUserForm.formGroups).forEach(formGroup=> {
            formGroup.classList.remove('has-error');
            formGroup.querySelector('.help-block').textContent='';
        })

        for (const [fieldKey, errorMessage] of Object.entries(errors)) {
            const formGroup = dom.addUserForm.formGroups[fieldKey];
            if (formGroup) {
                formGroup.classList.add('has-error');
                formGroup.querySelector('.help-block').textContent = errorMessage;
            } else {
                //backend errors that don't have a matching form group show up as error notifications
                notifications.showError(`${fieldKey}: ${errorMessage}`);
            }
        }
    }

    function clearInputForm() {
        dom.addUserForm.formElement.querySelectorAll('input').forEach(e => e.value ='');
    }

    function applyCityFilter(filterValue) {
        filterValue = filterValue.trim()
        let hiddenRows = 0
        dom.userRows().forEach(trElement => {
            const city = trElement.querySelector("td.city-cell").textContent;
            const matches = city.toLowerCase().includes(filterValue.toLowerCase());
            showElementIf(trElement, matches);
            if (!matches) ++hiddenRows;
        })

        showElementIf(dom.usersTable.filterStatusRow, hiddenRows>0);
        if (hiddenRows > 0) {
            dom.usersTable.filterStatusMessage.innerText = getHiddenRowsMessage(hiddenRows);
        }
    }
});

function showElementIf(element, condition) {
    if (condition) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

function escapeHTML(unsafeText) {
    const div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}

function getHiddenRowsMessage(n) {
    if (n === 1) {
        return "1 row is hidden by active filter.";
    } else {
        return `${n} rows are hidden by active filter.`;
    }
}

class Notifications {
    timer = undefined;
    formGroupElement = undefined;
    helpBlockElement = undefined;

    constructor(formGroupElement) {
        this.formGroupElement = formGroupElement;
        this.helpBlockElement = formGroupElement.querySelector('.help-block');
    }

    showError(message) {
        this.formGroupElement.classList.add('has-error');
        this.helpBlockElement.innerHTML = DOMTemplates.errorMessage(message);
        this.clearAutoHideTimer();
    }
    showSuccess(message) {
        this.formGroupElement.classList.add('has-success');
        this.helpBlockElement.innerHTML = DOMTemplates.successMessage(message);
        this.scheduleAutoHide();
    }
    hide() {
        this.helpBlockElement.innerHTML = '';
        this.formGroupElement.classList.remove('has-success', 'has-error');
    }
    clearAutoHideTimer() {
        if (this.timer) clearTimeout(this.timer);
    }
    scheduleAutoHide(delayMs = 5000) {
        this.clearAutoHideTimer();
        this.timer = setTimeout(() => this.hide(), delayMs);
    }
}
