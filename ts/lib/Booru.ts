import Client from "./Client.js";
import { Posts } from "./Posts.js";
import { Tags } from "./Tags.js";
export class Booru {
    client: Client
    host: string
    posts: Posts;
    tags: Tags;
    _post: _post;
    _tag: _tag;
    constructor(booru: _Booru, client: Client) {
        this.client = client
        this.host = booru.host
        this._post = booru.post
        this._tag = booru.tag
        this.posts = new Posts(this, client)
        this.tags = new Tags(this, client)
    }

    async get(path: string) {
        const url = `https://${this.host}${path}`
        return await fetch(url).then(async res => {
            const json = await res.json()
            return json
        }).catch(() => {
            this.client.notifier.push(`Connect to ${this.host} failed.`, 5000)
        })
    }

    // unuse
    async post(path: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest()
            const url = `http://localhost:5500/post`
            const booruData = {
                search: {
                    name: 'girl'
                },
                _method: 'get'
            }
            const requestOption = {
                host: `${this.host}`,
                path: path,
                data: booruData
            }
            xhttp.open('POST', url, true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
    
            xhttp.onreadystatechange = function () {
                if (this.readyState != 4) reject()
    
                if (this.status === 200) {
                    console.debug(this.response)
                    resolve(JSON.parse(this.response))
                }
            }
            xhttp.send(JSON.stringify(requestOption))
        })
    }
}

export interface _Booru {
    host: string,
    post: _post,
    tag: _tag
}

type _post = {
    path: string,
    height: string,
    width: string,
    file_url: string,
    preview_file_url: string,
    large_file_url: string,
    source: string,
    ext: string
    tags: string,
    origin: string
}

type _tag = {
    path: string,
    name: string,
    category: string
}