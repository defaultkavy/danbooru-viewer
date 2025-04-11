import { $EventManager } from "elexis";
import type { Booru } from "./Booru";
import { Favorite, type FavoriteData } from "./Favorite";
import { User, type UserData } from "./User";
import type { Post } from "./Post";

export interface ClientUser extends ClientUserData {}
export class ClientUser extends User {
    apiKey: string;
    favorite_count$ = $.state(0);
    forum_post_count$ = $.state(0);
    static events = new $EventManager<ClientUserEventMap>()
    constructor(booru: Booru, apiKey: string, data: ClientUserData) {
        super(booru, data, false);
        this.apiKey = apiKey;
        this.update$();
    }

    update$() {
        super.update$();
        this.forum_post_count$?.set(this.forum_post_count);
        this.favorite_count$?.set(this.favorite_count);
    }

    async init() {
        await this.fetchFavorites();
        
    }

    async fetchFavorites() {
        const oldestId = Array.from(this.favorites.keys()).at(-1);
        const list = await Favorite.fetchUserFavorites(this.booru, this, ``, 1000, oldestId ? `b${oldestId}` : 1);
        ClientUser.events.fire('favoriteUpdate', this);
        if (list.length >= 1000) this.fetchFavorites();
        return list;
    }

    static get storageUserData() { const data = localStorage.getItem('user_data'); return data ? JSON.parse(data) as ClientUserStoreData : null }
    static set storageUserData(data: ClientUserStoreData | null) { localStorage.setItem('user_data', JSON.stringify(data)) }
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

export interface ClientUserStoreData {
    username: string;
    apiKey: string;
}

export interface ClientUserEventMap {
    favoriteUpdate: [user: ClientUser]
}