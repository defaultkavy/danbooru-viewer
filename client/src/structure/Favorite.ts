import type { Booru } from "./Booru";
import type { User } from "./User";

export interface Favorite extends FavoriteData {}
export class Favorite {
    booru: Booru;
    constructor(booru: Booru, data: FavoriteData) {
        Object.assign(this, data);
        this.booru = booru;
    }

    static async fetchUserFavorites(booru: Booru, user: User, query: string, limit: number = 100, page: number | string) {
        const dataArray = await booru.fetch<FavoriteData[]>(`/favorites.json?${query}&${`search[user_id]=${user.id}`}&limit=${limit}&page=${page}`);
        return dataArray.map(data => {
            user.favorites.add(data.post_id);
            return data.post_id;
        })
    }

    update(data: FavoriteData) {
        Object.assign(this, data)
        return this;
    }
}

export interface FavoriteData {
    id: id;
    post_id: id;
    user_id: id;
}