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
var _Detail_touch_top, _Detail_touchstart, _Detail_touchmove;
import anime from "../plugin/anime.js";
import { removeAllChild } from "../plugin/extension.js";
import { TagsPanel } from "./TagsPanel.js";
export class Detail {
    constructor(page, client) {
        _Detail_touch_top.set(this, void 0);
        _Detail_touchstart.set(this, void 0);
        _Detail_touchmove.set(this, void 0);
        this.client = client;
        this.node = document.createElement('booru-detail');
        this.page = page;
        this.preview = document.createElement('detail-preview');
        this.panel = document.createElement('detail-panel');
        this.hovered = false;
        __classPrivateFieldSet(this, _Detail_touch_top, { x: 0, y: 0 }, "f");
        __classPrivateFieldSet(this, _Detail_touchstart, { x: 0, y: 0 }, "f");
        __classPrivateFieldSet(this, _Detail_touchmove, { x: 0, y: 0 }, "f");
        this.slided = 0;
        this.mouseenterFn = this.mouseenter.bind(this);
        this.mouseleaveFn = this.mouseleave.bind(this);
        this.touchmoveFn = this.touchmove.bind(this);
        this.node.addEventListener('mouseenter', this.mouseenterFn);
        this.node.addEventListener('touchstart', this.touchstart.bind(this), { passive: false });
        this.node.addEventListener('touchend', this.touchend.bind(this));
    }
    open(elements) {
        if (this.page.grid.selected.length > 1)
            return this.close();
        this.page.node.append(this.node);
        this.loadPanel(elements);
        this.loadPreview(elements);
        if (!this.hovered) {
            this.slide(120);
        }
    }
    close(force = false) {
        if (force === true || !this.hovered) {
            if (this.heightAn)
                this.heightAn.pause();
            this.heightAn = anime({
                targets: this.node,
                easing: 'easeOutQuint',
                duration: 500,
                height: '0px',
                complete: () => this.node.remove()
            });
        }
    }
    loadPanel(elements) {
        removeAllChild(this.panel);
        if (elements.length === 1) {
            const main = document.createElement('main-tags-panel');
            const sub = document.createElement('sub-tags-panel');
            const artistPanel = new TagsPanel({
                category: 1,
                id: 'artist-tag-panel',
                title: 'Artist'
            }, elements[0].post, this.client);
            artistPanel.load();
            if (artistPanel.tags.size !== 0)
                main.append(artistPanel.node);
            const characterPanel = new TagsPanel({
                category: 4,
                id: 'character-tag-panel',
                title: 'Character'
            }, elements[0].post, this.client);
            characterPanel.load();
            if (characterPanel.tags.size !== 0)
                main.append(characterPanel.node);
            const copyrightPanel = new TagsPanel({
                category: 3,
                id: 'character-tag-panel',
                title: 'Copyright'
            }, elements[0].post, this.client);
            copyrightPanel.load();
            if (characterPanel.tags.size !== 0)
                main.append(copyrightPanel.node);
            if (main.children[0])
                this.panel.append(main);
            const generalPanel = new TagsPanel({
                category: 0,
                id: 'general-tag-panel',
                title: 'General'
            }, elements[0].post, this.client);
            generalPanel.load();
            if (generalPanel.tags.size !== 0)
                sub.append(generalPanel.node);
            if (sub.children[0])
                this.panel.append(sub);
        }
        this.node.append(this.panel);
    }
    slide(height, shadow) {
        this.slided = height;
        if (this.heightAn)
            this.heightAn.pause();
        this.heightAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            height: height,
            boxShadow: shadow
        });
    }
    loadPreview(elements) {
        removeAllChild(this.preview);
        if (elements.length === 1) {
            const img = document.createElement('img');
            img.src = elements[0].post.large_file_url;
            this.preview.append(img);
        }
        this.node.append(this.preview);
    }
    mouseenter() {
        this.hovered = true;
        document.body.style.overflow = 'hidden';
        if (this.heightAn)
            this.heightAn.pause();
        this.slide(window.innerHeight / 2);
        this.node.addEventListener('mouseleave', this.mouseleaveFn);
    }
    mouseleave() {
        this.hovered = false;
        document.body.style.overflow = 'auto';
        if (this.heightAn)
            this.heightAn.pause();
        if (this.page.grid.selected[0])
            this.slide(120);
        else
            this.close();
        this.node.removeEventListener('mouseleave', this.mouseleaveFn);
    }
    touchstart(e) {
        __classPrivateFieldSet(this, _Detail_touchstart, {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }, "f");
        __classPrivateFieldSet(this, _Detail_touch_top, {
            x: e.touches[0].clientX - this.node.offsetWidth,
            y: e.touches[0].clientY - this.node.offsetTop
        }, "f");
        this.slide(this.node.clientHeight + 10, 'rgba(147, 255, 255, 255) 0px 0px 20px');
        this.node.addEventListener('touchmove', this.touchmoveFn, { passive: false });
    }
    touchmove(e) {
        e.preventDefault();
        if (this.heightAn)
            this.heightAn.pause();
        const height = window.innerHeight - e.touches[0].clientY + __classPrivateFieldGet(this, _Detail_touch_top, "f").y;
        this.node.style.height = `${height > window.innerHeight ? window.innerHeight : height}px`;
        __classPrivateFieldSet(this, _Detail_touchmove, {
            x: __classPrivateFieldGet(this, _Detail_touchstart, "f").x - e.touches[0].clientX,
            y: __classPrivateFieldGet(this, _Detail_touchstart, "f").y - e.touches[0].clientY
        }, "f");
    }
    touchend() {
        if (__classPrivateFieldGet(this, _Detail_touchmove, "f").y > 100) {
            if (this.node.clientHeight > 100)
                this.slide(window.innerHeight / 2, 'rgba(147, 255, 255, 0) 0px 0px 0px');
            if (this.node.clientHeight > window.innerHeight / 2)
                this.slide(window.innerHeight, 'rgba(147, 255, 255, 0) 0px 0px 0px');
        }
        if (__classPrivateFieldGet(this, _Detail_touchmove, "f").y < -100) {
            if (this.node.clientHeight < window.innerHeight)
                this.slide(window.innerHeight / 2, 'rgba(147, 255, 255, 0) 0px 0px 0px');
            if (this.node.clientHeight < window.innerHeight / 2)
                this.slide(120, 'rgba(147, 255, 255, 0) 0px 0px 0px');
        }
        if (__classPrivateFieldGet(this, _Detail_touchmove, "f").y < -200) {
            this.slide(120, 'rgba(147, 255, 255, 0) 0px 0px 0px');
        }
        if (__classPrivateFieldGet(this, _Detail_touchmove, "f").y <= 100 && __classPrivateFieldGet(this, _Detail_touchmove, "f").y >= -100) {
            if (this.node.clientHeight < 150)
                this.slide(120, 'rgba(147, 255, 255, 0) 0px 0px 0px');
            else
                this.slide(window.innerHeight / 2, 'rgba(147, 255, 255, 0) 0px 0px 0px');
        }
        this.node.removeEventListener('touchmove', this.touchmoveFn);
        __classPrivateFieldSet(this, _Detail_touchmove, { x: 0, y: 0 }, "f");
    }
}
_Detail_touch_top = new WeakMap(), _Detail_touchstart = new WeakMap(), _Detail_touchmove = new WeakMap();
//# sourceMappingURL=Detail.js.map