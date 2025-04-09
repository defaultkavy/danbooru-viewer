import { $Container } from "elexis";

export class $Tag extends $Container {
    name: string;
    constructor(name: string) {
        super('tag');
        this.name = name;
        this.build();
    }

    private build() {
        this.content(this.name)
    }
}