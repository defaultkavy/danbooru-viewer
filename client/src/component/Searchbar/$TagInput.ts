import { $Container } from "elexis";
import type { $Searchbar } from "./$Searchbar";
import { $Tag } from "./$Tag";

export class $TagInput extends $Container {
    $input = $('input').type('text')
    .spellcheck(false)
    .css({color: 'inherit', height: '100%', textOverflow: 'ellipsis', fontFamily: 'inherit', background: 'none', top: 0, left: 0,
        fontSize: 'inherit', lineHeight: 'inherit', padding: 'inherit', position: 'absolute', boxSizing: 'border-box', width: '100%',
        border: 'none', outline: 'none'
    });
    $sizer = $('span').class('sizer')
    .css({fontFamily: 'inherit', whiteSpace: 'pre', height: '1em', display: 'inline-block', fontSize: 'inherit', 
        lineHeight: 'inherit', boxSizing: 'border-box', position: 'relative', opacity: 0, minWidth: '2px', userSelect: 'none', 
        verticalAlign: 'top'});
    $inputor = $('div').class('input-wrapper')
    .css({color: 'var(--primary-color)', border: '1px solid var(--secondary-color-9)', borderRadius: 'var(--border-radius-small)',
        position: 'relative', boxSizing: 'border-box', lineHeight: '1em', fontSize: '14px', padding: '4px 8px', 
        display: 'inline-block', maxWidth: '100%', textOverflow: 'ellipsis'
    })
    .content([
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
        this.css({
            display: 'flex', gap: '0.4rem', width: '100%', height: '100%', overflow: 'hidden', 
            paddingInline: '0.4rem', boxSizing: 'border-box', cursor: 'text'})
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
        if (tagName.endsWith(':')) this.editTag($tag);
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