import { _Post } from "@booru";
import { Booru } from "./Booru.js";
import Client from "./Client.js";
import { Tags } from "./Tags.js";

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
    tags: Tags;
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
        this.tags = new Tags(booru, client)
        this.source = post[booru._post.source]
        this.ext = post[booru._post.ext]
    }

    fetch() {
        this.booru.posts.get(this.id)
    }

    async fetchTags() {
        await this.tags.get(this.tagsArray)
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