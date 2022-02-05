import anime from "../plugin/anime.js";
import Client from "./Client.js";
import { Tag } from "./Tag.js";

export class TagButton {
    node: HTMLElement;
    tag: Tag;
    scaleAn?: anime.AnimeInstance
    #mouseupFn: () => void;
    client: Client;
    constructor(tag: Tag, client: Client) {
        this.client = client
        this.tag = tag
        this.node = document.createElement('booru-tag')
        this.#mouseupFn = this.mouseup.bind(this)

        this.node.innerText = this.tag.name
        this.node.onmouseenter = this.mouseenter.bind(this)
        this.node.onmouseleave = this.mouseleave.bind(this)
        this.node.onmousedown = this.mousedown.bind(this)
    }

    private mouseenter() {
        this.node.style.zIndex = '1'
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            scale: {
                value: 1 / (this.node.clientWidth / (this.node.clientWidth + 20)),
                duration: 500,
                easing: 'easeOutQuint'
            },
            boxShadow: {
                value: 'rgba(147, 255, 255, 255) 0px 0px 10px',
                duration: 500,
                delay: 400,
                easing: 'easeOutQuint'
            }
        })
    }

    private mouseleave() {
        this.node.style.zIndex = '0'
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1,
            boxShadow: 'rgba(147, 255, 255, 0) 0px 0px 0px'
        })
    }

    private mousedown() {
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 0.9,
            boxShadow: 'rgba(147, 255, 255, 255) 0px 0px 5px'
        })
        this.node.addEventListener('mouseup', this.#mouseupFn)
    }

    private mouseup() {
        if (this.scaleAn) this.scaleAn.pause()
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.2,
            boxShadow: 'rgba(147, 255, 255, 255) 0px 0px 10px'
        })

        this.client.pages.openTag(this.tag.name)
    }
}