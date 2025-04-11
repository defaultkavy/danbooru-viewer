import { $Container } from "elexis";
import { Tag, TagCategory } from "../../structure/Tag";
import { Booru } from "../../structure/Booru";
import { Autocomplete } from "../../structure/Autocomplete";
import { numberFormat } from "../../structure/Util";
import { $TagInput } from "./$TagInput";
import { $SelectionList } from "./$SelectionList";
import { $Selection } from "./$Selection";
import type { $Tag } from "./$Tag";

export class $Searchbar extends $Container {
    static $ele = new this().hide(true);
    $tagInput = new $TagInput(this);
    $selectionList = new $SelectionList();
    typingTimer: Timer | null = null;
    $filter = $('div').class('filter');
    constructor() {
        super('searchbar');
        this.build();
        $.keys($(window))
            .keydown('/', (e) => {e.preventDefault(); this.open()})
            .keyup('Escape', (e) => {if (this.inDOM()) e.preventDefault(); this.close()})
    }

    private build() {
        this
        .content([
            $('div').class('input-container')
                .content([
                    this.$tagInput
                        .on('input', () => this.inputHandler())
                        .on('keydown', (e) => this.keyHandler(e)),
                    $('ion-icon').name('close-circle-outline').title('Clear Input')
                        .on('click', () => this.$tagInput.clearAll())
                ])
                .on('click', (e) => {
                    if (e.target === this.$tagInput.dom) this.$tagInput.addTag().input();
                }),
            $('div').class('selection-list-container').content([
                this.$selectionList
            ]),
            this.$filter.on('click', () => {
                if (location.hash === '#search') this.close();
            })
        ])
    }

    open() { if (location.hash !== '#search') $.open(location.href + '#search'); return this; }
    close() { if (location.hash === '#search') $.back(); return this; }

    activate() {
        this.hide(false);
        this.$filter
            .animate({
                opacity: [0, 0.5]
            }, { duration: 300, easing: 'ease'})
        this.$tagInput.input();
        return this;
    }

    inactivate() {
        this.animate({
            opacity: [0.5, 0]
        }, { duration: 300, easing: 'ease'}, () => this.hide(true))
        return this;
    }

    private keyHandler(e: KeyboardEvent) {
        const addTag = () => {e.preventDefault(); this.$tagInput.addTag().input()}
        const addSelectedTag = ($selection: $Selection) => {
            const inputIndex = this.$tagInput.children.indexOf(this.$tagInput.$inputor);
            if (this.$tagInput.$input.value().at(-1) === ':') return this.getSearchSuggestions();
            const nextTag = this.$tagInput.children.array.at(inputIndex + 1) as $Tag;
            this.$tagInput.addTag($selection.value());
            if (nextTag) this.$tagInput.editTag(nextTag);
            else this.$tagInput.input();
        }
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault();
                this.$selectionList.focusPrevSelection();
                this.$tagInput.value(this.$selectionList.focused?.value());
                break;
            }
            case 'ArrowDown': {
                e.preventDefault();
                this.$selectionList.focusNextSelection();
                this.$tagInput.value(this.$selectionList.focused?.value());
                break;
            }
            case ' ': addTag(); break;
            case 'Enter': {
                e.preventDefault();
                if (this.$selectionList.focused) addSelectedTag(this.$selectionList.focused);
                else {
                    this.$tagInput.addTag();
                    this.search();
                }
                break;
            }
            case 'Tab': {
                e.preventDefault();
                const inputIndex = this.$tagInput.children.indexOf(this.$tagInput.$inputor)
                if (e.shiftKey) {
                    if (inputIndex - 1 >= 0) this.$tagInput.editTag(this.$tagInput.children.array.at(inputIndex - 1) as $Tag)
                    break;
                }
                if (this.$selectionList.focused) addSelectedTag(this.$selectionList.focused);
                else {
                    const nextTag = this.$tagInput.children.array.at(inputIndex + 1) as $Tag;
                    if (nextTag) this.$tagInput.editTag(nextTag);
                    else this.$tagInput.addTag().input();
                }
                break;
            }
            case 'Backspace': {
                const inputIndex = this.$tagInput.children.indexOf(this.$tagInput.$inputor)
                if (inputIndex !== 0 && !this.$tagInput.$input.value().length) {
                    e.preventDefault();
                    this.$tagInput.editTag(this.$tagInput.children.array.at(inputIndex - 1) as $Tag)
                }
                break;
            }
        }
    }

    private inputHandler() {
        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
            this.typingTimer = null;
        }
        this.typingTimer = setTimeout(async() => {
            this.typingTimer = null;
            this.getSearchSuggestions();
        }, 200);
    }

    async getSearchSuggestions() {
        const input = this.$tagInput.$input.value();
        const results = await Autocomplete.fetch(Booru.used, input, 20);
        this.$selectionList
            .clearSelections()
            .addSelections(results.map(data => new $Selection().value(data.value)
                .content([
                    $('div').class('selection-label').content([
                        data.isTagAntecedent() ? $('span').class('tag-antecedent').self($span => $span.dom.innerHTML = data.antecedent.replaceAll(input, `<b>${input}</b>`)) : null,
                        $('div').class('label-container').content([ 
                            data.isTagAntecedent() ? $('ion-icon').name('arrow-forward-outline') : null,
                            $('span').class('label').self($span => $span.dom.innerHTML = data.label.replaceAll(input, `<b>${input}</b>`))
                        ])
                    ]),
                    data.isTag() ? $('div').class('tag-detail').content([
                        $('span').class('tag-post-count').content(numberFormat(data.post_count)),
                        $('span').class('tag-category').content(TagCategory[data.category])
                    ]) : null,
                    data.isUser() ? $('span').class('user-level').content(data.level) : null
                ])
                .on('click', () => {this.$tagInput.addTag(data.value).input()})
            ))
    }

    search() {
        $.replace(`/posts?tags=${this.$tagInput.query.replace(':', '%3A')}`);
        this.$tagInput.clearAll();
        this.inactivate();
        return this;
    }

    checkURL(beforeURL: URL | undefined, afterURL: URL) {
        if (beforeURL?.hash === '#search') this.inactivate();
        if (afterURL.hash === '#search') this.activate();
        if (`${beforeURL?.pathname}${beforeURL?.search}` === `${afterURL.pathname}${afterURL.search}`) return;
        const tags_string = afterURL.searchParams.get('tags');
        this.$tagInput.clearAll();
        tags_string?.split(' ').forEach(tag => this.$tagInput.addTag(tag));
    }
}





