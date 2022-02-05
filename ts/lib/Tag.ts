import { Booru } from "./Booru.js";
import Client from "./Client.js";

export class Tag {
    client: Client;
    booru: Booru;
    data: _Tag;
    name: string;
    category: number;
    constructor(_tag: _Tag, booru: Booru, client: Client) {
        this.client = client
        this.booru = booru
        this.name = _tag.name
        this.category = _tag.category
        this.data = _tag
    }

    refresh(_tag: any) {
        this.data = _tag
        return this
    }
}

export interface _Tag {
    id: number;
    name: string;
    post_count: number;
    category: number;
    created_at: string;
    updated_at: string;
    is_locked: boolean;
  }
  