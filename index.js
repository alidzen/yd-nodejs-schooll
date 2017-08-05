'use strict';

const form = document.getElementById('myForm');

class Form {
    constructor(form) {
        this.form = form;
        this.errorFields = [];
    }

    validate() {
        let isValid;
        this.errorFields = [];

        this.nameValidation('fio');
        this.emailValidation('email');
        this.phoneValidation('phone');
        console.log(this.errorFields);
    }

    nameValidation(fieldName) {
        const field = document.getElementsByName(fieldName)[0];

        if (field.value.split(' ').length !== 3) {
            this.errorFields.push(field);
        }
    }

    emailValidation(fieldName) {
        const field = document.getElementsByName(fieldName)[0];
        const emeilValidationRexExp = /^[\s.]?(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        const resolveDomainNames = 'ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com';

        if (!(emeilValidationRexExp.test(field.value)) || this.checkDomains(field.value, resolveDomainNames) === false) {
            this.errorFields.push(field);
        }
    }

    phoneValidation(fieldName) {
        const field = document.getElementsByName(fieldName)[0];
        const phoneRegExp = /^[+][0-9]{1}[(][0-9]{3}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/;
        const numberPattern = /\d+/g;
        const numbersArr = field.value.match(numberPattern);

        if (!(phoneRegExp.test(field.value)) || this.checkPhoneSumm(30, field.value.match(numberPattern)) === false) {
            this.errorFields.push(field);
        }
    }

    checkDomains(email, domains) {
        const domainsArr = domains.split(', ');
        for (let domain of domainsArr) {
            domain = '@' + domain;

            if (email.toLowerCase().indexOf(domain) > -1) {
                return true;
            }
        }

        return false;
    }

    checkPhoneSumm(limit, numbersArr) {
        let summ = 0;
        const singleNumberArr = numbersArr.join('').split('');
        for (const number of singleNumberArr) {
            summ += +number;
        }
        return summ <= limit
    }
}

const MyForm = new Form(form);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    MyForm.validate();
    console.log('submit')
})