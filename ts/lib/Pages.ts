import Client from "./Client.js";
import { GridPage } from "./GridPage.js";
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
        this.homePage = new GridPage({title: '', url: ''}, this.client)
        this.postPage = new PostPage({title: '', url: '#post'}, this.client)
        this.history = []
        this.history.push(this.homePage)
        this.forwardHistory = []

        window.onpopstate = (e) => {
            this.back()
        }
    }

    openTag(value: string) {
        const page = new GridPage({title: value, url: `#${value}`, search: {param: 'tags', value: value}}, this.client)
        this.client.app.append(page.node)
        this.homePage.node.remove()
        this.homePage.unsetAutoUpdate()
        this.achived()
        page.load()
        this.go(page, '#' + value)
    }

    openPost(post: Post) {
        this.client.pages.go(this.client.pages.postPage, '#post')
        this.postPage.open(post)
    }

    achived() {
        document.body.style.overflow = 'auto'
        const lastPage = this.history[this.history.length - 1]
        if (lastPage instanceof GridPage) {
            lastPage.close()
        }
    }

    go(page: Page, url: string) {
        this.history.push(page)
        this.forwardHistory = []
        window.history.pushState(page.title, document.title, url)
    }

    forward() {
        const page = this.forwardHistory.shift()
        if (!page) return
        page.unachived()
        if (!(page instanceof PostPage)) this.achived()
        this.history.push(page)
    }

    back() {
        const lastPage = this.history[this.history.length - 1]
        if (!lastPage) return
        lastPage.close()
        this.forwardHistory.unshift(this.history.pop()!) // lastPage === this.history.pop()
        const backPage = this.history[this.history.length - 1]
        if (backPage) {
            backPage.unachived()
        }
    }
}