import Client from "./Client.js"
import { Tag } from "./Tag.js"
import { TagsPanel } from "./TagsPanel.js"

export class Searchbar {
    node: HTMLElement
    target: HTMLElement
    tagPanel: TagsPanel
    client: Client
    wrapper: HTMLElement
    tags: Tag[]
    constructor(target: HTMLElement, client: Client) {
        this.node = document.createElement('booru-search')
        this.node.spellcheck = false
        this.node.contentEditable = 'true'
        this.client = client
        this.target = target
        this.wrapper = document.createElement('search-result')
        this.tagPanel = new TagsPanel({id: 'search-tag-panel'}, client)
        this.tags = []
        this.node.addEventListener('input', this.input.bind(this))
    }

    load() {
        this.target.append(this.node)
        this.target.append(this.wrapper)
        this.wrapper.append(this.tagPanel.node)
    }

    private async input() {
        if (this.node.innerHTML === '') {
            this.tagPanel.init()
            this.tags = []
            return
        }
        const tags = await this.client.booru.tags.search(this.node.innerText)
        if (tags) this.tagPanel.load(tags)
    }
}