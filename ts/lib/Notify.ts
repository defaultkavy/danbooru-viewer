import anime from "../plugin/anime.js";
import Client from "./Client.js";

export class Notify {
    client: Client;
    node: HTMLElement;
    content: string;
    duration?: number;
    constructor(_notify: _Notify, client: Client) {
        this.client = client
        this.node = document.createElement('this.node-element')
        this.content = _notify.content
        this.duration = _notify.duration

    }

    init() {
        this.node.style.marginTop = `-${this.node.offsetHeight + 80}px`
        this.node.innerText = this.content
        this.node.append(this.node)

        if (this.duration) {
            setInterval(() => {
                this.node.remove()
                this.client.notifier.caches.delete(this.content)
            }, this.duration)
        }

        anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 1000,
            marginTop: 20
        })
    }
}

export interface _Notify {
    content: string,
    duration?: number
}