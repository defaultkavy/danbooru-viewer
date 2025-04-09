import { $Container } from "elexis";
import type { $Searchbar } from "./$Searchbar";
import { $Tag } from "./$Tag";

export class $TagInput extends $Container {
    $input = $('input').type('text');
    $sizer = $('span').class('sizer');
    $inputor = $('div').class('input-wrapper').content([
        this.$sizer,
        this.$input
            .on('input', () => { 
                this.$sizer.content(this.$input.value());
            })
    ])
    tags = new Set<$Tag>();
    $seachbar: $Searchbar
    constructor($seachbar: $Searchbar) {
        super('tag-input');
        this.$seachbar = $seachbar;
    }

    input() {
        this.insert(this.$inputor);
        this.$input.focus();
        this.$seachbar.$selectionList.clearSelections();
        this.$seachbar.getSearchSuggestions();
        return this;
    }

    addTag(tagName?: string) {
        tagName = tagName ?? this.$input.value();
        if (!tagName.length) return this;
        const $tag = new $Tag(tagName);
        $tag.on('click', () => this.editTag($tag))
        this.tags.add($tag);
        this.value('');
        if (this.$input.inDOM()) this.$inputor.replace($tag);
        else this.insert($tag);
        return this;
    }

    editTag($tag: $Tag) {
        this.addTag();
        this.tags.delete($tag);
        $tag.replace(this.$inputor);
        this.value($tag.name);
        this.$input.focus();
        this.$seachbar.getSearchSuggestions();
        return this;
    }

    clearAll() {
        this.value('');
        this.tags.clear();
        this.clear();
        return this;
    }

    value(value?: string) {
        if (value === undefined) return this;
        this.$input.value(value);
        this.$sizer.content(value);
        return this;
    }

    focus() {
        this.$input.focus();
        return this;
    }

    get query() { return this.tags.array.map(tag => tag.name).toString().toLowerCase().replace(',', '+') }
}