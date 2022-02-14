var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Db {
    constructor(client) {
        this.loadDb();
    }
    init() {
        if (!this.valid())
            return;
        console.debug(this.db.transaction('fav', 'readwrite').objectStore('books').put({ title: 'blah', author: 'bl', isbn: 92 }));
    }
    fav(post) {
        if (!this.valid())
            return;
        this.db.transaction('fav', 'readwrite').objectStore('fav').put({ id: post.id, tags: post.tagsArray });
    }
    valid() {
        if (this.db)
            return true;
        else
            return false;
    }
    loadDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const req = indexedDB.open('danbooru-viewer', 4);
                req.onsuccess = e => {
                    console.debug(2);
                    this.db = req.result;
                    resolve(req.result);
                };
                req.onupgradeneeded = e => {
                    console.debug(1);
                    this.db = req.result;
                    const store = this.db.createObjectStore("fav", { keyPath: "id" });
                };
            });
        });
    }
}
//# sourceMappingURL=Db.js.map