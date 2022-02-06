import anime from "../plugin/anime.js";
import { removeAllChild } from "../plugin/extension.js";
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
    address: HTMLElement;
    constructor(client: Client) {
        this.client = client
        this.node = document.createElement('booru-footer')
        this.log = document.createElement('footer-log')
        this.counter = document.createElement('footer-counter')
        this.address = document.createElement('footer-address')
        this.dlButton = document.createElement('footer-download')
        this.dlPosts = []
        this.dimension = document.createElement('footer-dimension')
        document.body.append(this.node)
        this.node.append(this.counter)
        this.node.append(this.address)
        this.node.append(this.log)

        this.dlButton.onclick = this.dlButtonClick.bind(this)
        this.dlButton.onauxclick = this.dlButtonAuxclick.bind(this)
        this.dlButton.onmouseenter = this.dlButtonMouseenter.bind(this)
        this.dlButton.onmouseleave = this.dlButtonMouseleave.bind(this)

    }

    push(content: string) {
        this.log.innerText = content
    }

    updateCounter(page: Page) {
        const subfix = '|'
        if (page instanceof GridPage) {
            if (page.grid.selected[0]) {
                this.counter.innerText = `${page.grid.selected.length}/${page.posts.array.length} posts ${subfix}`
            } else 
            this.counter.innerText = `${page.posts.array.length} posts ${subfix}`
        }
    }

    updateLocation() {
        removeAllChild(this.address)
        const history = this.client.pages.history
        for (let i = history.length - 3; i < history.length; i++) {
            if (i < 0) continue
            const location = document.createElement('location')
            const direnct = document.createElement('direct')
            if (i === history.length - 3) location.innerText = '...'
            else location.innerText = history[i].title
            direnct.innerText = ' > '
            this.address.append(location)
            this.address.append(direnct)
            location.addEventListener('click', () => {
                const h = (this.client.pages.history.length - 1) - this.client.pages.history.indexOf(history[i])
                for (let i = 0; i < h; i++) {
                    window.history.back()
                }
            })
        }
    }

    updateDlButton(page: Page) {
        if (page instanceof GridPage) {
            if (page.grid.selected[0] instanceof PostGridElement) {
                this.node.append(this.dlButton)
                this.dlPosts = []
                this.dlButton.innerText = 'Download Full Image'
                this.dlPosts.push(page.grid.selected[0].post)
            } else {
                this.dlButton.remove()
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
        link.download = `${this.dlPosts[0].id}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    private dlButtonAuxclick(e: MouseEvent) {
        if (e.button === 1) {
            open(this.dlPosts[0].file_url, '_blank')
        }
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