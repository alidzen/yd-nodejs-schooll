'use strict';
class Form {
    constructor(formId, buttonId, resultContainerId) {
        this.form = document.getElementById(formId);
        this.button = document.getElementById(buttonId);
        this.resultContainer = document.getElementById(resultContainerId);
        this.validateResult = { isValid: false, errorFields: [] };
        this.form.onsubmit = (event) => {
            event.preventDefault();
            this.submit();
        }
    }

    validate() {
        this.validateResult.errorFields = [];

        if (nameValidation.bind(this)('fio') === false) {
            this.validateResult.errorFields.push('fio');
        };
        if (emailValidation.bind(this)('email') === false) {
            this.validateResult.errorFields.push('email');
        };
        if (phoneValidation.bind(this)('phone') === false) {
            this.validateResult.errorFields.push('phone');
        };

        this.validateResult.isValid = this.validateResult.errorFields.length === 0 ? true : false;

        return this.validateResult;
    }

    getData() {
        return {
            fio: this.form.querySelector('input[name = "fio"]').value,
            email: this.form.querySelector('input[name = "email"]').value,
            phone: this.form.querySelector('input[name = "phone"]').value
        }
    }

    setData(data) {
        if (data !== null && typeof data === 'object') {
            this.form.querySelector('input[name = "fio"]').value = data.fio || '';
            this.form.querySelector('input[name = "email"]').value = data.email || '';
            this.form.querySelector('input[name = "phone"]').value = data.phone || '';
        }
    }

    submit() {
        if (this.validate().isValid === true) {
            sendRequest.bind(this)();
        }
    }
}

function nameValidation(fieldName) {
    const field = this.form.querySelector('input[name = ' + fieldName + ']');
    if (field === undefined || field === null) {
        console.log('Can\'t find input with name ' + fieldName);
        return false;
    }

    const nameValidationRegExp = /^([A-Za-zА-Яа-я]+\s[A-Za-zА-Яа-я]+\s[A-Za-zА-Яа-я]+)$/;
    return applyValidationToInput(nameValidationRegExp.test(field.value), field);
}

function emailValidation(fieldName) {
    const field = this.form.querySelector('input[name = ' + fieldName + ']');
    if (field === undefined || field === null) {
        console.log('Can\'t find input with name ' + fieldName);
        return false;
    }
    const emeilValidationRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))\@{1}(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com){1}$/i;
    return applyValidationToInput(emeilValidationRegExp.test(field.value), field);
}

function phoneValidation(fieldName) {
    const field = this.form.querySelector('input[name = ' + fieldName + ']');
    if (field === undefined || field === null) {
        console.log('Can\'t find input with name ' + fieldName);
        return false;
    }
    const phoneRegExp = /^[+][7]{1}[(][0-9]{3}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/;
    const numbersArr = field.value.match(/\d+/g);
    const isValid = phoneRegExp.test(field.value) && checkPhoneSumm(30, field.value.match(numberPattern)) === true;
    return applyValidationToInput(isValid, field);
}

function checkPhoneSumm(limit, numbersArr) {
    let summ = 0;
    const singleNumberArr = numbersArr.join('').split('');
    for (const number of singleNumberArr) {
        summ += +number;
    }
    return summ <= limit
}

function applyValidationToInput(isValid, field) {
    const errorClassName = 'error';

    if (isValid) {
        field.classList.remove(errorClassName);
    } else if (field.classList.contains(errorClassName)) {
        field.classList.add(errorClassName);
    }

    return isValid;
}

function sendRequest() {
    this.button.disabled = true;
    const dataUrl = 'https://api.github.com/repos/alidzen/yd-nodejs-schooll/contents/data/';
    let url = this.form.action || dataUrl + 'success.json'
    fetch(url, {
        method: 'GET'
    }).then(response => {
        response.json().then(json => {
            const resp = JSON.parse(atob(json.content));

            if (resp.status === 'success') {
                resultContainer.classList.add('success');
                resultContainer.innerHTML = 'Success';
                this.button.disabled = false;
            } else if (resp.status === 'error') {
                resultContainer.classList.add('error');
                resultContainer.innerHTML = resp.reason;
                this.button.disabled = false;
            } else if (resp.status === 'progress') {
                resultContainer.classList.add('progress');

                setInterval(() => {
                    this.sendRequest();
                }, resp.timeout);
            }
        });
    });
}

let MyForm;

window.onload = () => {
    MyForm = new Form('myForm', 'submitButton', 'resultContainer');
};