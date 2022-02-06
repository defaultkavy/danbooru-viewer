var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Posts } from "./Posts.js";
import { Tags } from "./Tags.js";
export class Booru {
    constructor(booru, client) {
        this.client = client;
        this.host = booru.host;
        this._post = booru.post;
        this._tag = booru.tag;
        this.posts = new Posts(this, client);
        this.tags = new Tags(this, client);
    }
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://${this.host}${path}`;
            return yield fetch(url).then((res) => __awaiter(this, void 0, void 0, function* () {
                const json = yield res.json();
                return json;
            })).catch(() => {
                this.client.notifier.push(`Connect to ${this.host} failed.`, 5000);
            });
        });
    }
    // unuse
    post(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const xhttp = new XMLHttpRequest();
                const url = `http://localhost:5500/post`;
                const booruData = {
                    search: {
                        name: 'girl'
                    },
                    _method: 'get'
                };
                const requestOption = {
                    host: `${this.host}`,
                    path: path,
                    data: booruData
                };
                xhttp.open('POST', url, true);
                xhttp.setRequestHeader('Content-Type', 'application/json');
                xhttp.onreadystatechange = function () {
                    if (this.readyState != 4)
                        reject();
                    if (this.status === 200) {
                        console.debug(this.response);
                        resolve(JSON.parse(this.response));
                    }
                };
                xhttp.send(JSON.stringify(requestOption));
            });
        });
    }
}
//# sourceMappingURL=Booru.js.map