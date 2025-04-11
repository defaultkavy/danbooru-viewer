import type { Booru } from "./Booru";

export class UserOptions {}
export interface User extends UserOptions, UserData {}
export class User {
    name$ = $.state('...');
    post_upload_count$ = $.state(0);
    level$ = $.state(10);
    level_string$ = $.state('...');
    booru: Booru;
    favorites = new Set<id>();
    constructor(booru: Booru, data: UserData, update$: boolean = true) {
        this.booru = booru;
        Object.assign(this, data);
        if (update$) this.update$();
    }

    static async fetch(booru: Booru, id: username): Promise<User>;
    static async fetch(booru: Booru, id: id): Promise<User>;
    static async fetch(booru: Booru, id: id | username) {
        let data: UserData;
        if (typeof id === 'string') {
            const res = (await booru.fetch<UserData[]>(`/users.json?search[name]=${id}`)).at(0);
            if (!res) throw 'User Not Found';
            return data = res;
        } else data = await booru.fetch<UserData>(`/users/${id}.json`);
        const instance = booru.users.get(data.id)?.update(data) ?? new this(booru, data);
        booru.users.set(instance.id, instance);
        return instance;
    }

    static async fetchMultiple(booru: Booru, search?: Partial<UserSearchParam>, limit = 200) {
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
        const dataArray = await booru.fetch<UserData[]>(`/users.json?limit=${limit}${searchQuery}`);
        const list = dataArray.map(data => {
            const instance = new this(booru, data);
            booru.users.set(instance.id, instance);
            return instance;
        });
        return list;
    }

    update(data: UserData) {
        Object.assign(this, data);
        this.update$();
        return this;
    }

    update$() {
        this.name$.set(this.name);
        this.post_upload_count$.set(this.post_upload_count);
        this.level$.set(this.level);
        this.level_string$.set(this.level_string);
    }

    get booruURL() { return `${this.booru.origin}/users/${this.id}`}
    get url() { return `/users/${this.id}`}
}

export enum UserLevel {
    Restricted = 10,
    Member = 20,
    Gold = 30,
    Platinum = 31,
    Builder = 32,
    Contributor = 35,
    Approver = 37,
    Moderater = 40,
    Admin = 50
}
export interface UserData {
    "id": id,
    "name": username,
    "level": UserLevel,
    "inviter_id": id,
    "created_at": ISOString,
    "post_update_count": number,
    "note_update_count": number,
    "post_upload_count": number,
    "is_deleted": boolean,
    "level_string": keyof UserLevel,
    "is_banned": boolean,
}

export interface UserSearchParam {
    id: NumericSyntax<id>;
    level: NumericSyntax<UserLevel>;
    post_upload_count: NumericSyntax<number>;
    post_update_count: NumericSyntax<number>;
    note_update_count: NumericSyntax<number>;
    favorite_count: NumericSyntax<number>;
    created_at: NumericSyntax<ISOString>;
    updated_at: NumericSyntax<ISOString>;
    name: TextSyntax<username>;
    inviter: UserSyntax;
    name_matches: string;
    min_level: UserLevel;
    max_level: UserLevel;
    current_user_first: boolean;
    order: 'name' | 'post_upload_count' | 'post_update_count' | 'note_update_count';
}