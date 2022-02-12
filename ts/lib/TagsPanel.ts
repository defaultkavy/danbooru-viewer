import { removeAllChild } from "../plugin/extension.js";
import Client from "./Client.js";
import { Post } from "./Post.js";
import { Tag } from "./Tag.js";
import { TagButton } from "./TagButton.js";

export class TagsPanel {
    client: Client;
    node: HTMLElement;
    title?: string;
    id: string;
    category?: _tagCategory;
    tagButtons: Map<string, TagButton>;
    tags: Tag[]
    constructor(_panel: _Panel, client: Client) {
        this.client = client
        this.node = document.createElement('tags-panel')
        this.id = _panel.id
        this.title = _panel.title
        this.node.id = this.id
        this.category = _panel.category
        this.tagButtons = new Map()
        this.tags = []
        this.init()
    }

    init() {
        this.tags = []
        removeAllChild(this.node)
    }

    async load(tags: Tag[]) {
        this.init()
        this.tags = tags
        if (this.title) {
            const title = document.createElement('panel-title')
            title.innerText = this.title
            this.node.append(title)
        }
        const tagWrapper = document.createElement('panel-tags')
        this.node.append(tagWrapper)
        for (const tag of tags) {
            if (this.category !== undefined && tag.category !== this.category) continue
            const tagButton = new TagButton(tag, this.client)
            tagWrapper.append(tagButton.node)
            this.tagButtons.set(tag.name, tagButton)
        }
    }
}

export interface _Panel {
    id: string;
    title?: string
    category?: _tagCategory
}

export enum _tagCategory {
    'General' = 0,
    'Artist' = 1,
    'Copyright' = 3,
    'Character' = 4,
    'Meta' = 5
}