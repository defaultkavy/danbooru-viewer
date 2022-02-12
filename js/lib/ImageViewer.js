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
var _ImageViewer_img, _ImageViewer_scaleAn;
import anime from "../plugin/anime.js";
import { CanvasImage } from "./CanvasImage.js";
import { Touch } from "./Touch.js";
export class ImageViewer {
    constructor() {
        _ImageViewer_img.set(this, void 0);
        _ImageViewer_scaleAn.set(this, void 0);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        __classPrivateFieldSet(this, _ImageViewer_img, new Image(), "f");
        this.touch = new Touch(this.canvas);
        // Parameter
        this.mouse = { x: 0, y: 0, z: false };
        this.parent = { w: window.innerWidth, h: window.innerHeight };
        // Listener
        window.onresize = (e) => this.resize();
        this.canvas.onmousemove = this.mousemove.bind(this);
        this.canvas.ondblclick = () => this.reset();
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            if (e.deltaY > 0)
                this.zoom(0.8);
            if (e.deltaY < 0)
                this.zoom(1.2);
        }, { passive: false });
        this.touch.onstart(this.touchstart.bind(this));
        this.touch.onmove(this.touchmove.bind(this));
        this.touch.onend(this.touchend.bind(this));
        this.touch.ondbtouch(this.dbtouch.bind(this));
        this.canvas.onmousedown = (e) => {
            e.preventDefault();
            if (e.button === 1)
                this.mouse.z = true;
        };
        this.canvas.onmouseup = (e) => {
            if (e.button === 1)
                this.mouse.z = false;
        };
    }
    load(src) {
        if (this.img)
            this.img.clear();
        if (src instanceof HTMLImageElement) {
            __classPrivateFieldSet(this, _ImageViewer_img, src, "f");
        }
        else {
            __classPrivateFieldGet(this, _ImageViewer_img, "f").src = src;
        }
        this.imageInit();
    }
    replace(src) {
        if (src instanceof HTMLImageElement) {
            __classPrivateFieldSet(this, _ImageViewer_img, src, "f");
        }
        else {
            __classPrivateFieldGet(this, _ImageViewer_img, "f").src = src;
        }
        if (!this.img)
            return;
        this.img.clear();
        this.img.place(__classPrivateFieldGet(this, _ImageViewer_img, "f"));
    }
    set() {
    }
    imageInit() {
        const parent = this.canvas.parentElement;
        if (!parent)
            return;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.img = new CanvasImage(__classPrivateFieldGet(this, _ImageViewer_img, "f"), this.canvas);
        let width = this.img.width;
        let height = this.img.height;
        const offsetX = width < this.canvas.width ? ((this.canvas.width - width) / 2) : 0;
        const offsetY = height < this.canvas.height ? ((this.canvas.height - height) / 2) : 0;
        this.img.draw(offsetX, offsetY, width, height);
    }
    resize() {
        const parent = this.canvas.parentElement;
        if (!parent)
            return;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        if (!this.img)
            return;
        const { dx, dy, dw, dh } = this.img;
        const offsetX = dx + (parent.clientWidth - this.parent.w) / 2;
        const offsety = dy + (parent.clientHeight - this.parent.h) / 2;
        this.parent.h = parent.clientHeight;
        this.parent.w = parent.clientWidth;
        this.img.clear();
        this.img.draw(offsetX, offsety, dw, dh);
    }
    reset() {
        const parent = this.canvas.parentElement;
        if (!parent)
            return;
        if (!this.img)
            return;
        const offsetX = this.img.width < this.canvas.width ? ((this.canvas.width - this.img.width) / 2) : 0;
        const offsetY = this.img.height < this.canvas.height ? ((this.canvas.height - this.img.height) / 2) : 0;
        const { dx, dy, dw, dh } = this.img;
        const d = {
            x: dx,
            y: dy,
            w: dw,
            h: dh,
        };
        if (__classPrivateFieldGet(this, _ImageViewer_scaleAn, "f"))
            __classPrivateFieldGet(this, _ImageViewer_scaleAn, "f").pause();
        __classPrivateFieldSet(this, _ImageViewer_scaleAn, anime({
            targets: d,
            easing: 'easeOutQuint',
            duration: 200,
            x: offsetX,
            y: offsetY,
            w: this.img.width,
            h: this.img.height,
            update: () => {
                if (!this.img)
                    return;
                this.img.clear();
                this.img.draw(d.x, d.y, d.w, d.h);
            }
        }), "f");
    }
    zoom(factor) {
        if (this.mouse.z)
            return;
        if (!this.img)
            return;
        const image_mouse = {
            x: (this.mouse.x - this.img.dx),
            y: (this.mouse.y - this.img.dy)
        };
        const x = this.img.dx - (image_mouse.x * factor - image_mouse.x);
        const y = this.img.dy - (image_mouse.y * factor - image_mouse.y);
        const d = {
            x: this.img.dx,
            y: this.img.dy,
            w: this.img.dw,
            h: this.img.dh
        };
        if (__classPrivateFieldGet(this, _ImageViewer_scaleAn, "f"))
            __classPrivateFieldGet(this, _ImageViewer_scaleAn, "f").pause();
        __classPrivateFieldSet(this, _ImageViewer_scaleAn, anime({
            targets: d,
            easing: 'easeOutQuint',
            duration: 200,
            x: x,
            y: y,
            w: this.img.dw * factor,
            h: this.img.dh * factor,
            update: () => {
                if (!this.img)
                    return;
                this.img.clear();
                this.img.draw(d.x, d.y, d.w, d.h);
            }
        }), "f");
    }
    touchZoom(scale) {
        if (this.mouse.z)
            return;
        if (!this.img)
            return;
        const image_touch = {
            x: (this.touch.start.x - this.img.dx),
            y: (this.touch.start.y - this.img.dy)
        };
        const x = this.img.dx - (image_touch.x * scale - image_touch.x);
        const y = this.img.dy - (image_touch.y * scale - image_touch.y);
        const w = this.img.dw * scale;
        const h = this.img.dh * scale;
        const d = {
            x: this.img.dx,
            y: this.img.dy,
            w: this.img.dw,
            h: this.img.dh
        };
        if (__classPrivateFieldGet(this, _ImageViewer_scaleAn, "f"))
            __classPrivateFieldGet(this, _ImageViewer_scaleAn, "f").pause();
        __classPrivateFieldSet(this, _ImageViewer_scaleAn, anime({
            targets: d,
            easing: 'easeOutQuint',
            duration: 200,
            x: x,
            y: y,
            w: w,
            h: h,
            update: () => {
                if (!this.img)
                    return;
                this.img.clear();
                this.img.draw(d.x, d.y, d.w, d.h);
            }
        }), "f");
    }
    pan(e) {
        if (!this.img)
            return;
        const x = this.img.dx + e.movementX;
        const y = this.img.dy + e.movementY;
        this.img.clear();
        this.img.draw(x, y, this.img.dw, this.img.dh);
    }
    mousemove(e) {
        this.mouse = {
            x: e.x - this.canvas.getBoundingClientRect().left,
            y: e.y - this.canvas.getBoundingClientRect().top,
            z: this.mouse.z
        };
        if (this.mouse.z) {
            this.pan(e);
        }
    }
    touchstart(e) {
        e.preventDefault();
    }
    touchmove(e) {
        if (this.touch.dbtouch) {
            if (this.touch.movement.y > 0 && Math.round(this.touch.moved.y % 10) === 0)
                this.touchZoom(1.1);
            else if (this.touch.movement.y < 0 && Math.round(this.touch.moved.y % 10) === 0)
                this.touchZoom(0.9);
        }
        else {
            e.preventDefault();
            if (!this.img)
                return;
            const overX = this.img.dw > this.canvas.width && this.img.dx + this.touch.movement.x <= 0;
            const overY = this.img.dh > this.canvas.height && this.img.dy + this.touch.movement.y <= 0;
            const overW = overX && this.img.dx + this.img.dw + this.touch.movement.x >= this.canvas.width;
            const overH = overY && this.img.dy + this.img.dh + this.touch.movement.y >= this.canvas.height;
            const x = this.img.dx + this.touch.movement.x; //overW ? this.img.dx + this.touch.movement.x : this.img.dx
            const y = this.img.dy + this.touch.movement.y; //overH ? this.img.dy + this.touch.movement.y : this.img.dy
            this.img.clear();
            this.img.draw(x, y, this.img.dw, this.img.dh);
        }
    }
    touchend(e) {
    }
    dbtouch(e) {
        this.touchZoom(1.2);
    }
}
_ImageViewer_img = new WeakMap(), _ImageViewer_scaleAn = new WeakMap();
//# sourceMappingURL=ImageViewer.js.map