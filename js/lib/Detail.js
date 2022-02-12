var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _Detail_touch_top, _Detail_touchstart, _Detail_touchmove, _Detail_freeze;
import anime from "../plugin/anime.js";
import { removeAllChild } from "../plugin/extension.js";
import { TagsPanel } from "./TagsPanel.js";
export class Detail {
    constructor(page, client) {
        _Detail_touch_top.set(this, void 0);
        _Detail_touchstart.set(this, void 0);
        _Detail_touchmove.set(this, void 0);
        _Detail_freeze.set(this, void 0);
        this.client = client;
        this.node = document.createElement('booru-detail');
        this.page = page;
        this.preview = document.createElement('detail-preview');
        this.panel = document.createElement('detail-panel');
        this.wrapper = document.createElement('detail-block');
        this.hovered = false;
        __classPrivateFieldSet(this, _Detail_touch_top, { x: 0, y: 0 }, "f");
        __classPrivateFieldSet(this, _Detail_touchstart, { x: 0, y: 0 }, "f");
        __classPrivateFieldSet(this, _Detail_touchmove, { x: 0, y: 0 }, "f");
        __classPrivateFieldSet(this, _Detail_freeze, false, "f");
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
        this.node.append(this.panel);
        this.loadPanel(elements);
        this.loadPreview(elements);
        if (!this.hovered) {
            this.slide(120);
        }
    }
    close(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (force === true || !this.hovered) {
                    if (this.heightAn)
                        this.heightAn.pause();
                    this.heightAn = anime({
                        targets: this.node,
                        easing: 'easeOutQuint',
                        duration: 500,
                        height: '0px',
                        complete: () => {
                            this.node.remove();
                            resolve();
                        }
                    });
                }
            });
        });
    }
    loadPanel(elements) {
        removeAllChild(this.wrapper);
        if (elements.length === 1) {
            const main = document.createElement('main-tags-panel');
            const sub = document.createElement('sub-tags-panel');
            const artistPanel = new TagsPanel({
                category: 1,
                id: 'artist-tag-panel',
                title: 'Artist'
            }, this.client);
            artistPanel.load(elements[0].post.tags.array);
            if (artistPanel.tagButtons.size !== 0)
                main.append(artistPanel.node);
            const characterPanel = new TagsPanel({
                category: 4,
                id: 'character-tag-panel',
                title: 'Character'
            }, this.client);
            characterPanel.load(elements[0].post.tags.array);
            if (characterPanel.tagButtons.size !== 0)
                main.append(characterPanel.node);
            const copyrightPanel = new TagsPanel({
                category: 3,
                id: 'character-tag-panel',
                title: 'Copyright'
            }, this.client);
            copyrightPanel.load(elements[0].post.tags.array);
            if (characterPanel.tagButtons.size !== 0)
                main.append(copyrightPanel.node);
            if (main.children[0])
                this.wrapper.append(main);
            const generalPanel = new TagsPanel({
                category: 0,
                id: 'general-tag-panel',
                title: 'General'
            }, this.client);
            generalPanel.load(elements[0].post.tags.array);
            if (generalPanel.tagButtons.size !== 0)
                sub.append(generalPanel.node);
            if (sub.children[0])
                this.wrapper.append(sub);
        }
        this.panel.append(this.wrapper);
    }
    slide(height, shadow) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.slided = height;
                if (this.heightAn)
                    this.heightAn.pause();
                this.heightAn = anime({
                    targets: this.node,
                    easing: 'easeOutQuint',
                    duration: 500,
                    height: height,
                    boxShadow: shadow,
                    complete: () => {
                        resolve();
                    }
                });
            });
        });
    }
    freeze() {
        __classPrivateFieldSet(this, _Detail_freeze, true, "f");
    }
    unfreeze() {
        __classPrivateFieldSet(this, _Detail_freeze, false, "f");
    }
    loadPreview(elements) {
        removeAllChild(this.preview);
        this.node.append(this.preview);
        if (elements.length === 1) {
            const isVideo = elements[0].post.large_file_url.endsWith('mp4') || elements[0].post.large_file_url.endsWith('webm');
            if (isVideo) {
                const video = document.createElement('video');
                video.src = elements[0].post.large_file_url;
                this.preview.append(video);
            }
            else {
                const img = document.createElement('img');
                img.src = elements[0].post.large_file_url;
                this.preview.append(img);
            }
        }
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
        if (__classPrivateFieldGet(this, _Detail_freeze, "f"))
            return;
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
_Detail_touch_top = new WeakMap(), _Detail_touchstart = new WeakMap(), _Detail_touchmove = new WeakMap(), _Detail_freeze = new WeakMap();
//# sourceMappingURL=Detail.js.map