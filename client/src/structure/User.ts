import { Booru } from "./Booru";
import { Favorite } from "./Favorite";

export class UserOptions {}
export interface User extends UserOptions, UserData {}
export class User {
    id$ = $.state(0);
    name$ = $.state('...');
    post_upload_count$ = $.state(0);
    note_update_count$ = $.state(0);
    pool_version_count$ = $.state(0);
    artist_commentary_version_count$ = $.state(0);
    artist_version_count$ = $.state(0);
    favorite_group_count$ = $.state(0);
    flag_count$ = $.state(0);
    forum_post_count$ = $.state(0);
    post_update_count$ = $.state(0);
    wiki_page_version_count$ = $.state(0);
    level$ = $.state(10);
    level_string$ = $.state('...');
    created_date$ = $.state('...')
    booru: Booru;
    favorites = new Set<id>();
    favorite_count$ = $.state(0);
    is_client = false;
    apiKey: string | null = null;
    static events = $.events<ClientUserEventMap>()
    events = $.events<{ready: [User]}>()
    ready: Promise<User> = new Promise(resolve => this.events.once('ready', () => resolve(this)))
    favorite_count = 0;
    constructor(booru: Booru, data: UserData, update$: boolean = true) {
        this.booru = booru;
        Object.assign(this, data);
        if (update$) this.update$();
    }

    static partial(booru: Booru, id: id) {
        const user = new User(booru, {id} as any, false);
        return user;
    }

    async fetch() {
        const res = (await this.booru.fetch<UserData[]>(`/users.json?search[id]=${this.id}`)).at(0);
        if (!res) throw 'User Not Found';
        this.update(res);
        this.booru.users.set(this.id, this);
        this.events.fire('ready', this);
        return this;
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

    async init() {
        await this.fetchFavorites();
    }

    async fetchFavorites() {
        const oldestId = Array.from(this.favorites.keys()).at(-1);
        const list = await Favorite.fetchUserFavorites(this.booru, this, ``, 1000, oldestId ? `b${oldestId}` : 1);
        User.events.fire('favoriteUpdate', this);
        this.favorite_count = this.favorites.size;
        this.update$();
        if (list.length >= 1000) this.fetchFavorites();
        return list;
    }

    update(data: UserData) {
        Object.assign(this, data);
        this.update$();
        return this;
    }

    update$() {
        this.id$.value(this.id);
        this.name$.value(this.name);
        this.post_upload_count$.value(this.post_upload_count);
        this.level$.value(this.level);
        this.level_string$.value(this.level_string);
        this.created_date$.value(new Date(this.created_at).toLocaleDateString('en', {dateStyle: 'medium'}))
        this.favorite_count$.value(this.favorite_count);
    }

    get booruURL() { return `${this.booru.origin}/users/${this.id}`}
    get url() { return `/users/${this.id}`}

    isClient(): this is ClientUser {
        return !!this.apiKey
    }

    static get storageUserData() { const data = localStorage.getItem('user_data'); return data ? JSON.parse(data) as ClientUserStoreData : null }
    static set storageUserData(data: ClientUserStoreData | null) { localStorage.setItem('user_data', JSON.stringify(data)) }
}

export interface ClientUser extends User, ClientUserData {}

export interface ClientUserStoreData {
    username: string;
    apiKey: string;
}

export interface ClientUserEventMap {
    favoriteUpdate: [user: User]
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

export interface ClientUserData extends UserData {
    "last_logged_in_at": ISOString,
    "last_forum_read_at": ISOString,
    "comment_threshold": number,
    "updated_at": ISOString,
    "default_image_size": "large" | "original",
    "favorite_tags": null | string,
    "blacklisted_tags": string,
    "time_zone": string,
    "favorite_count": number,
    "per_page": number,
    "custom_style": string,
    "theme": "auto" | "light" | "dark",
    "receive_email_notifications": boolean,
    "new_post_navigation_layout": boolean,
    "enable_private_favorites": boolean,
    "show_deleted_children": boolean,
    "disable_categorized_saved_searches": boolean,
    "disable_tagged_filenames": boolean,
    "disable_mobile_gestures": boolean,
    "enable_safe_mode": boolean,
    "enable_desktop_mode": boolean,
    "disable_post_tooltips": boolean,
    "requires_verification": boolean,
    "is_verified": boolean,
    "show_deleted_posts": boolean,
    "statement_timeout": number,
    "favorite_group_limit": 10 | 100,
    "tag_query_limit": 2 | 6,
    "max_saved_searches": 250,
    "wiki_page_version_count": number,
    "artist_version_count": number,
    "artist_commentary_version_count": number,
    "pool_version_count": number | null,
    "forum_post_count": number,
    "comment_count": number,
    "favorite_group_count": number,
    "appeal_count": number,
    "flag_count": number,
    "positive_feedback_count": number,
    "neutral_feedback_count": number,
    "negative_feedback_count": number
}
