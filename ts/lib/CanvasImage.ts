export class CanvasImage {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
    src: string;
    img: HTMLImageElement;
    constructor(img: HTMLImageElement, canvas: HTMLCanvasElement, options?: _CanvasImage) {
        this.src = img.src
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.img = img
        this.dx = options ? options.dx : 0
        this.dy = options ? options.dy : 0
        this.dw = options ? options.dw : 0
        this.dh = options ? options.dh : 0
        if (this.ctx) this.ctx.drawImage(img, this.dx, this.dy, this.dw, this.dh)
    }

    draw(dx: number,
        dy: number,
        dw: number,
        dh: number) {
        
        if (!this.ctx) return 
        this.dx = dx
        this.dy = dy
        this.dw = dw
        this.dh = dh
        this.ctx.drawImage(this.img, dx, dy, dw, dh)
    }

    clear() {
        if (!this.ctx) return 
        //this.ctx.clearRect(this.dx, this.dy, this.dw, this.dh)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    place(img: HTMLImageElement) {
        this.img = img
        const {dx, dy, dw, dh} = this
        this.draw(dx, dy, dw, dh)
    }

    setWH(dw: number, dh: number) {
        this.draw(this.dx, this.dy, dw, dh)
    }

    get width() {
        return this.wh().width
    }

    get height() {
        return this.wh().height
    }

    get scale() {
        return this.dw / this.width
    }

    get ratio() {
        return this.img.width / this.img.height
    }

    private wh() {
        let width = this.canvas.width
        let height = this.canvas.width / this.ratio
        if (height > this.canvas.height) {
            height = this.canvas.height
            width = this.canvas.height * this.ratio
        }
        return { width: width, height: height }
    }
}

export interface _CanvasImage {
    dx: number;
    dy: number;
    dw: number;
    dh: number;
}