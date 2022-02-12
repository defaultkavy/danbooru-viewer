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
var _Page_scaleAn, _Page_opacityAn;
import anime from "../plugin/anime.js";
export class Page {
    constructor(_page, node, client) {
        _Page_scaleAn.set(this, void 0);
        _Page_opacityAn.set(this, void 0);
        this.client = client;
        this.node = node;
        this.url = _page.url;
        this.title = _page.title;
        this.scrollTop = 0;
        this.node.addEventListener('scroll', () => {
            this.scrollTop = this.node.scrollTop;
        });
    }
    close() {
        this.node.remove();
    }
    unachived() {
        this.client.app.append(this.node);
        this.opacity(1);
    }
    achived() {
        this.opacity(0).then(() => {
            this.node.remove();
        });
    }
    scale(scale) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (__classPrivateFieldGet(this, _Page_scaleAn, "f"))
                    __classPrivateFieldGet(this, _Page_scaleAn, "f").pause();
                __classPrivateFieldSet(this, _Page_scaleAn, anime({
                    targets: this.node,
                    easing: 'easeOutQuint',
                    duration: 300,
                    scale: scale,
                    complete: () => {
                        resolve();
                    }
                }), "f");
            });
        });
    }
    opacity(opacity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (__classPrivateFieldGet(this, _Page_opacityAn, "f"))
                    __classPrivateFieldGet(this, _Page_opacityAn, "f").pause();
                __classPrivateFieldSet(this, _Page_opacityAn, anime({
                    targets: this.node,
                    easing: 'easeOutQuint',
                    duration: 300,
                    opacity: opacity,
                    complete: () => {
                        resolve();
                    }
                }), "f");
            });
        });
    }
}
_Page_scaleAn = new WeakMap(), _Page_opacityAn = new WeakMap();
//# sourceMappingURL=Page.js.map