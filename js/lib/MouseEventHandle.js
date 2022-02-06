export class MouseEventHandle {
    constructor(ele) {
        this.element = ele;
        this.on = {
            mousedown: [],
            mouseup: [],
            mousemove: []
        };
        this.element.onmousemove = this.mousemove.bind(this);
        this.element.onmouseup = this.mouseup.bind(this);
        this.element.onmousedown = this.mousedown.bind(this);
    }
    addEvent(fn, e) {
        if (this.on[e].includes(fn))
            return;
        this.on[e].push(fn);
    }
    removeEvent(fn, e) {
        if (this.on[e].includes(fn)) {
            this.on[e].splice(this.on[e].indexOf(fn), 1);
        }
    }
    mousemove(e) {
        this.on.mousemove.forEach(fn => fn(e));
    }
    mouseup(e) {
        this.on.mouseup.forEach(fn => fn(e));
    }
    mousedown(e) {
        this.on.mousedown.forEach(fn => fn(e));
    }
}
//# sourceMappingURL=MouseEventHandle.js.map