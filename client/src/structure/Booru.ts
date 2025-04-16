import { $EventManager, type $EventMap } from "elexis";
import type { Post } from "./Post";
import type { Tag } from "./Tag";
import { User, type ClientUser, type ClientUserData } from "./User";
import type { Favorite } from "./Favorite";
import { $Notify } from "../component/$Notify";

export interface BooruOptions {
    origin: string;
    name: string;
}
export interface Booru extends BooruOptions {}
export class Booru {
    static used: Booru;
    static events = new $EventManager<BooruStaticEventMap>();
    static name$ = $.state(this.name);
    static manager = new Map<string, Booru>()
    user: ClientUser = User.partial(this, 0) as ClientUser;
    posts = new Map<id, Post>();
    tags = new Map<id, Tag>();
    users = new Map<id, User>();
    favorites = new Map<id, Favorite>();
    constructor(options: BooruOptions) {
        Object.assign(this, options);
        if (this.origin.endsWith('/')) this.origin = this.origin.slice(0, -1);
        Booru.manager.set(this.name, this);
    }

    static set(booru: Booru) {
        this.used = booru;
        this.name$.set(booru.name);
        this.storageAPI = booru.name;
        const userdata = User.storageUserData;
        if (userdata) booru.login(userdata.username, userdata.apiKey);
        this.events.fire('set');
        return this;
    }

    static get storageAPI() { return localStorage.getItem('booru_api'); }
    static set storageAPI(name: string | null) { if (name) localStorage.setItem('booru_api', name); else localStorage.removeItem('booru_api') }

    async fetch<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', errMessage?: string) {
        try {
            const auth = this.user.isClient() ? `${endpoint.includes('?') ? '&' : '?'}login=${this.user.name}&api_key=${this.user.apiKey}` : '';
            const data = await fetch(`${this.origin}${endpoint}${auth}`, {
                method: method,
            }).then(res => res.json()) as any;
            if (data.success === false) throw data.message;
            return data as T;
        } catch(err) {
            $Notify.push(errMessage ?? 'Fetch Data From Danbooru API Failed.')
            throw err
        }
    }


    async login(username: string, apiKey: string) {
        const data = await this.fetch<ClientUserData>(`/profile.json?login=${username}&api_key=${apiKey}`, 'GET');
        Object.assign(this.user, data);
        this.user.apiKey = apiKey;
        this.user.init();
        this.user.update$();
        this.users.set(this.user.id, this.user);
        this.user.events.fire('ready', this.user);
        Booru.events.fire('login', this.user as ClientUser);
        $Notify.push(`Welcome, ${this.user.name}`)
        return this.user;
    }

    logout() {
        this.user = User.partial(this, -1) as ClientUser;
        User.storageUserData = null;
        Booru.events.fire('logout');
        return this
    }

}

interface BooruStaticEventMap extends $EventMap {
    set: [];
    login: [user: ClientUser];
    logout: [];
}

interface BooruEventMap extends $EventMap {
}