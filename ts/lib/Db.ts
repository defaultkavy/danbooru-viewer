import Client from "./Client.js";
import { Post } from "./Post.js";

export class Db {
    db?: IDBDatabase;
    constructor(client: Client) {
        this.loadDb()
    }

    init() {
        if (!this.valid()) return
        console.debug(this.db.transaction('fav', 'readwrite').objectStore('books').put({title: 'blah', author: 'bl', isbn: 92}))
    }

    fav(post: Post) {
        if (!this.valid()) return
        this.db.transaction('fav', 'readwrite').objectStore('fav').put({id: post.id, tags: post.tagsArray})
    }

    valid(): this is Valid {
        if (this.db) return true
        else return false
    }

    private async loadDb(): Promise<IDBDatabase> {
        return new Promise(resolve => {
            const req = indexedDB.open('danbooru-viewer', 4)
            req.onsuccess = e => {
                console.debug(2)
                this.db = req.result
                resolve(req.result)
            }

            req.onupgradeneeded = e => {
                console.debug(1)
                this.db = req.result
                const store = this.db.createObjectStore("fav", {keyPath: "id"});
            }
        })
    }
}

interface Valid {
    db: IDBDatabase
}