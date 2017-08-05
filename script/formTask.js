'use string';

export class Task {
    constructor(form) {
        this.form = form;
    }

    validate() {
        console.log(this.form);
    }
}