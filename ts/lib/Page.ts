import anime from "../plugin/anime.js";
import { AnimeInstance } from "../plugin/anime.js";
import Client from "./Client.js";

export class Page {
    client: Client;
    node: HTMLElement;
    scrollAn?: AnimeInstance
    url: string;
    title: string;
    scrollTop: number
    #scaleAn?: anime.AnimeInstance
    #opacityAn?: anime.AnimeInstance
    constructor(_page: _Page, node: HTMLElement, client: Client) {
        this.client = client
        this.node = node
        this.url = _page.url
        this.title = _page.title
        this.scrollTop = 0
        this.node.addEventListener('scroll', () => {
            this.scrollTop = this.node.scrollTop
        })
    }

    close() {
        this.node.remove()
    }

    unachived() {
        this.client.app.append(this.node)
        this.opacity(1)
    }

    achived() {
        this.opacity(0).then(() => {
            this.node.remove()
        })
    }

    async scale(scale: number): Promise<void> {
        return new Promise(resolve => {
            if (this.#scaleAn) this.#scaleAn.pause()
            this.#scaleAn = anime({
                targets: this.node,
                easing: 'easeOutQuint',
                duration: 300,
                scale: scale,
                complete: () => {
                    resolve()
                }
            })
        })
    }

    async opacity(opacity: number): Promise<void> {
        return new Promise(resolve => {
            if (this.#opacityAn) this.#opacityAn.pause()
            this.#opacityAn = anime({
                targets: this.node,
                easing: 'easeOutQuint',
                duration: 300,
                opacity: opacity,
                complete: () => {
                    resolve()
                }
            })
        })
    }
}

export interface _Page {
    title: string
    url: string
}