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
var _Touch_onstart, _Touch_onmove, _Touch_onend, _Touch_ondbtouch, _Touch_touchmoveFn, _Touch_touchendFn, _Touch_dbtouchstart;
export class Touch {
    constructor(node) {
        _Touch_onstart.set(this, void 0);
        _Touch_onmove.set(this, void 0);
        _Touch_onend.set(this, void 0);
        _Touch_ondbtouch.set(this, void 0);
        _Touch_touchmoveFn.set(this, void 0);
        _Touch_touchendFn.set(this, void 0);
        _Touch_dbtouchstart.set(this, void 0);
        this.node = node;
        __classPrivateFieldSet(this, _Touch_touchmoveFn, this.touchmove.bind(this), "f");
        __classPrivateFieldSet(this, _Touch_touchendFn, this.touchend.bind(this), "f");
        this.start = { x: 0, y: 0 };
        this.moved = { x: 0, y: 0 };
        this.movement = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.lastmove = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
        __classPrivateFieldSet(this, _Touch_dbtouchstart, false, "f");
        this.dbtouch = false;
        this.preventEnabled = false;
        // Add listener
        this.node.addEventListener('touchstart', this.touchstart.bind(this), { passive: false });
    }
    onstart(fn) {
        __classPrivateFieldSet(this, _Touch_onstart, fn, "f");
    }
    onmove(fn) {
        __classPrivateFieldSet(this, _Touch_onmove, fn, "f");
    }
    onend(fn) {
        __classPrivateFieldSet(this, _Touch_onend, fn, "f");
    }
    ondbtouch(fn) {
        __classPrivateFieldSet(this, _Touch_ondbtouch, fn, "f");
    }
    preventDefault(boolean = true) {
        this.preventEnabled = boolean;
    }
    touchstart(e) {
        if (this.preventEnabled)
            e.preventDefault();
        this.node.addEventListener('touchmove', __classPrivateFieldGet(this, _Touch_touchmoveFn, "f"), { passive: false });
        this.node.addEventListener('touchend', __classPrivateFieldGet(this, _Touch_touchendFn, "f"), { passive: false });
        this.x = e.touches[0].clientX;
        this.y = e.touches[0].clientY;
        this.start.x = e.touches[0].clientX;
        this.start.y = e.touches[0].clientY;
        this.offset.x = e.touches[0].clientX - this.node.offsetWidth;
        this.offset.y = e.touches[0].clientY - this.node.offsetTop;
        if (__classPrivateFieldGet(this, _Touch_dbtouchstart, "f"))
            this.dbtouch = true;
        __classPrivateFieldSet(this, _Touch_dbtouchstart, !__classPrivateFieldGet(this, _Touch_dbtouchstart, "f"), "f");
        if (this.dbtimer)
            clearTimeout(this.dbtimer);
        if (!this.dbtouch)
            this.dbtimer = setTimeout(() => {
                __classPrivateFieldSet(this, _Touch_dbtouchstart, false, "f");
            }, 200);
        if (__classPrivateFieldGet(this, _Touch_onstart, "f"))
            __classPrivateFieldGet(this, _Touch_onstart, "f").call(this, e);
    }
    touchmove(e) {
        if (this.preventEnabled)
            e.preventDefault();
        this.lastmove.x = this.x;
        this.lastmove.y = this.y;
        this.x = e.touches[0].clientX;
        this.y = e.touches[0].clientY;
        this.movement.x = this.x - this.lastmove.x,
            this.movement.y = this.y - this.lastmove.y;
        this.moved = {
            x: this.x - this.start.x,
            y: this.y - this.start.y
        };
        if (__classPrivateFieldGet(this, _Touch_onmove, "f"))
            __classPrivateFieldGet(this, _Touch_onmove, "f").call(this, e);
    }
    touchend(e) {
        if (this.preventEnabled)
            e.preventDefault();
        if (__classPrivateFieldGet(this, _Touch_onend, "f"))
            __classPrivateFieldGet(this, _Touch_onend, "f").call(this, e);
        this.moved = { x: 0, y: 0 };
        if (this.dbtouch && __classPrivateFieldGet(this, _Touch_ondbtouch, "f"))
            __classPrivateFieldGet(this, _Touch_ondbtouch, "f").call(this, e);
        this.dbtouch = false;
        this.node.removeEventListener('touchmove', __classPrivateFieldGet(this, _Touch_touchmoveFn, "f"));
        this.node.removeEventListener('touchend', __classPrivateFieldGet(this, _Touch_touchendFn, "f"));
    }
}
_Touch_onstart = new WeakMap(), _Touch_onmove = new WeakMap(), _Touch_onend = new WeakMap(), _Touch_ondbtouch = new WeakMap(), _Touch_touchmoveFn = new WeakMap(), _Touch_touchendFn = new WeakMap(), _Touch_dbtouchstart = new WeakMap();
//# sourceMappingURL=Touch.js.map