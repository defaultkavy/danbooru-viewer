var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _GridElement_onselect, _GridElement_onunselect;
import anime from "../plugin/anime.js";
import { removeArrayItem } from "../plugin/extension.js";
import { GridPage } from "./GridPage.js";
import { PostGridElement } from "./PostGridElement.js";
export class GridElement {
    constructor(_ele, grid, element, client) {
        _GridElement_onselect.set(this, void 0);
        _GridElement_onunselect.set(this, void 0);
        this.client = client;
        this.node = element;
        this.order = 0;
        this.grid = grid;
        this.height = _ele.height;
        this.width = _ele.width;
        this.ratio = _ele.width / _ele.height;
        this.selected = false;
    }
    setOrder(order) {
        this.order = order;
        this.node.dataset.order = `${order}`;
    }
    select(record = true) {
        this.grid.selected.push(this);
        if (record)
            this.grid.selectedHistory.push([...this.grid.selected]);
        this.selected = true;
        if (this.borderAn)
            this.borderAn.pause();
        this.borderAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 200,
            backgroundColor: '#44e3f8',
            borderColor: '#44e3f8',
            borderWidth: 5
        });
        if (this instanceof PostGridElement) {
            if (this.grid.page instanceof GridPage) {
                if (this.grid.selected.length === 1)
                    this.grid.page.detail.open(this.postOnly(this.grid.selectedHistory[this.grid.selectedHistory.length - 1]));
                else
                    this.grid.page.detail.close();
            }
        }
        if (__classPrivateFieldGet(this, _GridElement_onselect, "f"))
            __classPrivateFieldGet(this, _GridElement_onselect, "f").call(this);
    }
    unselect(record = true) {
        this.selected = false;
        if (record)
            this.grid.selectedHistory.push([...this.grid.selected]);
        removeArrayItem(this.grid.selected, this);
        if (this.borderAn)
            this.borderAn.pause();
        this.borderAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 100,
            backgroundColor: '#505050',
            borderColor: '#505050',
            borderWidth: 0
        });
        if (__classPrivateFieldGet(this, _GridElement_onunselect, "f"))
            __classPrivateFieldGet(this, _GridElement_onunselect, "f").call(this);
    }
    postOnly(elements) {
        return elements.filter(ele => ele instanceof PostGridElement);
    }
    set onselect(fn) {
        __classPrivateFieldSet(this, _GridElement_onselect, fn, "f");
    }
    set onunselect(fn) {
        __classPrivateFieldSet(this, _GridElement_onunselect, fn, "f");
    }
}
_GridElement_onselect = new WeakMap(), _GridElement_onunselect = new WeakMap();
//# sourceMappingURL=GridElement.js.map