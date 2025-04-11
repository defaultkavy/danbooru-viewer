import { $Container } from "elexis";

export class $Selection extends $Container {
    private property = {
        value: ''
    }
    constructor() {
        super('selection');
    }

    value(): string;
    value(value: string): this;
    value(value?: string) { return $.fluent(this, arguments, () => this.property.value, () => $.set(this.property, 'value', value))}

    focus() {
        this.addClass('active');
        return this;
    }

    blur() {
        this.removeClass('active');
        return this;
    }
}