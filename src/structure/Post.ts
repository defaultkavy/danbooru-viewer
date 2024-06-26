import { $ } from "elexis";
import type { Booru } from "./Booru";
import { Tag } from "./Tag";
import { User } from "./User";
import { dateFrom } from "./Util";
export interface PostOptions {}
export interface Post extends PostData {}
export class Post {
    static manager = new Map<id, Post>();
    uploader$ = $.state(this.uploader?.name$ ?? this.uploader_id?.toString());
    approver$ = $.state(this.approver?.name$ ?? this.approver_id?.toString() ?? 'None');
    created_date$ = $.state(``);
    favorites$ = $.state(this.fav_count);
    score$ = $.state(this.score);
    constructor(data: PostData) {
        Object.assign(this, data);
        this.update$();
    }

    static async fetch(booru: Booru, id: id) {
        const data = await fetch(`${booru.api}/posts/${id}.json`).then(async data => await data.json()) as PostData;
        const instance = this.manager.get(data.id)?.update(data) ?? new this(data);
        this.manager.set(instance.id, instance);
        User.fetchMultiple(booru, {id: [instance.uploader_id, instance.approver_id].detype(null)}).then(() => instance.update$());
        return instance;
    }

    static async fetchMultiple(booru: Booru, tags?: Partial<MetaTags> | string, limit = 20) {
        let tagsQuery = '';
        if (tags) {
            if (typeof tags === 'string') tagsQuery = tags;
            else {
                tagsQuery += '&tags='
                for (const [key, val] of Object.entries(tags)) {
                    if (key === 'tags') { tagsQuery += `${val}`; continue; }
                    if (tagsQuery.at(-1) !== '=') tagsQuery += ' '; // add space between tags
                    tagsQuery += `${key}:${val}`
                }
            }
        }
        const req = await fetch(`${booru.api}/posts.json?limit=${limit}${tagsQuery}&_method=get`);
        const dataArray: PostData[] = await req.json();
        const list = dataArray.map(data => {
            const instance = this.manager.get(data.id)?.update(data) ?? new this(data);
            this.manager.set(instance.id, instance);
            return instance;
        });
        if (!list.length) return list;
        const userIds = [...new Set(dataArray.map(data => [data.approver_id, data.uploader_id].detype(null)).flat())];
        User.fetchMultiple(booru, {id: userIds}).then(() => list.forEach(post => post.update$()));
        return list;
    }

    update$() {
        this.uploader$.set(this.uploader?.name$ ?? this.uploader_id.toString());
        this.approver$.set(this.approver?.name$ ?? this.approver_id?.toString() ?? 'None');
        this.created_date$.set(dateFrom(+new Date(this.created_at)));
        this.favorites$.set(this.fav_count);
        this.score$.set(this.score);
    }

    update(data: PostData) {
        Object.assign(this, data);
        this.update$();
        return this;
    }

    get pathname() { return `/posts/${this.id}` }
    get uploader() { return User.manager.get(this.uploader_id); }
    get approver() { if (this.approver_id) return User.manager.get(this.approver_id); else return null }
    get isVideo() { return this.file_ext === 'mp4' || this.file_ext === 'webm' || this.file_ext === 'zip' }
    get tags() { 
        const tag_list = this.tag_string.split(' ');
        return [...Tag.manager.values()].filter(tag => tag_list.includes(tag.name))
    }
}

export interface PostData extends PostOptions {
    "id": id,
    "created_at": ISOString,
    "uploader_id": id,
    "score": number,
    "source": string,
    "md5": string,
    "last_comment_bumped_at": timestamp | null,
    "rating": 'g' | 's' | 'q' | 'e' | null,
    "image_width": number,
    "image_height": number,
    "tag_string": string,
    "fav_count": number,
    "file_ext": FileType,
    "last_noted_at": null | timestamp,
    "parent_id": null | id,
    "has_children": boolean,
    "approver_id": null | id,
    "tag_count_general": number,
    "tag_count_artist": number,
    "tag_count_character": number,
    "tag_count_copyright": number,
    "file_size": number,
    "up_score": number,
    "down_score": number,
    "is_pending": boolean,
    "is_flagged": boolean,
    "is_deleted": boolean,
    "tag_count": number,
    "updated_at": ISOString,
    "is_banned": boolean,
    "pixiv_id": null | id,
    "last_commented_at": null | timestamp,
    "has_active_children": boolean,
    "bit_flags": number,
    "tag_count_meta": number,
    "has_large": boolean,
    "has_visible_children": boolean,
    "media_asset": MediaAssetData,
    "tag_string_general": string,
    "tag_string_character": string,
    "tag_string_copyright": string,
    "tag_string_artist": string,
    "tag_string_meta": string,
    "file_url": string,
    "large_file_url": string,
    "preview_file_url": string
}

export interface MediaAssetData {
    "id": id,
    "created_at": ISOString,
    "updated_at": ISOString,
    "md5": string,
    "file_ext": FileType,
    "file_size": number,
    "image_width": number,
    "image_height": number,
    "duration": number,
    "status": "active",
    "file_key": string,
    "is_public": boolean,
    "pixel_hash": string,
    "variants": MediaAssetVariant[];
}

export interface MediaAssetVariant {
    "type": "original" | "720x720" | "360x360" | "180x180",
    "url": string,
    "width": number,
    "height": number,
    "file_ext": FileType
}

export interface MetaTags {
    /** Search tags */
    'tags': string;
    /** Search for posts uploaded by the user  */
    'user': username;
    /** Search for posts not uploaded by the user  */
    '-user': username;
    /** Search for posts favorited by the user  */
    'fav': username;
    /** Search for posts not favorited by the user  */
    '-fav': username;
    /** Search for posts favorited by the user ordered in the order they were favorited in, instead of by the date they were uploaded.  */
    'ordfav': username;
    /** Search for posts with at least favorites. */
    'favcount': NumericBasicSyntax<number>;
    /** Order search results. */
    'order': 'favcount' | 'comm' | 'comment' | 'comment_bumped' | 'note' | 'artcomm' | 'id' | 'id_asc' | 'id_desc' | 'custom' | 'score' | 'score_asc' | 'rank' | 'downvotes' | 'upvotes' | 'changes' | 'md5' | 'landscape' | 'protrait' | 'mpixels' | 'mpixels_asc' | 'filesize';
    /** Search for posts that were approved by the user. */
    'approver': UserSyntax;
    /** Search for posts that were not approved by the user. */
    '-approver': username;
    /** Search for posts that were commented on by the user. */
    'commenter': UserSyntax;
    /** Search for posts that were commented on by the user. */
    'comm': UserSyntax;
    /** Search for posts with comments saying string */
    'comment': string;
    /** Search for posts that have had notes created by the user. */
    'noter': UserSyntax;
    /** Search for posts that have had notes updated by the user. */
    'notepdater': username;
    /** Search for posts with notes saying string. */
    'note': string;
    /** Search for posts by status. */
    'status': PostStatus;
    '-status': PostStatus;
    /** Search for posts that have ever been flagged by user (mod only; normal users may only search for flags created by themselves). */
    'flagger': UserSyntax;
    'appeals': UserSyntax;
    'commentary': boolean | 'translated' | 'untranslated' | string
    'commentaryupdater': username;
    'favgroup': string;
    '-favgroup': string;
    'ordfavgroup': string;
    /** Search for posts in the saved search named string. */
    'search': string;
    'id': NumericBasicSyntax<id>;
    'date': NumericBasicSyntax<DateType>;
    'age': NumericBasicSyntax<PeriodType>;
    'rating': Rating | Rating[];
    '-rating': Rating | Rating[];
    'source': Source;
    'pixiv': NumericBasicSyntax<id> | 'any';
    'parent': id | `any`;
    '-parent': id;
    'child': 'none' | 'any';
    'tagcount': NumericBasicSyntax<number>;
    'gentags': NumericBasicSyntax<number>;
    'arttags': NumericBasicSyntax<number>;
    'chartags': NumericBasicSyntax<number>;
    'copytags': NumericBasicSyntax<number>;
    'metatags': NumericBasicSyntax<number>;
    'score': NumericBasicSyntax<number>;
    'downvotes': NumericBasicSyntax<number>;
    'upvotes': NumericBasicSyntax<number>;
    'disapproved': 'disinterest' | 'breaks_rules' | 'poor_quality' | username;
    'md5': string;
    'width': NumericBasicSyntax<number>;
    'height': NumericBasicSyntax<number>;
    'ratio': NumericBasicSyntax<Ratio>;
    'mpixels': NumericBasicSyntax<number>;
    'filesize': FileSize;
    'filetype': FileType;
    'duration': seconds;
    'is': 'parent' | 'child' | 
        'general' | 'sensitive' | 'questionable' | 'explicit' | 'sfw' | 'nsfw' | 
        'active' | 'deleted' | 'ending' | 'unmoderated' | 'modqueue' | 'banned' | 'appealed' | 'flagged' |
        'jpg' | 'png' | 'gif' | 'mp4' | 'webm' | 'swf' | 'zip'
    'has': 'children' | 'parent' | 'source' | 'appeals' | 'flags' | 'replacements' | 'comments' | 'commentary' | 'notes' | 'pools';
    'pool': poolname | id | 'any' | 'series' | 'collection';
    '-pool': poolname | id | 'any' | 'series' | 'collection';
    'ordpool': poolname;
    'upvote': username;
    'downvote': username;
    'random': number;
    'limit': number;
    // 'general': string;
    // 'gen': string;
    // 'artist': string;
    // 'art': string;
    // 'character': string;
    // 'char': string;
    // 'copyright': string;
}

export type PostStatus = 'flagged' | 'deleted' | 'any' | 'all' | 'pending' | 'unmoderated' | 'banned';