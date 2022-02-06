import { AnimeInstance } from "../plugin/anime.js";
import Client from "./Client.js";

export class Page {
    client: Client;
    node: HTMLElement;
    scrollAn?: AnimeInstance
    url: string;
    title: string;
    scrollTop: number
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
    }
}

export interface _Page {
    title: string
    url: string
}