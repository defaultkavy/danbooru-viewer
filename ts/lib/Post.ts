import { _Post } from "@booru";
import { Booru } from "./Booru.js";
import Client from "./Client.js";
import { Tag } from "./Tag.js";

export class Post {
    client: Client;
    booru: Booru;
    id: number
    data: _Post
    height: number;
    width: number;
    file_url: string;
    large_file_url: string;
    preview_file_url: string;
    tags: Map<string, Tag | undefined>;
    source: string;
    ext: string;
    constructor(post: _Post, booru: Booru, client: Client) {
        this.client = client
        this.booru = booru
        this.id = post.id
        this.data = post
        this.height = post[booru._post.height]
        this.width = post[booru._post.width]
        this.file_url = post[booru._post.file_url]
        this.large_file_url = post[booru._post.large_file_url]
        this.preview_file_url = post[booru._post.preview_file_url]
        this.tags = new Map()
        this.source = post[booru._post.source]
        this.ext = post[booru._post.ext]
    }

    fetch() {
        this.booru.posts.get(this.id)
    }

    async fetchTags() {
        const tags = await this.booru.tags.get(this.tagsArray)
        if (!tags) return
        for (const tag of tags) {
            this.tags.set(tag.name, tag)
        }
    }

    get tagsArray() {
        return this.data[this.booru._post.tags].split(' ')
    }

    get ratio() {
        return this.width / this.height
    }

    get isLandscape() {
        return this.ratio > 1 ? true : false
    }
}