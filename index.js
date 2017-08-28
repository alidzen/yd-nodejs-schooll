'use strict';

class Form {
    constructor(formId, buttonId, resultContainerId) {
        this.form = document.getElementById(formId);
        this.button = document.getElementById(buttonId);
        this.resultContainer = document.getElementById(resultContainerId);
        this.validateResult = {isValid: false, errorFields: []};
        this.form.onsubmit = (event) => {
            event.preventDefault();
            this.submit();
        }
    }

    validate() {
        this.validateResult.errorFields = [];

        if (nameValidation.call(this, 'fio') === false) {
            this.validateResult.errorFields.push('fio');
        }
        if (emailValidation.call(this, 'email') === false) {
            this.validateResult.errorFields.push('email');
        }
        if (phoneValidation.call(this, 'phone') === false) {
            this.validateResult.errorFields.push('phone');
        }

        this.validateResult.isValid = this.validateResult.errorFields.length === 0;

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
            sendRequest.call(this);
        }
    }
}

function nameValidation(fieldName) {
    const field = this.form.querySelector('input[name = ' + fieldName + ']');
    if (field === undefined || field === null) {
        console.error('Can\'t find input with name ' + fieldName);
        return false;
    }

    const nameValidationRegExp = /^([A-Za-zА-Яа-я]+\s\s*[A-Za-zА-Яа-я]+\s\s*[A-Za-zА-Яа-я]+\s*)$/;
    return applyValidationToInput(nameValidationRegExp.test(field.value), field);
}

function emailValidation(fieldName) {
    const field = this.form.querySelector('input[name = ' + fieldName + ']');
    if (field === undefined || field === null) {
        console.error('Can\'t find input with name ' + fieldName);
        return false;
    }
    const emailValidationRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))\@{1}(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com){1}$/i;
    return applyValidationToInput(emailValidationRegExp.test(field.value), field);
}

function phoneValidation(fieldName) {
    const field = this.form.querySelector('input[name = ' + fieldName + ']');
    if (field === undefined || field === null) {
        console.error('Can\'t find input with name ' + fieldName);
        return false;
    }
    const phoneRegExp = /^[+][7]{1}[(][0-9]{3}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/;
    const isValid = phoneRegExp.test(field.value) && checkPhoneSumm(30, field.value.match(/\d+/g)) === true;
    return applyValidationToInput(isValid, field);
}

function checkPhoneSumm(limit, numbersArr) {
    let summ = 0;
    const singleNumberArr = numbersArr.join('').split('');
    for (const number of singleNumberArr) {
        summ += parseInt(number);
    }
    return summ <= limit
}

function applyValidationToInput(isValid, field) {
    const errorClassName = 'error';

    if (isValid) {
        field.classList.remove(errorClassName);
    } else {
        field.classList.add(errorClassName);
    }

    return isValid;
}

function sendRequest() {
    const dataUrl = 'https://api.github.com/repos/alidzen/yd-nodejs-schooll/contents/data/';
    let url = this.form.action || dataUrl + 'success.json';
    this.button.disabled = true;
    this.resultContainer.className = 'container button';
    this.resultContainer.innerHTML = '';
    if (this.timerId) {
        clearInterval(this.timerId);
    }
    fetch(url, {
        method: 'GET'
    }).then(response => {
        response.json().then(json => {
            let resp = {};
            if (json.content !== undefined) {
                resp = JSON.parse(atob(json.content));
            } else {
                resp.status = 'progress';
                resp.timeout = 5000;
            }

            if (resp.status === 'success') {
                this.resultContainer.classList.add('success');
                this.resultContainer.innerHTML = 'Success';
                this.button.disabled = false;
            } else if (resp.status === 'error') {
                this.resultContainer.classList.add('error');
                this.resultContainer.innerHTML = resp.reason;
                this.button.disabled = false;
            } else if (resp.status === 'progress') {
                this.resultContainer.classList.add('progress');

                this.timerId = setInterval(() => {
                    this.submit();
                }, resp.timeout);
            }
        });
    });
}

let MyForm;

window.onload = () => {
    MyForm = new Form('myForm', 'submitButton', 'resultContainer');
};
