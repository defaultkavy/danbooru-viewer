import { $Button, type $ContainerContentBuilder } from "elexis";

export class $IconButton extends $Button {
    $icon = $('ion-icon');
    $label = $('span');
    constructor() {
        super();
        this.addStaticClass('icon')
        this.build();
    }

    private build() {
        super.content([
            this.$icon.hide(true),
            this.$label
        ])
    }

    content(children: $ContainerContentBuilder<typeof this.$label>): this {
        this.$label.content(children);
        return this;
    }

    icon(name: string) {
        this.$icon.name(name).hide(false);
        return this;
    }

    link(url: string, replace = false) {
        this.on('click', () => replace ? $.replace(url) : $.open(url));
        return this;
    }
}