var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TagsPanel } from "./TagsPanel.js";
export class Searchbar {
    constructor(target, client) {
        this.node = document.createElement('booru-search');
        this.node.spellcheck = false;
        this.node.contentEditable = 'true';
        this.client = client;
        this.target = target;
        this.wrapper = document.createElement('search-result');
        this.tagPanel = new TagsPanel({ id: 'search-tag-panel' }, client);
        this.tags = [];
        this.node.addEventListener('input', this.input.bind(this));
    }
    load() {
        this.target.append(this.node);
        this.target.append(this.wrapper);
        this.wrapper.append(this.tagPanel.node);
    }
    input() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.node.innerHTML === '') {
                this.tagPanel.init();
                this.tags = [];
                return;
            }
            const tags = yield this.client.booru.tags.search(this.node.innerText);
            if (tags)
                this.tagPanel.load(tags);
        });
    }
}
//# sourceMappingURL=Searchbar.js.map