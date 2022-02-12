import { _Post } from "@booru";
import { Booru } from "./Booru.js";
import Client from "./Client.js";
import { Post } from "./Post.js";

export class Posts {
    client: Client;
    booru: Booru;
    caches: Map<number, Post>
    constructor(booru: Booru, client: Client) {
        this.client = client
        this.booru = booru
        this.caches = new Map()
    }

    async get(id: number): Promise<Post> {
        const newPost = async () => {
            const path = `/${this.booru._post.path}/${id}.json`
            const _post = await this.booru.get(path)
            const cache = this.caches.get(id)
            const post = cache ? cache : new Post(_post, this.booru, this.client)
            this.caches.set(id, post)
            this.sort()
            return post
        }
        return newPost()
    }

    async index(page: number = 1, post?: BooruPost) {
        if (page < 1) throw new Error('page number must greater than 0')
        page = Math.floor(page)
        const path = `/${this.booru._post.path}.json?${post ? `post[${post.param}]=${post.value}&` : ''}page=${page}&limit=40`
        if (page === 1) this.client.footer.push(`Getting newest information...`)
        else this.client.footer.push(`Getting page ${page} information...`)

        const index: _Post[] = await this.booru.get(path)
        if (!index) {
            if (page === 1) this.client.footer.push(`Updated.`)
            else this.client.footer.push(`Lastest post.`)
            return undefined
        }
        const posts: Post[] = []
        for (const _post of index) {
            if (this.caches.has(_post.id)) continue
            const booruCache = this.booru.posts.caches.get(_post.id)
            const post = new Post(_post, this.booru, this.client)
            if (!post.id) continue

            this.client.footer.push(`Loading post: ${_post.id}...`)

            if (!booruCache) this.booru.posts.caches.set(_post.id, post)
            this.caches.set(_post.id, post)
            posts.push(post)

            this.client.footer.push(`Loaded post: ${_post.id}`)
        }
        this.sort()
        //this.booru.posts.sort()
        let buffer = 0
        for (let i = 0; i < posts.length; i++) {
            if (i % 10 === 0) {
                await posts[i].fetchTags().then(() => buffer = 0)
            } else {
                posts[i].fetchTags().then(() => buffer += 1)
            }

            this.client.footer.push(`Loading tags (${i + 1}/${posts.length})`)
        }
        this.client.footer.push(`Loaded posts: ${posts.length}.`)
        return posts
    }

    get array() {
        return Array.from(this.caches.values())
    }

    get latest() {
        return this.array.sort((a, b) => b.id - a.id)[0]
    }

    private sort() {
        const arr = this.array
        arr.sort((a, b) => b.id - a.id)
        this.caches.clear()
        arr.forEach(post => this.caches.set(post.id, post))
    }

    // unuse
    private async getTags(posts: Post[]) {
        const _tagArray: string[] = []
        for (const post of posts) {
            const _tags = post.data.tag_string.split(' ')
            for (const _tag of _tags) {
                if (_tagArray.includes(_tag)) continue
                _tagArray.push(_tag)
            }
        }
        return await this.booru.tags.get(_tagArray)
    }
}

export interface BooruPost {
    param: 'tags',
    value: string
}