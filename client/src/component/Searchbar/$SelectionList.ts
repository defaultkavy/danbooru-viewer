import { $Container } from "elexis";
import type { $Selection } from "./$Selection";

export class $SelectionList extends $Container {
    focused: $Selection | null = null;
    selections = new Set<$Selection>();
    constructor() {
        super('selection-list');
        this.css({
            display: 'block', 
            maxHeight: '40vh', 
            overflowY: 'scroll', 
            overflowX: 'hidden', 
            position: 'relative',
            '&::-webkit-scrollbar': {
                width: '4px'
            },
            '$.tag-category, .user-level, .history-tag': {
                padding: '0.1rem 0.4rem', 
                borderRadius: 'var(--border-radius-small)', 
                fontSize: '0.9rem', 
                backgroundColor: 'var(--secondary-color-4)', 
                color: 'var(--secondary-color-9)'
            }
        })
    }

    addSelections(selections: OrArray<$Selection>) {
        selections = $.orArrayResolve(selections);
        for (const $selection of selections) {
            this.selections.add($selection);
        }
        this.insert(selections);
        return this;
    }

    clearSelections() {
        this.focused = null;
        this.selections.clear();
        this.clear();
        return this;
    }

    focusSelection($selection: $Selection) {
        this.blurSelection();
        this.focused = $selection;
        $selection.focus();
        if ($selection.offsetTop < this.scrollTop()) this.scrollTop($selection.offsetTop);
        if ($selection.offsetTop + $selection.offsetHeight > this.scrollTop() + this.offsetHeight) this.scrollTop($selection.offsetTop + $selection.offsetHeight - this.offsetHeight);
        return this;
    }

    blurSelection() {
        this.focused?.blur();
        this.focused = null;
        return this;
    }

    focusNextSelection() {
        const selections = this.selections.array;
        const first = selections.at(0);
        if (this.focused) {
            const next = selections.at(selections.indexOf(this.focused) + 1);
            if (next) this.focusSelection(next);
            else if (first) this.focusSelection(first);
        } else if (first) this.focusSelection(first);
    }

    focusPrevSelection() {
        const selections = this.selections.array;
        if (this.focused) {
            const next = selections.at(selections.indexOf(this.focused) - 1);
            if (next) this.focusSelection(next);
        } else {
            const next = selections.at(0);
            if (next) this.focusSelection(next);
        }
    }
}