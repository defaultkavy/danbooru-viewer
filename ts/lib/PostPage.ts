import anime, { AnimeInstance } from "../plugin/anime.js";
import { AnimatedViewer } from "./AnimatedViewer.js";
import Client from "./Client.js";
import { ImageViewer } from "./ImageViewer.js";
import { Page, _Page } from "./Page.js";
import { Post } from "./Post.js";
import { VideoPlayer } from "./VideoPlayer.js";

export class PostPage extends Page {
    opacityAn?: AnimeInstance
    opened: boolean;
    scaleAn?: anime.AnimeInstance;
    post?: Post;
    viewer: ImageViewer
    img?: HTMLImageElement
    lastLoad?: Post
    loadFn: () => void;
    player: VideoPlayer;
    anViewer: AnimatedViewer;
    constructor(_page: _Page, client: Client) {
        super(_page, document.createElement('booru-post'), client)
        this.opened = false
        this.viewer = new ImageViewer()
        this.player = new VideoPlayer()
        this.anViewer = new AnimatedViewer()
        
        this.viewer.canvas.addEventListener('mouseup', this.click.bind(this))
        this.node.addEventListener('wheel', this.scroll.bind(this), {passive: false})
        this.loadFn = this.load.bind(this)
    }

    init() {
        if (this.opacityAn) this.opacityAn.pause()
    }

    open(post: Post) {
        this.init()
        this.opened = true
        this.post = post
        this.client.app.append(this.node)
        if (post.ext === 'jpg' || post.ext === 'png') {
            this.anViewer.img.remove()
            this.player.node.remove()
            this.node.append(this.viewer.canvas)
            this.viewer.load(post.large_file_url)
        } else if (post.ext === 'gif' || post.ext === 'apng') {
            this.player.node.remove()
            this.viewer.canvas.remove()
            this.node.append(this.anViewer.img)
            this.anViewer.load(post.file_url)
        } else {
            this.anViewer.img.remove()
            this.viewer.canvas.remove()
            this.node.append(this.player.node)
            if (this.post.ext === 'zip') this.player.load(post.large_file_url)
            else this.player.load(post.file_url)
        }
    }

    close() {
        this.node.remove()
        this.opened = false
    }

    unachived(): void {
        this.opened = true
        this.client.app.append(this.node)
        this.node.append(this.viewer.canvas)
    }

    private load() {
        if (!this.img) return
        this.viewer.replace(this.img)
    }

    private click(e: MouseEvent) {
        switch (e.button) {
            case 1:
                if (!this.post) return
                open(this.post.file_url, 'blank')
                return
            break;
            case 2:
                this.client.pages.back()
            break;
        }
    }

    private scroll() {
        if (!this.post) return
        if (this.lastLoad === this.post) return
        if (this.img) this.img.removeEventListener('load', this.loadFn)
        this.lastLoad = this.post
        this.img = new Image()
        this.img.src = this.post.file_url
        this.img.addEventListener('load', this.loadFn)
    }
}