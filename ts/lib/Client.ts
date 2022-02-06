import { Booru, _Booru } from "./Booru.js"
import { Footer } from "./Footer.js"
import { KeyHandle } from "./KeyHandle.js"
import { Mouse } from "./Mouse.js"
import { Notifier } from "./Notifier.js"
import { Pages } from "./Pages.js"

const dan: _Booru = {
    host: 'danbooru.donmai.us',
    post: {
        ext: 'file_ext',
        file_url: 'file_url',
        preview_file_url: 'preview_file_url',
        height: 'image_height',
        width: 'image_width',
        large_file_url: 'large_file_url',
        path: 'posts',
        source: 'source',
        tags: 'tag_string',
        origin: 'posts'
    },
    tag: {
        category: 'category',
        name: 'name',
        path: 'tags'
    }

}
const sakuga: _Booru = {
    host: 'www.sakugabooru.com',
    post: {
        ext: 'file_ext',
        file_url: 'file_url',
        preview_file_url: 'preview_url',
        height: 'jpeg_height',
        width: 'jpeg_width',
        large_file_url: 'preview_url',
        path: 'post',
        source: 'source',
        tags: 'tags',
        origin: 'post/show'
    },
    tag: {
        category: 'category',
        name: 'name',
        path: 'tag'
    }

}

export default class Client {
    booru: Booru
    pages: Pages
    app: HTMLElement
    key: KeyHandle
    mouseX: number
    mouseY: number
    notifier: Notifier
    footer: Footer
    mouse: Mouse
    constructor() {
        //window.history.pushState(null, '', `/`)
        this.app = document.querySelector('app') as HTMLElement
        this.footer = new Footer(this)
        this.booru = new Booru(dan, this)
        this.pages = new Pages(this)
        this.key = new KeyHandle(this)
        this.notifier = new Notifier(this)
        this.mouse = new Mouse()
        this.mouseX = 0
        this.mouseY = 0
        this.init()
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.x
            this.mouseY = e.y
        })
        document.oncontextmenu = (e) => e.preventDefault()
    }

    init() {
        this.app.append(this.pages.homePage.node)
        this.pages.homePage.load()
        this.footer.updateLocation()
        this.key.init()
    }
}