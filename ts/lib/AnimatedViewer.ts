export class AnimatedViewer {
    img: HTMLImageElement;
    constructor() {
        this.img = document.createElement('img') as HTMLImageElement
    }

    load(url: string) {
        this.img.src = url
        
    }
}