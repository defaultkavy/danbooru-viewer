import { $Container } from "elexis";

export class $Tag extends $Container {
    name: string;
    constructor(name: string) {
        super('tag');
        this.name = name;
        this.build();
    }

    private build() {
        this
        .css({
            display: 'inline-block',
            padding: '0.2rem 0.4rem',
            backgroundColor: 'var(--secondary-color-4)',
            color: 'var(--secondary-color-9)',
            borderRadius: 'var(--border-radius-small)',
            cursor: 'pointer'            
        })
        .content(this.name)
    }
}