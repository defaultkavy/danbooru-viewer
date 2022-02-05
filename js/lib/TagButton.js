var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TagButton_mouseupFn;
import anime from "../plugin/anime.js";
export class TagButton {
    constructor(tag, client) {
        _TagButton_mouseupFn.set(this, void 0);
        this.client = client;
        this.tag = tag;
        this.node = document.createElement('booru-tag');
        __classPrivateFieldSet(this, _TagButton_mouseupFn, this.mouseup.bind(this), "f");
        this.node.innerText = this.tag.name;
        this.node.onmouseenter = this.mouseenter.bind(this);
        this.node.onmouseleave = this.mouseleave.bind(this);
        this.node.onmousedown = this.mousedown.bind(this);
    }
    mouseenter() {
        this.node.style.zIndex = '1';
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            scale: {
                value: 1 / (this.node.clientWidth / (this.node.clientWidth + 20)),
                duration: 500,
                easing: 'easeOutQuint'
            },
            boxShadow: {
                value: 'rgba(147, 255, 255, 255) 0px 0px 10px',
                duration: 500,
                delay: 400,
                easing: 'easeOutQuint'
            }
        });
    }
    mouseleave() {
        this.node.style.zIndex = '0';
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1,
            boxShadow: 'rgba(147, 255, 255, 0) 0px 0px 0px'
        });
    }
    mousedown() {
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 0.9,
            boxShadow: 'rgba(147, 255, 255, 255) 0px 0px 5px'
        });
        this.node.addEventListener('mouseup', __classPrivateFieldGet(this, _TagButton_mouseupFn, "f"));
    }
    mouseup() {
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.2,
            boxShadow: 'rgba(147, 255, 255, 255) 0px 0px 10px'
        });
        this.client.pages.openTag(this.tag.name);
    }
}
_TagButton_mouseupFn = new WeakMap();
//# sourceMappingURL=TagButton.js.map