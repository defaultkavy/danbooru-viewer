import { $Container, type $StateArgument } from "elexis";

export class $Selection extends $Container {
    private property = {
        value: [] as string[]
    }
    constructor() {
        super('selection');
        this.css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            gap: '1rem',
            '&:hover': {
                backgroundColor: 'color-mix(in srgb, var(--secondary-color-3) 50%, transparent)',
            },
            '&.active': {
                backgroundColor: 'var(--secondary-color-3)'
            },
            '$.selection-label': {display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}
        })
    }

    value(): string[];
    value(value: string[]): this;
    value(value?: string[]) { return $.fluent(this, arguments, () => this.property.value, () => $.set(this.property, 'value', value))}

    focus() {
        this.addClass('active');
        return this;
    }

    blur() {
        this.removeClass('active');
        return this;
    }
}