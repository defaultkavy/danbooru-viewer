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
var _Scrollbar_mousemoveFn;
export class Scrollbar {
    constructor(target, parent) {
        _Scrollbar_mousemoveFn.set(this, void 0);
        this.target = target;
        this.node = document.createElement('scrollbar');
        this.parent = parent;
        this.resizeObs = new Map;
        this.resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                this.resize();
            });
        });
        __classPrivateFieldSet(this, _Scrollbar_mousemoveFn, this.onmousemove.bind(this), "f");
        this.target.append(this.node);
        this.target.addEventListener('scroll', this.onscroll.bind(this), { passive: true });
        this.node.addEventListener('mousedown', this.onmousedown.bind(this));
        window.addEventListener('mousemove', __classPrivateFieldGet(this, _Scrollbar_mousemoveFn, "f"));
        window.addEventListener('mouseup', () => {
            this.mouse_up = true;
        });
        this.mouse_up = true;
        this.mouse_down = { x: 0, y: 0 };
        this.target_scroll = { x: 0, y: 0 };
        this.mouse_move = { x: 0, y: 0 };
        this.mouse_node = { x: 0, y: 0 };
        this.observer();
        //this.resize()
    }
    onscroll() {
        this.resize();
    }
    onmousedown(e) {
        this.mouse_up = false;
        this.mouse_down.x = e.x;
        this.mouse_down.y = e.y;
        this.target_scroll.x = this.target.scrollLeft;
        this.target_scroll.y = this.target.scrollTop;
        this.mouse_node.x = e.x - this.node.offsetLeft;
        this.mouse_node.y = e.y - this.node.offsetTop;
    }
    onmousemove(e) {
        if (this.mouse_up)
            return;
        this.mouse_move.x = e.x - this.mouse_down.x;
        this.mouse_move.y = e.y - this.mouse_down.y;
        this.target.scrollTo({ top: this.target_scroll.y + (this.mouse_move.y * this.factor) });
    }
    resize() {
        const top = (this.target.scrollTop) / this.factor;
        this.node.style.top = `${top}px`;
        //this.node.style.height = `${this.target.clientHeight - (this.remainHeight * (this.target.scrollHeight - this.target.clientHeight) / (this.target.clientHeight))}px`
    }
    observer() {
        const opts = { childList: true };
        new MutationObserver((list, observer) => {
            list.forEach(mutation => {
                switch (mutation.type) {
                    case 'childList':
                        this.resize();
                        mutation.addedNodes.forEach(node => {
                            this.resizeObserver.observe(node);
                        });
                        mutation.removedNodes.forEach(node => {
                            this.resizeObserver.unobserve(node);
                        });
                        break;
                }
            });
        }).observe(this.target, opts);
    }
    get factor() {
        return (this.target.scrollHeight - this.target.clientHeight) / (this.target.clientHeight - this.node.clientHeight);
    }
    get remainHeight() {
        return ((this.target.scrollHeight - this.target.clientHeight));
    }
}
_Scrollbar_mousemoveFn = new WeakMap();
//# sourceMappingURL=Scrollbar.js.map