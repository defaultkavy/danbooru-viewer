import { MouseEventHandle } from "./MouseEventHandle.js";
export class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.events = new Map;
        this.down = { x: 0, y: 0 };
        this.move = { x: 0, y: 0 };
        window.onmousemove = (e) => {
            this.x = e.x;
            this.y = e.y;
            this.move.x = this.down.x + e.x;
            this.move.y = this.down.y + e.y;
        };
        window.onmousedown = (e) => {
            this.down.x = e.x;
            this.down.y = e.y;
        };
    }
    onmousedown(ele, fn) { this.addEventListener(ele, fn, 'mousedown'); }
    removemousedown(ele, fn) { this.removeEventListener(ele, fn, 'mousedown'); }
    onmouseup(ele, fn) { this.addEventListener(ele, fn, 'mouseup'); }
    removemouseup(ele, fn) { this.removeEventListener(ele, fn, 'mouseup'); }
    onmousemove(ele, fn) { this.addEventListener(ele, fn, 'mousemove'); }
    removemousemove(ele, fn) { this.removeEventListener(ele, fn, 'mousemove'); }
    addEventListener(ele, fn, e) {
        if (!this.events.has(ele)) {
            const event = new MouseEventHandle(ele);
            this.events.set(ele, event);
        }
        const event = this.events.get(ele);
        if (!event)
            throw new Error('event is missing');
        event.addEvent(fn, e);
    }
    removeEventListener(ele, fn, e) {
        const event = this.events.get(ele);
        if (!event)
            return;
        event.addEvent(fn, e);
    }
}
//# sourceMappingURL=Mouse.js.map