import { $Container } from "elexis";

export class $IonIcon extends $Container {
    constructor() {
        super('ion-icon');
    }

    name(name: string) {
        this.attribute('name', name);
        return this;
    }

    size(size: 'small' | 'large') {
        this.attribute('size', size);
        return this;
    }

    disable(disable: boolean) {
        this.attribute('disable', disable);
        return this;
    }
    
    link(url: string, replace = false) {
        this.on('click', () => replace ? $.replace(url) : $.open(url));
        return this;
    }
}