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
var _Loader_onloadstart, _Loader_onloadprogress, _Loader_onabort;
export class Loader {
    constructor(url, callback) {
        _Loader_onloadstart.set(this, void 0);
        _Loader_onloadprogress.set(this, void 0);
        _Loader_onabort.set(this, void 0);
        this.url = url;
        this.callback = callback;
        this.total = 0;
        this.loaded = 0;
        this.xhr = new XMLHttpRequest;
        this.load();
    }
    load() {
        this.xhr.open('GET', this.url, true);
        this.xhr.responseType = 'arraybuffer';
        this.xhr.onload = (e) => {
            const blob = new Blob([this.xhr.response]);
            if (this.callback)
                this.callback(window.URL.createObjectURL(blob));
        };
        this.xhr.onloadstart = (e) => {
            this.total = e.total;
            this.loaded = 0;
            if (__classPrivateFieldGet(this, _Loader_onloadstart, "f"))
                __classPrivateFieldGet(this, _Loader_onloadstart, "f").call(this);
        };
        this.xhr.onprogress = (e) => {
            this.total = e.total;
            this.loaded = e.loaded;
            if (__classPrivateFieldGet(this, _Loader_onloadprogress, "f"))
                __classPrivateFieldGet(this, _Loader_onloadprogress, "f").call(this);
        };
        this.xhr.onabort = (e) => {
            if (__classPrivateFieldGet(this, _Loader_onabort, "f"))
                __classPrivateFieldGet(this, _Loader_onabort, "f").call(this);
        };
        this.xhr.send();
    }
    abort() {
        this.xhr.abort();
    }
    onloadprogress(fn) {
        __classPrivateFieldSet(this, _Loader_onloadprogress, fn, "f");
    }
    onloadstart(fn) {
        __classPrivateFieldSet(this, _Loader_onloadstart, fn, "f");
    }
    onabort(fn) {
        __classPrivateFieldSet(this, _Loader_onabort, fn, "f");
    }
    get percentage() {
        return (this.loaded / this.total) * 100;
    }
}
_Loader_onloadstart = new WeakMap(), _Loader_onloadprogress = new WeakMap(), _Loader_onabort = new WeakMap();
//# sourceMappingURL=Loader.js.map