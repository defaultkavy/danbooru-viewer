import Client from "./Client.js";
import { Detail } from "./Detail.js";
import { Grid } from "./Grid.js";
import { Page, _Page } from "./Page.js";
import { Post } from "./Post.js";
import { BooruPost, Posts } from "./Posts.js";
import { Scrollbar } from "./Scrollbar.js";

export class GridPage extends Page {
    grid: Grid;
    update_interval: number;
    page_count: number;
    update_count: number;
    update_ticker?: NodeJS.Timer
    latestPost: Post | undefined;
    buffering: boolean
    detail: Detail;
    elements: any[];
    posts: Posts;
    search?: BooruPost;
    scrollFn: () => Promise<void>;
    constructor(_gridPage: _GridPage, client: Client) {
        super(_gridPage, document.createElement('booru-page'), client)
        this.search = _gridPage.search
        this.posts = new Posts(this.client.booru, this.client)
        this.elements = this.posts.array
        this.grid = new Grid(this.elements, document.createElement('booru-grid'), this, this.client)
        this.detail = new Detail(this, client)
        // Parameter
        this.update_interval = 10000
        this.update_count = 0 // auto update images count
        this.page_count = 1
        this.latestPost = undefined
        this.buffering = false // image loading
        this.scrollFn = this.scroll.bind(this)
        window.addEventListener('resize', this.resize.bind(this))
    }

    async load() {
        this.node.style.opacity = '0'
        this.node.appendChild(this.grid.node)
        this.resize()
        await this.getImages()
        this.opacity(1)
        // Generate grid
        this.setAutoUpdate()

        this.node.addEventListener('scroll', this.scrollFn)
    }

    close() {
        this.unsetAutoUpdate()
        this.node.removeEventListener('scroll', this.scrollFn)
        this.opacity(0).then(() => {
            this.node.remove()
        })
    }

    unachived(): void {
        if (!this.node.isConnected) {
            this.client.app.append(this.node)
            this.resize()
            this.node.scrollTo({top: this.scrollTop})
            this.opacity(1)
        }
        if (this.node.scrollTop === 0) this.setAutoUpdate()
        this.node.addEventListener('scroll', this.scrollFn)
    }

    achived(): void {
        this.unsetAutoUpdate()
        this.node.removeEventListener('scroll', this.scrollFn)
        this.detail.slide(120)
        this.opacity(0).then(() => {
            this.node.remove()
        })
    }

    async update(times: number = 1) {
        const posts = await this.posts.index(times, this.search)
        if (!posts) return this.client.notifier.push('update posts failed.', 3000)
        const newestPost = this.posts.array.pop()
        if (!this.latestPost || !newestPost) throw new Error("update posts failed");

        posts.forEach(post => {
            this.update_count += 1
            if (this.update_count >= 40) {
                this.update_count = 0
                this.page_count + 1
            }
        })
        if (newestPost.id - this.latestPost.id >= 40) {
            this.update(times + 1)
            return
        }
        this.latestPost = this.posts.latest
        this.grid.update(this.posts.array, true).forEach(ele => {
            ele.onselect = this.eleOnselect.bind(this)
            ele.onunselect = this.eleOnunselect.bind(this)
        }) // add listener to update footer
        this.client.footer.updateCounter(this)
    }

    async getImages() {
        this.buffering = true
        // Get newest booru images
        await this.posts.index(this.page_count, this.search)
        this.page_count += 1
        this.latestPost = this.posts.latest
        this.grid.update(this.posts.array).forEach(ele => {
            ele.onselect = this.eleOnselect.bind(this)
            ele.onunselect = this.eleOnunselect.bind(this)
        }) // add listener to update footer
        this.buffering = false
        this.client.footer.updateCounter(this)
    }

    setAutoUpdate() {
        // Update every interval
        if (this.update_ticker) return // prevent scrolling re-trigger
        this.update_ticker = setInterval(this.update.bind(this), this.update_interval)
    }

    unsetAutoUpdate() {
        if (!this.update_ticker) return
        clearInterval(this.update_ticker)
        this.update_ticker = undefined
    }

    private async scroll() {
        const y = this.node.scrollTop

        // Auto load images when scoll to btm
        if (y > this.grid.node.clientHeight - window.innerHeight * 2) {
            if (!this.buffering) await this.getImages()
        }

        // disable auto update images
        if (y > 0) {
            this.unsetAutoUpdate()
        }

        if (y === 0) {
            this.setAutoUpdate()
        }
    }

    private resize() {
        const elementMax = this.node.getBoundingClientRect().width < 500 ? 200 : 300
        const columnsCount = Math.round(this.node.getBoundingClientRect().width / elementMax)
        this.grid.init(columnsCount)
    }

    private eleOnselect() {
        this.client.footer.updateCounter(this)
        this.client.footer.updateDlButton(this)
        this.client.footer.updateDimension(this)
    }
    
    private eleOnunselect() {
        this.client.footer.updateCounter(this)
        this.client.footer.updateDlButton(this)
        this.client.footer.updateDimension(this)
    }
}

export interface _GridPage {
    title: string,
    url: string,
    search?: BooruPost
}