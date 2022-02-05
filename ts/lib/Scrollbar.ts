export class Scrollbar {
    target: HTMLElement
    node: HTMLElement
    parent: HTMLElement
    resizeObs: Map<HTMLElement, ResizeObserver>
    #mousemoveFn: (e: MouseEvent) => void;
    mouse_down: { x: number; y: number; };
    mouse_move: { x: number; y: number; };
    mouse_node: { x: number; y: number; };
    target_scroll: { x: number; y: number; };
    mouse_up: boolean
    mouse: any;
    resizeObserver: ResizeObserver;
    constructor(target: HTMLElement, parent: HTMLElement) {
        this.target = target
        this.node = document.createElement('scrollbar')
        this.parent = parent
        this.resizeObs = new Map
        this.resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                this.resize()
            })
        })
        this.#mousemoveFn = this.onmousemove.bind(this)
        this.target.append(this.node)
        this.target.onscroll = this.onscroll.bind(this)
        this.node.onmousedown = this.onmousedown.bind(this)
        window.addEventListener('mousemove', this.#mousemoveFn)
        window.addEventListener('mouseup', () => {
            this.mouse_up = true
        })
        this.mouse_up = true
        this.mouse_down = {x: 0,y: 0}
        this.target_scroll = {x: 0,y: 0}
        this.mouse_move = {x: 0,y: 0}
        this.mouse_node = {x: 0,y: 0}
        this.observer()
        //this.resize()
    }

    private onscroll() {
        this.resize()
    }

    private onmousedown(e: MouseEvent) {
        this.mouse_up = false
        this.mouse_down.x = e.x
        this.mouse_down.y = e.y
        this.target_scroll.x = this.target.scrollLeft
        this.target_scroll.y = this.target.scrollTop
        this.mouse_node.x = e.x - this.node.offsetLeft
        this.mouse_node.y = e.y - this.node.offsetTop
    }

    private onmousemove(e: MouseEvent) {
        if (this.mouse_up) return
        this.mouse_move.x = e.x - this.mouse_down.x
        this.mouse_move.y = e.y - this.mouse_down.y
        this.target.scrollTo({top: this.target_scroll.y + (this.mouse_move.y * this.factor)})
    }

    private resize() {
        const top = (this.target.scrollTop) / this.factor
        this.node.style.top = `${top}px`
        //this.node.style.height = `${this.target.clientHeight - (this.remainHeight * (this.target.scrollHeight - this.target.clientHeight) / (this.target.clientHeight))}px`
    }

    private observer() {
        const opts = {childList: true}
        new MutationObserver((list, observer) => {
            list.forEach(mutation => {
                switch (mutation.type) {
                    case 'childList':
                        this.resize()
                        mutation.addedNodes.forEach(node => {
                            this.resizeObserver.observe(<Element>node)
                        })

                        mutation.removedNodes.forEach(node => {
                            this.resizeObserver.unobserve(<HTMLElement>node)
                        })
                    break
                }
            })
        }).observe(this.target, opts)
    }

    get factor() {
        return (this.target.scrollHeight - this.target.clientHeight) / (this.target.clientHeight - this.node.clientHeight)
    }

    get remainHeight() {
        return ((this.target.scrollHeight - this.target.clientHeight))
    }
}