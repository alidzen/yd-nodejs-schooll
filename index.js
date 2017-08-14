'use strict';

class Form {
    constructor(formId, buttonId, resultContainerId) {
        this.form = document.getElementById(formId);
        this.button = document.getElementById(buttonId);
        this.resultContainer = document.getElementById(resultContainerId);
        this.errorClassName = ' error';
        this.validateResult = { isValid: false, errorFields: [] };
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit();
        })
    }

    validate() {
        this.validateResult.errorFields = [];

        if (this.nameValidation('fio') === false) {
            this.validateResult.errorFields.push('fio');
        };
        if (this.emailValidation('email') === false) {
            this.validateResult.errorFields.push('email');
        };
        if (this.phoneValidation('phone') === false) {
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
            this.form.querySelector('input[name = "fio"]').value = data.fio;
            this.form.querySelector('input[name = "email"]').value = data.email;
            this.form.querySelector('input[name = "phone"]').value = data.phone;
        }
    }

    submit() {
        if (this.validate().isValid === true) {
            this.sendRequest();
        }
    }

    nameValidation(fieldName) {
        const field = this.form.querySelector('input[name = ' + fieldName + ']');
        if (field === undefined || field === null) {
            console.log('Can\'t find input with name ' + fieldName);
            return false;
        }

        const nameValidationRegExp = /^([A-Za-zА-Яа-я]+\s[A-Za-zА-Яа-я]+\s[A-Za-zА-Яа-я]+)$/;
        this.applyValidationToInput(nameValidationRegExp.test(field.value), field);
    }

    emailValidation(fieldName) {
        const field = this.form.querySelector('input[name = ' + fieldName + ']');
        if (field === undefined || field === null) {
            console.log('Can\'t find input with name ' + fieldName);
            return false;
        }
        const emeilValidationRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))\@{1}(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com){1}$/i;
        this.applyValidationToInput(emeilValidationRegExp.test(field.value), field);
    }

    phoneValidation(fieldName) {
        const field = this.form.querySelector('input[name = ' + fieldName + ']');
        if (field === undefined || field === null) {
            console.log('Can\'t find input with name ' + fieldName);
            return false;
        }
        const phoneRegExp = /^[+][0-9]{1}[(][0-9]{3}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/;
        const numberPattern = /\d+/g;
        const numbersArr = field.value.match(numberPattern);
        const isValid = phoneRegExp.test(field.value) && this.checkPhoneSumm(30, field.value.match(numberPattern)) === true;
        this.applyValidationToInput(isValid, field);
    }

    checkPhoneSumm(limit, numbersArr) {
        let summ = 0;
        const singleNumberArr = numbersArr.join('').split('');
        for (const number of singleNumberArr) {
            summ += +number;
        }
        return summ <= limit
    }

    applyValidationToInput(isValid, field) {
        if (isValid) {
            field.className = field.className.substring(0, field.className.indexOf(this.errorClassName));
        } else if (field.className.indexOf(this.errorClassName) === -1) {
            field.className += this.errorClassName;
        }

        return isValid;
    }

    // TO DO: this method not global
    sendRequest() {
        this.button.disabled = true;
        const formData = new FormData(this.form);
        const xhr = new XMLHttpRequest();
        let action = this.form.action || './success.json';
        xhr.open("POST", action, true);
        xhr.send(formData);
    }
}

const MyForm = new Form('myForm', 'submitButton', 'resultContainer');