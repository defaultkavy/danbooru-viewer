export class Touch {
    node: HTMLElement;
    preventEnabled: boolean
    #onstart?: (e: TouchEvent) => any;
    #onmove?: (e: TouchEvent) => any;
    #onend?: (e: TouchEvent) => any;
    #ondbtouch?: (e: TouchEvent) => any;
    #touchmoveFn: (e: TouchEvent) => void;
    #touchendFn: (e: TouchEvent) => void;
    start: { x: any; y: any; };
    offset: { x: number; y: number; };
    moved: { x: number; y: number; };
    movement: { x: number; y: number; };
    lastmove: { x: number; y: number; };
    x: number
    y: number
    #dbtouchstart: boolean;
    dbtouch: boolean;
    dbtimer?: NodeJS.Timeout;
    constructor(node: HTMLElement) {
        this.node = node
        this.#touchmoveFn = this.touchmove.bind(this)
        this.#touchendFn = this.touchend.bind(this)
        this.start = {x: 0, y: 0}
        this.moved = {x: 0, y: 0}
        this.movement = {x: 0, y: 0}
        this.offset = {x: 0, y: 0}
        this.lastmove = {x: 0, y: 0}
        this.x = 0
        this.y = 0
        this.#dbtouchstart = false
        this.dbtouch = false
        this.preventEnabled = false
        // Add listener
        this.node.addEventListener('touchstart', this.touchstart.bind(this), {passive: false})
    }

    onstart(fn: (e: TouchEvent) => any) {
        this.#onstart = fn
    }

    onmove(fn: (e: TouchEvent) => any) {
        this.#onmove = fn
    }

    onend(fn: (e: TouchEvent) => any) {
        this.#onend = fn
    }

    ondbtouch(fn: (e: TouchEvent) => any) {
        this.#ondbtouch = fn
    }

    preventDefault(boolean = true) {
        this.preventEnabled = boolean
    }

    private touchstart(e: TouchEvent) {
        if (this.preventEnabled) e.preventDefault()
        this.node.addEventListener('touchmove', this.#touchmoveFn, {passive: false})
        this.node.addEventListener('touchend', this.#touchendFn, {passive: false})

        this.x = e.touches[0].clientX
        this.y = e.touches[0].clientY
        this.start.x = e.touches[0].clientX
        this.start.y = e.touches[0].clientY
        this.offset.x = e.touches[0].clientX - this.node.offsetWidth
        this.offset.y = e.touches[0].clientY - this.node.offsetTop

        if (this.#dbtouchstart) this.dbtouch = true
        this.#dbtouchstart = !this.#dbtouchstart
        if (this.dbtimer) clearTimeout(this.dbtimer)
        if (!this.dbtouch) this.dbtimer = setTimeout(() => {
            this.#dbtouchstart = false
        }, 200)
        if (this.#onstart) this.#onstart(e)
    }

    private touchmove(e: TouchEvent) {
        if (this.preventEnabled) e.preventDefault()
        this.lastmove.x = this.x
        this.lastmove.y = this.y
        this.x = e.touches[0].clientX
        this.y = e.touches[0].clientY
        this.movement.x = this.x - this.lastmove.x,
        this.movement.y = this.y - this.lastmove.y
        this.moved = {
            x: this.x - this.start.x,            
            y: this.y - this.start.y            
        }
        if (this.#onmove) this.#onmove(e)
    }

    private touchend(e: TouchEvent) {
        if (this.preventEnabled) e.preventDefault()
        if (this.#onend) this.#onend(e)
        this.moved = {x: 0,y: 0}
        if (this.dbtouch && this.#ondbtouch) this.#ondbtouch(e)
        this.dbtouch = false
        this.node.removeEventListener('touchmove', this.#touchmoveFn)
        this.node.removeEventListener('touchend', this.#touchendFn)
    }
}