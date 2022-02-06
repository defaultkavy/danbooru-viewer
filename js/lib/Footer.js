var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _Footer_colorAn;
import anime from "../plugin/anime.js";
import { removeAllChild } from "../plugin/extension.js";
import { GridPage } from "./GridPage.js";
import { PostGridElement } from "./PostGridElement.js";
export class Footer {
    constructor(client) {
        _Footer_colorAn.set(this, void 0);
        this.client = client;
        this.node = document.createElement('booru-footer');
        this.log = document.createElement('footer-log');
        this.counter = document.createElement('footer-counter');
        this.address = document.createElement('footer-address');
        this.dlButton = document.createElement('footer-download');
        this.dlPosts = [];
        this.dimension = document.createElement('footer-dimension');
        document.body.append(this.node);
        this.node.append(this.counter);
        this.node.append(this.address);
        this.node.append(this.log);
        this.dlButton.onclick = this.dlButtonClick.bind(this);
        this.dlButton.onauxclick = this.dlButtonAuxclick.bind(this);
        this.dlButton.onmouseenter = this.dlButtonMouseenter.bind(this);
        this.dlButton.onmouseleave = this.dlButtonMouseleave.bind(this);
    }
    push(content) {
        this.log.innerText = content;
    }
    updateCounter(page) {
        const subfix = '|';
        if (page instanceof GridPage) {
            if (page.grid.selected[0]) {
                this.counter.innerText = `${page.grid.selected.length}/${page.posts.array.length} posts ${subfix}`;
            }
            else
                this.counter.innerText = `${page.posts.array.length} posts ${subfix}`;
        }
    }
    updateLocation() {
        removeAllChild(this.address);
        const history = this.client.pages.history;
        for (let i = history.length - 3; i < history.length; i++) {
            if (i < 0)
                continue;
            const location = document.createElement('location');
            const direnct = document.createElement('direct');
            if (i === history.length - 3)
                location.innerText = '...';
            else
                location.innerText = history[i].title;
            direnct.innerText = ' > ';
            this.address.append(location);
            this.address.append(direnct);
            location.addEventListener('click', () => {
                const h = (this.client.pages.history.length - 1) - this.client.pages.history.indexOf(history[i]);
                for (let i = 0; i < h; i++) {
                    window.history.back();
                }
            });
        }
    }
    updateDlButton(page) {
        if (page instanceof GridPage) {
            if (page.grid.selected[0] instanceof PostGridElement) {
                this.node.append(this.dlButton);
                this.dlPosts = [];
                this.dlButton.innerText = 'Download Full Image';
                this.dlPosts.push(page.grid.selected[0].post);
            }
            else {
                this.dlButton.remove();
            }
        }
    }
    updateDimension(gridPage) {
        if (gridPage.grid.selected[0]) {
            this.node.append(this.dimension);
            this.dimension.innerText = `w: ${gridPage.grid.selected[0].width} h: ${gridPage.grid.selected[0].height}`;
        }
        else
            this.dimension.remove();
    }
    dlButtonClick() {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield fetch(this.dlPosts[0].file_url);
            const imageBlog = yield image.blob();
            const imageURL = URL.createObjectURL(imageBlog);
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = `${this.dlPosts[0].id}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    dlButtonAuxclick(e) {
        if (e.button === 1) {
            open(this.dlPosts[0].file_url, '_blank');
        }
    }
    dlButtonMouseenter() {
        this.dlButton.style.transition = 'none';
        if (__classPrivateFieldGet(this, _Footer_colorAn, "f"))
            __classPrivateFieldGet(this, _Footer_colorAn, "f").pause();
        __classPrivateFieldSet(this, _Footer_colorAn, anime({
            targets: this.dlButton,
            easing: 'easeOutQuint',
            duration: 500,
            backgroundColor: 'rgba(155, 155, 155, 1)',
            color: '#000000',
            complete: () => {
                this.dlButton.style.transition = '';
            }
        }), "f");
    }
    dlButtonMouseleave() {
        this.dlButton.style.transition = 'none';
        if (__classPrivateFieldGet(this, _Footer_colorAn, "f"))
            __classPrivateFieldGet(this, _Footer_colorAn, "f").pause();
        __classPrivateFieldSet(this, _Footer_colorAn, anime({
            targets: this.dlButton,
            easing: 'easeOutQuint',
            duration: 500,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: '#ffffff',
            complete: () => {
                this.dlButton.style.transition = '';
            }
        }), "f");
    }
}
_Footer_colorAn = new WeakMap();
//# sourceMappingURL=Footer.js.map