import { Page } from "./Page.js";
import { Searchbar } from "./Searchbar.js";
export class OptionsPage extends Page {
    constructor(_page, client) {
        super(_page, document.createElement('booru-options'), client);
        this.opened = false;
        this.wrapper = document.createElement('options-block');
        this.search = new Searchbar(this.wrapper, client);
    }
    open() {
        this.opened = true;
        this.node.style.transform = 'scale(1.2)';
        this.node.style.opacity = '0';
        this.client.app.append(this.node);
        this.load();
        this.scale(1);
        this.opacity(1);
    }
    close() {
        this.opened = false;
        this.opacity(0);
        this.scale(1.2).then(() => {
            this.node.remove();
        });
    }
    load() {
        this.node.append(this.wrapper);
        const search_title = document.createElement('search-title');
        search_title.innerText = 'Search tag';
        this.wrapper.append(search_title);
        this.search.load();
        this.search.node.focus();
    }
}
//# sourceMappingURL=OptionsPage.js.map