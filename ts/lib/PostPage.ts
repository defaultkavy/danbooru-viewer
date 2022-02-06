import anime, { AnimeInstance } from "../plugin/anime.js";
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
    constructor(_page: _Page, client: Client) {
        super(_page, document.createElement('booru-post'), client)
        this.opened = false
        this.viewer = new ImageViewer()
        this.player = new VideoPlayer()
        
        this.node.addEventListener('click', this.click.bind(this))
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
            this.player.node.remove()
            this.node.append(this.viewer.canvas)
            this.viewer.load(post.large_file_url)
        } else {
            this.viewer.canvas.remove()
            this.node.append(this.player.node)
            this.player.load(post.file_url)
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

    private click() {
        //this.close()
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