import anime from "../plugin/anime.js"
import { AnimeInstance } from "../plugin/anime.js";
import Client from "./Client.js";
import { Grid } from "./Grid.js";
import { GridElement } from "./GridElement.js";
import { Post } from "./Post.js";

export class PostGridElement extends GridElement {
    id: number;
    post: Post;
    scaleAn?: AnimeInstance
    borderAn? : AnimeInstance
    mouseleaveFn: () => void;
    mouseupFn: (e: MouseEvent) => false | undefined;
    img: HTMLImageElement;
    p: HTMLParagraphElement;
    constructor(post: Post, parent: Grid, element: HTMLElement, client: Client) {
        super({ height: post.height, width: post.width},
            parent, element, client)
        this.id = post.id
        this.post = post
        this.img = document.createElement('img')
        this.p = document.createElement('p')
        this.mouseleaveFn = this.mouseleave.bind(this)
        this.mouseupFn = this.mouseup.bind(this)
        
        this.node.addEventListener('mouseenter', this.mouseenter.bind(this))
        this.node.addEventListener('touchstart', this.mouseenter.bind(this), {passive: false})
        this.node.addEventListener('click', this.click.bind(this))
        this.node.addEventListener('mousedown', this.mousedown.bind(this))
        this.loadImage()
    }

    block() {
        this.img.style.opacity = '0'
        this.p.innerText = `${this.order} - ${this.id}`
        this.node.append(this.p)
    }

    private loadImage() {
        this.img.src = this.post.large_file_url
        this.img.width = this.post.width
        this.img.height = this.post.height
        this.img.loading = 'lazy'
        this.node.append(this.img)
    }

    private click(e: MouseEvent) {
        if (e.ctrlKey) {
            this.select(false)
        } else if (e.shiftKey) {
            const lastSelected = this.grid.selected[this.grid.selected.length - 1]
            this.grid.elements.get(this.id)
        } else {
            const history = this.grid.selectedHistory
            //if (this.selected && history[history.length - 1] && history[history.length - 1].length === 1) 
            if (!this.selected) {
                this.grid.unselectAll()
                this.select()
            }
            else this.client.pages.openPost(this.post)
        }
    }

    private mousedown(e: MouseEvent) {
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.025
        })
        this.node.addEventListener('mouseup', this.mouseupFn)
        if (e.button === 1) {
            e.preventDefault()
        }
    }

    private mouseup(e: MouseEvent) {
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.05
        })
        if (e.button === 1) {
            window.open(`https://${this.client.booru.host}/posts/${this.post.id}`, '_blank')
            return false
        }
        this.node.removeEventListener('mouseup', this.mouseupFn)
    }

    private mouseenter() {
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 800,
            scale: 1.05
        })
        this.node.addEventListener('mouseleave', this.mouseleaveFn)
        this.node.addEventListener('touchend', this.mouseleaveFn)
    }

    private mouseleave() {
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.0,
        })
        this.node.removeEventListener('mouseleave', this.mouseleaveFn)
        this.node.removeEventListener('touchend', this.mouseleaveFn)
    }
}