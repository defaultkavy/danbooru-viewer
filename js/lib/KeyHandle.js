import { GridPage } from "./GridPage.js";
import { OptionsPage } from "./OptionsPage.js";
import { PostGridElement } from "./PostGridElement.js";
import { PostPage } from "./PostPage.js";
export class KeyHandle {
    constructor(client) {
        this.client = client;
    }
    init() {
        window.addEventListener('keydown', this.keyup.bind(this));
    }
    keyup(e) {
        const page = this.client.pages.history[this.client.pages.history.length - 1];
        if (e.key === 'Tab' || e.key === '`')
            e.preventDefault();
        if (page instanceof GridPage) {
            const grid = this.grid;
            if (!grid)
                return;
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    grid.move('PREV');
                    break;
                case 'ArrowRight':
                case 'd':
                    grid.move('NEXT');
                    break;
                case 'ArrowUp':
                case 'w':
                    if (this.client.pages.postPage.opened)
                        return;
                    grid.move('UP');
                    break;
                case 'ArrowDown':
                case 's':
                    if (this.client.pages.postPage.opened)
                        return;
                    grid.move('DOWN');
                    break;
                case 'Enter':
                case ' ':
                    if (grid.selected[0])
                        e.preventDefault();
                    if (grid.selected[0] instanceof PostGridElement)
                        this.client.pages.openPost(grid.selected[0].post);
                    break;
                case 'Escape':
                    if (grid.selected[0]) {
                        const selected = [...grid.selected];
                        for (const ele of selected) {
                            ele.unselect(false);
                        }
                    }
                    else {
                        if (this.client.pages.history[1])
                            window.history.back();
                    }
                    if (grid.page instanceof GridPage)
                        grid.page.detail.close(true);
                    break;
                case 'Tab':
                    if (grid.selected[0] && grid.selected.length === 1 && grid.page instanceof GridPage) {
                        if (grid.page.detail.slided === window.innerHeight / 2)
                            grid.page.detail.slide(120);
                        else
                            grid.page.detail.slide(window.innerHeight / 2);
                    }
                    break;
                case '`':
                    this.client.pages.openOptions();
                    break;
            }
        }
        else if (page instanceof PostPage) {
            const grid = this.grid;
            if (!grid)
                return;
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    grid.move('PREV');
                    if (this.client.pages.postPage.opened && grid.selected[0] instanceof PostGridElement)
                        this.client.pages.postPage.open(grid.selected[0].post);
                    break;
                case 'ArrowRight':
                case 'd':
                    grid.move('NEXT');
                    if (this.client.pages.postPage.opened && grid.selected[0] instanceof PostGridElement)
                        this.client.pages.postPage.open(grid.selected[0].post);
                    break;
                case 'Escape':
                    window.history.back();
                    break;
                case 'Enter':
                case ' ':
                    if (grid.selected[0])
                        e.preventDefault();
                    window.history.back();
                    break;
                case '`':
                    window.history.back();
                    break;
            }
        }
        if (page instanceof OptionsPage) {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    break;
                case '`':
                case 'Escape':
                    e.preventDefault();
                    window.history.back();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (page.search.tagPanel.tags[0])
                        this.client.pages.openTag(page.search.tagPanel.tags[0].name);
                    break;
            }
        }
    }
    get grid() {
        const page = this.client.pages.history[this.client.pages.history.length - 1];
        if (page instanceof GridPage) {
            return page.grid;
        }
        else if (page instanceof PostPage) {
            const lastPage = this.client.pages.history[this.client.pages.history.length - 2];
            if (lastPage && lastPage instanceof GridPage) {
                return lastPage.grid;
            }
            else
                return undefined;
        }
        else
            return undefined;
    }
}
//# sourceMappingURL=KeyHandle.js.map