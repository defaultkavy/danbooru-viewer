export class MouseEventHandle {
    element: HTMLElement;
    on: on
    constructor(ele: HTMLElement) {
        this.element = ele
        this.on = {
            mousedown: [],
            mouseup: [],
            mousemove: []
        }

        this.element.onmousemove = this.mousemove.bind(this)
        this.element.onmouseup = this.mouseup.bind(this)
        this.element.onmousedown = this.mousedown.bind(this)
    }

    addEvent(fn: fn, e: 'mouseup' | 'mousedown' | 'mousemove') {
        if (this.on[e].includes(fn)) return
        this.on[e].push(fn)
    }

    removeEvent(fn: fn, e: 'mouseup' | 'mousedown' | 'mousemove') {
        if (this.on[e].includes(fn)) {
            this.on[e].splice(this.on[e].indexOf(fn), 1)
        }
    }

    private mousemove(e: MouseEvent) {
        
        this.on.mousemove.forEach(fn => fn(e))
    }

    private mouseup(e: MouseEvent) {

        this.on.mouseup.forEach(fn => fn(e))
    }

    private mousedown(e: MouseEvent) {
        
        this.on.mousedown.forEach(fn => fn(e))
    }
}

type fn = (e: MouseEvent) => any

interface on {
    mousedown: fn[]
    mouseup: fn[]
    mousemove: fn[]
}