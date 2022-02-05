import anime from "../plugin/anime.js";
import Client from "./Client.js";
import { GridPage } from "./GridPage.js";
import { Page } from "./Page.js";
import { Post } from "./Post.js";
import { PostGridElement } from "./PostGridElement.js";
import { PostPage } from "./PostPage.js";

export class Footer {
    client: Client;
    node: HTMLElement;
    log: HTMLElement;
    counter: HTMLElement;
    dlButton: HTMLElement;
    dlPosts: Post[];
    #colorAn?: anime.AnimeInstance
    dimension: HTMLElement;
    constructor(client: Client) {
        this.client = client
        this.node = document.createElement('booru-footer')
        this.log = document.createElement('footer-log')
        this.counter = document.createElement('footer-counter')
        this.dlButton = document.createElement('footer-download')
        this.dlPosts = []
        this.dimension = document.createElement('footer-dimension')
        document.body.append(this.node)
        this.node.append(this.log)
        this.node.append(this.counter)
        this.node.append(this.dlButton)

        this.dlButton.onclick = this.dlButtonClick.bind(this)
        this.dlButton.onmouseenter = this.dlButtonMouseenter.bind(this)
        this.dlButton.onmouseleave = this.dlButtonMouseleave.bind(this)

    }

    push(content: string) {
        this.log.innerText = content
    }

    updateCounter(gridPage: GridPage) {
        if (gridPage.grid.selected[0]) {
            this.counter.innerText = `${gridPage.grid.selected.length}/${gridPage.posts.array.length} posts seleted`
        } else 
        this.counter.innerText = `${gridPage.posts.array.length} posts`
    }

    updateDlButton(page: Page) {
        if (page instanceof GridPage) {
            if (page.grid.selected[0] instanceof PostGridElement) {
                this.dlPosts = []
                this.dlButton.innerText = 'Download Full Image'
                this.dlPosts.push(page.grid.selected[0].post)
                console.debug(page.grid.selected[0].post.file_url)
            }
        }
    }

    updateDimension(gridPage: GridPage) {
        if (gridPage.grid.selected[0]) {
            this.node.append(this.dimension)
            this.dimension.innerText = `w: ${gridPage.grid.selected[0].width} h: ${gridPage.grid.selected[0].height}`
        } else this.dimension.remove()
    }

    private async dlButtonClick() {
        const image = await fetch(this.dlPosts[0].file_url)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)

        const link = document.createElement('a')
        link.href = imageURL
        link.download = ''
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    private dlButtonMouseenter() {
        this.dlButton.style.transition = 'none'
        if (this.#colorAn) this.#colorAn.pause()
        this.#colorAn = anime({
            targets: this.dlButton,
            easing: 'easeOutQuint',
            duration: 500,
            backgroundColor: 'rgba(155, 155, 155, 1)',
            color: '#000000',
            complete: () => {
                this.dlButton.style.transition = ''
            }
        })
    }
    
    private dlButtonMouseleave() {
        this.dlButton.style.transition = 'none'
        if (this.#colorAn) this.#colorAn.pause()
        this.#colorAn = anime({
            targets: this.dlButton,
            easing: 'easeOutQuint',
            duration: 500,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: '#ffffff',
            complete: () => {
                this.dlButton.style.transition = ''
            }
        })
    }
}