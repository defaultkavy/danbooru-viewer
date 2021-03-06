export class VideoPlayer {
    node: HTMLVideoElement;
    constructor() {
        this.node = document.createElement('video') as HTMLVideoElement

        this.node.autoplay = true
        this.node.loop = true
    }

    load(url: string) {
        this.node.src = url
    }
}