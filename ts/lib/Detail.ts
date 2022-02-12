import anime from "../plugin/anime.js";
import { AnimeInstance } from "../plugin/anime.js";
import { removeAllChild } from "../plugin/extension.js";
import Client from "./Client.js";
import { GridPage } from "./GridPage.js";
import { PostGridElement } from "./PostGridElement.js";
import { TagsPanel } from "./TagsPanel.js";

export class Detail {
    client: Client;
    node: HTMLElement;
    page: GridPage;
    preview: HTMLElement;
    panel: HTMLElement;
    heightAn?: AnimeInstance
    mouseenterFn: () => void;
    mouseleaveFn: () => void;
    hovered: boolean;
    touchmoveFn: (e: TouchEvent) => void;
    #touch_top: { x: number; y: number; };
    #touchstart: { x: number; y: number; };
    #touchmove: { x: number; y: number; };
    slided: number;
    #freeze: boolean;
    wrapper: HTMLElement;
    constructor(page: GridPage, client: Client) {
        this.client = client
        this.node = document.createElement('booru-detail')
        this.page = page
        this.preview = document.createElement('detail-preview')
        this.panel = document.createElement('detail-panel')
        this.wrapper = document.createElement('detail-block')
        this.hovered = false
        this.#touch_top =  {x: 0,y: 0}
        this.#touchstart = {x: 0,y: 0}
        this.#touchmove =  {x: 0,y: 0}
        this.#freeze = false
        this.slided = 0

        this.mouseenterFn = this.mouseenter.bind(this)
        this.mouseleaveFn = this.mouseleave.bind(this)
        this.touchmoveFn = this.touchmove.bind(this)

        this.node.addEventListener('mouseenter', this.mouseenterFn)
        this.node.addEventListener('touchstart', this.touchstart.bind(this), {passive: false})
        this.node.addEventListener('touchend', this.touchend.bind(this))
    }

    open(elements: PostGridElement[]) {
        if (this.page.grid.selected.length > 1) return this.close()
        this.page.node.append(this.node)
        this.node.append(this.panel)
        this.loadPanel(elements)
        this.loadPreview(elements)
        
        if (!this.hovered) {
            this.slide(120)
        }
    }

    async close(force = false): Promise<void> {
        return new Promise(resolve => {
            if (force === true || !this.hovered) {
                if (this.heightAn) this.heightAn.pause()
                this.heightAn = anime({
                    targets: this.node,
                    easing: 'easeOutQuint',
                    duration: 500,
                    height: '0px',
                    complete: () => {
                        this.node.remove()
                        resolve()
                    }
                })
            }
        })
    }

    loadPanel(elements: PostGridElement[]) {
        removeAllChild(this.wrapper)
        if (elements.length === 1) {
            const main = document.createElement('main-tags-panel')
            const sub = document.createElement('sub-tags-panel')
            const artistPanel = new TagsPanel({
                category: 1,
                id: 'artist-tag-panel',
                title: 'Artist'
            }, this.client)
            artistPanel.load(elements[0].post.tags.array)
            if (artistPanel.tagButtons.size !== 0) main.append(artistPanel.node)

            const characterPanel = new TagsPanel({
                category: 4,
                id: 'character-tag-panel',
                title: 'Character'
            }, this.client)
            characterPanel.load(elements[0].post.tags.array)
            if (characterPanel.tagButtons.size !== 0) main.append(characterPanel.node)
            
            const copyrightPanel = new TagsPanel({
                category: 3,
                id: 'character-tag-panel',
                title: 'Copyright'
            }, this.client)
            copyrightPanel.load(elements[0].post.tags.array)
            if (characterPanel.tagButtons.size !== 0) main.append(copyrightPanel.node)
            
            if (main.children[0]) this.wrapper.append(main)

            const generalPanel = new TagsPanel({
                category: 0,
                id: 'general-tag-panel',
                title: 'General'
            }, this.client)
            generalPanel.load(elements[0].post.tags.array)
            if (generalPanel.tagButtons.size !== 0) sub.append(generalPanel.node)

            if (sub.children[0]) this.wrapper.append(sub)
        }
        this.panel.append(this.wrapper)
    }

    async slide(height: number, shadow?: string) {
        return new Promise<void>(resolve => {
            this.slided = height
            if (this.heightAn) this.heightAn.pause()
            this.heightAn = anime({
                targets: this.node,
                easing: 'easeOutQuint',
                duration: 500,
                height: height,
                boxShadow: shadow,
                complete: () => {
                    resolve()
                }
            })
        })
    }

    freeze() {
        this.#freeze = true
    }

    unfreeze() {
        this.#freeze = false
    }

    loadPreview(elements: PostGridElement[]) {
        removeAllChild(this.preview)
        this.node.append(this.preview)
        if (elements.length === 1) {
            const isVideo = elements[0].post.large_file_url.endsWith('mp4') || elements[0].post.large_file_url.endsWith('webm')
            if (isVideo) {
                const video = document.createElement('video') as HTMLVideoElement
                video.src = elements[0].post.large_file_url
                this.preview.append(video)
            } else {
                const img = document.createElement('img') as HTMLImageElement
                img.src = elements[0].post.large_file_url
                this.preview.append(img)
            }
        }

    }

    private mouseenter() {
        this.hovered = true
        document.body.style.overflow = 'hidden'
        if (this.heightAn) this.heightAn.pause()
        this.slide(window.innerHeight / 2)
        this.node.addEventListener('mouseleave', this.mouseleaveFn)
    }

    private mouseleave() {
        if (this.#freeze) return
        this.hovered = false
        document.body.style.overflow = 'auto'
        if (this.heightAn) this.heightAn.pause()
        if (this.page.grid.selected[0]) this.slide(120)
        else this.close()
        this.node.removeEventListener('mouseleave', this.mouseleaveFn)
    }

    private touchstart(e: TouchEvent) {
        this.#touchstart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }
        this.#touch_top = {
            x: e.touches[0].clientX - this.node.offsetWidth,
            y: e.touches[0].clientY - this.node.offsetTop
        }
        this.slide(this.node.clientHeight + 10, 'rgba(147, 255, 255, 255) 0px 0px 20px')
        this.node.addEventListener('touchmove', this.touchmoveFn, {passive: false})
    }

    private touchmove(e: TouchEvent) {
        e.preventDefault()
        if (this.heightAn) this.heightAn.pause()
        const height = window.innerHeight - e.touches[0].clientY + this.#touch_top.y
        this.node.style.height = `${height > window.innerHeight ? window.innerHeight : height}px`

        this.#touchmove = {
            x: this.#touchstart.x - e.touches[0].clientX,            
            y: this.#touchstart.y - e.touches[0].clientY            
        }
    }

    private touchend() {
        if (this.#touchmove.y > 100) {
            if (this.node.clientHeight > 100) this.slide(window.innerHeight / 2, 'rgba(147, 255, 255, 0) 0px 0px 0px')
            if (this.node.clientHeight > window.innerHeight / 2) this.slide(window.innerHeight, 'rgba(147, 255, 255, 0) 0px 0px 0px')
        }
        if (this.#touchmove.y < -100) {
            if (this.node.clientHeight < window.innerHeight) this.slide(window.innerHeight / 2, 'rgba(147, 255, 255, 0) 0px 0px 0px')
            if (this.node.clientHeight < window.innerHeight / 2) this.slide(120, 'rgba(147, 255, 255, 0) 0px 0px 0px')
        }
        if (this.#touchmove.y < -200) {
            this.slide(120, 'rgba(147, 255, 255, 0) 0px 0px 0px')
        } 
        
        if (this.#touchmove.y <= 100 && this.#touchmove.y >= -100) {
            if (this.node.clientHeight < 150) this.slide(120, 'rgba(147, 255, 255, 0) 0px 0px 0px')
            else this.slide(window.innerHeight / 2, 'rgba(147, 255, 255, 0) 0px 0px 0px')
        }
        this.node.removeEventListener('touchmove', this.touchmoveFn)
        this.#touchmove =  {x: 0,y: 0}
    }
}