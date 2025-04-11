import type { Booru } from "./Booru";

export interface ArtistCommentary extends ArtistCommentaryData {}
export class ArtistCommentary {
    static manager = new Map<id, ArtistCommentary>();
    constructor(data: ArtistCommentaryData) {
        Object.assign(this, data);
    }

    static async fetch(booru: Booru, id: id) {
        const data = await booru.fetch<ArtistCommentaryData>(`/artist_commentaries/${id}.json`);
        const post = new this(data);
        return post;
    }

    static async fetchMultiple(booru: Booru, search?: Partial<ArtistCommentarySearchParams>, limit = 200) {
        let searchQuery = '';
        if (search) {
            for (const [key, val] of Object.entries(search)) {
                if (val instanceof Array) searchQuery += `&search[${key}]=${val}`;
                else if (val instanceof Object) {
                    for (const [ckey, cval] of Object.entries(val)) {
                        searchQuery += `&search[${key}${ckey}]=${cval}`
                    }
                }
                else searchQuery += `&search[${key}]=${val}`
            }
        }
        const dataArray = await booru.fetch<ArtistCommentaryData[]>(`/artist_commentaries.json?limit=${limit}${searchQuery}`);
        const list = dataArray.map(data => {
            const instance = new this(data);
            this.manager.set(instance.id, instance);
            return instance;
        });
        return list;
    }
}

export interface ArtistCommentaryData {
    "id": id,
    "post_id": id,
    "original_title": string,
    "original_description": string,
    "translated_title": string,
    "translated_description": string,
    "created_at": ISOString,
    "updated_at": ISOString
}

export interface ArtistCommentarySearchParams {
    id: NumericSyntax<id>;
    created_at: NumericSyntax<ISOString>;
    updated_at: NumericSyntax<ISOString>;
    original_title: TextSyntax<string>;
    original_description: TextSyntax<string>;
    translated_title: TextSyntax<string>;
    translated_description: TextSyntax<string>;
    post: PostSyntax;
    text_matches: string;
    original_present: boolean;
    translated_present: boolean;
    is_deleted: 'yes' | 'no';
}