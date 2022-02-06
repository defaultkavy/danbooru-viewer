var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { removeAllChild } from "../plugin/extension.js";
import { TagButton } from "./TagButton.js";
export class TagsPanel {
    constructor(_panel, post, client) {
        this.client = client;
        this.node = document.createElement('tags-panel');
        this.id = _panel.id;
        this.post = post;
        this.title = _panel.title;
        this.node.id = this.id;
        this.category = _panel.category;
        this.tags = new Map();
        this.init();
    }
    init() {
        removeAllChild(this.node);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.title) {
                const title = document.createElement('panel-title');
                title.innerText = this.title;
                this.node.append(title);
            }
            const tagWrapper = document.createElement('panel-tags');
            this.node.append(tagWrapper);
            for (const tag of this.post.tags.values()) {
                if (!tag)
                    return;
                if (tag.category === this.category) {
                    const tagButton = new TagButton(tag, this.client);
                    tagWrapper.append(tagButton.node);
                    this.tags.set(tag.name, tagButton);
                }
            }
        });
    }
}
export var _tagCategory;
(function (_tagCategory) {
    _tagCategory[_tagCategory["General"] = 0] = "General";
    _tagCategory[_tagCategory["Artist"] = 1] = "Artist";
    _tagCategory[_tagCategory["Copyright"] = 3] = "Copyright";
    _tagCategory[_tagCategory["Character"] = 4] = "Character";
    _tagCategory[_tagCategory["Meta"] = 5] = "Meta";
})(_tagCategory || (_tagCategory = {}));
//# sourceMappingURL=TagsPanel.js.map