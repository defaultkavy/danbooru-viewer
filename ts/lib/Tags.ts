import { Booru } from "./Booru.js";
import Client from "./Client.js";
import { Tag } from "./Tag.js";

export class Tags {
    client: Client;
    caches: Map<string, Tag>;
    booru: Booru;
    constructor(booru: Booru, client: Client) {
        this.client = client
        this.booru = booru
        this.caches = new Map()
    }

    async get(names: string[]) {
        let nameString: string = ''
        names.forEach(name => nameString += `${name} `)
        const tags = async () => {
            const path = `/${this.booru._tag.path}.json?search[name_space]=${nameString}&limit=999`
            const _tags = await this.booru.get(path)
            if (!_tags) {
                this.client.notifier.push('Post tag load failed', 5000)
                return null
            }
            const tags: Tag[] = []
            for (const _tag of _tags) {
                const cache = this.caches.get(_tag.id)
                const tag = cache ? cache.refresh(_tag) : new Tag(_tag, this.booru, this.client)
                this.caches.set(_tag.name, tag)
                tags.push(tag)
            }
            return tags
        }
        return tags()
    }

    async index(page: number = 1) {
        if (page < 1) throw new Error('page number must greater than 0')
        page = Math.floor(page)
        const path = `/${this.booru._tag.path}.json?page=${page}`
        const index = await this.booru.get(path)
        const tags: Tag[] = []
        for (const _tag of index) {
            const post = new Tag(_tag, this.booru, this.client)
            //if (!post.id) continue
            this.caches.set(_tag.id, post)
            tags.push(post)
        }
        return tags
    }
}