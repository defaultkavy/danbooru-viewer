import { removeAllChild } from "../plugin/extension.js";
import Client from "./Client.js";
import { Post } from "./Post.js";
import { TagButton } from "./TagButton.js";

export class TagsPanel {
    client: Client;
    node: HTMLElement;
    post: Post;
    title?: string;
    id: string;
    category: _tagCategory;
    tags: Map<string, TagButton>;
    constructor(_panel: _Panel, post: Post, client: Client) {
        this.client = client
        this.node = document.createElement('tags-panel')
        this.id = _panel.id
        this.post = post
        this.title = _panel.title
        this.node.id = this.id
        this.category = _panel.category
        this.tags = new Map()
        this.init()
    }

    init() {
        removeAllChild(this.node)
    }

    async load() {
        if (this.title) {
            const title = document.createElement('panel-title')
            title.innerText = this.title
            this.node.append(title)
        }
        const tagWrapper = document.createElement('panel-tags')
        this.node.append(tagWrapper)
        for (const tag of this.post.tags.values()) {
            if (!tag) return
            if (tag.category === this.category) {
                const tagButton = new TagButton(tag, this.client)
                tagWrapper.append(tagButton.node)
                this.tags.set(tag.name, tagButton)
            }
        }
    }
}

export interface _Panel {
    id: string;
    title?: string
    category: _tagCategory
}

export enum _tagCategory {
    'General' = 0,
    'Artist' = 1,
    'Copyright' = 3,
    'Character' = 4,
    'Meta' = 5
}