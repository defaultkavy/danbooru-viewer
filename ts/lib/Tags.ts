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
                const get = this.booru.tags.caches.get(_tag.name)
                if (get) {
                    this.caches.set(_tag.name, get)
                    tags.push(get)
                    continue
                }
                const cache = this.caches.get(_tag.name)
                const tag = cache ? cache.refresh(_tag) : new Tag(_tag, this.booru, this.client)
                this.caches.set(_tag.name, tag)
                tags.push(tag)
            }
            return tags
        }
        return tags()
    }

    async search(name: string) {
        const path = `/${this.booru._tag.path}.json?search[fuzzy_name_matches]=${name}&search[hide_empty]=true&search[order]=similarity&limit=999`
        this.client.footer.push(`Searching ${name}...`)
        const _tags = await this.booru.get(path)
        if (!_tags) {
            this.client.notifier.push('Search tag load failed', 5000)
            return null
        }
        const tags: Tag[] = []
        for (const _tag of _tags) {
            const get = this.booru.tags.caches.get(_tag.name)
            if (get) {
                this.caches.set(_tag.name, get)
                tags.push(get)
                continue
            }
            const cache = this.caches.get(_tag.name)
            const tag = cache ? cache.refresh(_tag) : new Tag(_tag, this.booru, this.client)
            this.caches.set(_tag.name, tag)
            if (!get) this.booru.tags.caches.set(_tag.name, tag)
            tags.push(tag)
        }
        this.client.footer.push(`Searched ${name}`)
        return tags
    }

    get array() {
        return Array.from(this.caches.values())
    }
}