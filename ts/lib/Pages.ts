import Client from "./Client.js";
import { GridPage } from "./GridPage.js";
import { OptionsPage } from "./OptionsPage.js";
import { Page } from "./Page.js";
import { Post } from "./Post.js";
import { PostPage } from "./PostPage.js";

export class Pages {
    client: Client;
    homePage: GridPage;
    postPage: PostPage;
    history: Page[];
    forwardHistory: Page[];
    constructor(client: Client) {
        this.client = client
        this.homePage = new GridPage({title: 'Home', url: ''}, this.client)
        this.postPage = new PostPage({title: 'Post', url: ''}, this.client)
        this.history = []
        this.history.push(this.homePage)
        this.forwardHistory = []

        window.onpopstate = (e) => {
            if (window.history.state.pageCount < this.history.length - 1) this.back()
            if (window.history.state.pageCount > this.history.length - 1) this.forward()
        }
    }

    openTag(value: string) {
        const page = new GridPage({title: value, url: `#${value}`, search: {param: 'tags', value: value}}, this.client)
        this.client.app.append(page.node)
        this.achived()
        page.load()
        this.go(page)
    }

    openPost(post: Post) {
        this.client.pages.go(this.client.pages.postPage)
        this.postPage.open(post)
    }

    openOptions() {
        const page = new OptionsPage({title: 'Options', url: ''}, this.client)
        this.client.pages.go(page)
        page.open()
    }

    achived() {
        document.body.style.overflow = 'auto'
        const lastPage = this.history[this.history.length - 1]
        console.debug(lastPage)
        if (lastPage instanceof GridPage) {
            lastPage.achived()
        }
        if (lastPage instanceof OptionsPage) {
            lastPage.achived()
            this.history[this.history.length - 2].achived()
        }
    }

    go(page: Page) {
        this.history.push(page)
        this.forwardHistory = []
        window.history.pushState({title: page.title, pageCount: this.history.length - 1}, document.title, page.url)
        this.client.footer.updateLocation()
    }

    forward() {
        const page = this.forwardHistory.shift()
        if (!page) return
        if (!(page instanceof PostPage)) this.achived()
        page.unachived()
        this.history.push(page)
        this.client.footer.updateLocation()
    }

    back() {
        const lastPage = this.history[this.history.length - 1]
        if (!lastPage) return
        lastPage.close()
        this.forwardHistory.unshift(this.history.pop()!) // lastPage === this.history.pop()
        const backPage = this.history[this.history.length - 1]
        if (backPage) {
            if (backPage instanceof OptionsPage) {
                this.history[this.history.length - 2].unachived()
                backPage.unachived()
            }
            else backPage.unachived()
        }
        this.client.footer.updateLocation()

        // backPage.node.scrollTo({top: backPage.scrollTop}) // Scroll to history top
    }

    locationCheck() {
        const hash = window.location.hash
        window.history.replaceState({title: 'Home', pageCount: 0}, document.title, `${window.location.pathname}`)
        // if (hash) {
        //     this.openTag(hash.slice(1, hash.length))
        // }
    }
}