import type { Booru } from "./Booru";
import type { TagCategory } from "./Tag";
import type { UserLevel } from "./User";

export class Autocomplete {
    static async fetch(booru: Booru, query: string, limit: number = 20) {
        if (!query.length) return this.searchQuery.map(data => new AutocompleteResult(data))
        const res = await booru.fetch<AutocompleteData[]>(`/autocomplete.json?search[query]=${query}&search[type]=tag_query&version=1&limit=${limit}`);
        const searchQueryResult = query.length ? this.searchQuery.filter(sq => sq.value.startsWith(query) && sq.value !== query) : this.searchQuery
        return [...searchQueryResult, ...res].map(data => new AutocompleteResult(data));
    }

    static searchQuery: AutocompleteSearchQueryData[] = [
        {value: 'user:', label: 'user:'},
        {value: 'approver:', label: 'approver:'},
        {value: '-approver:', label: '-approver:'},
        {value: 'order:', label: 'order:'},
        {value: 'ordfav:', label: 'ordfav:'},
        {value: 'ordfavgroup:', label: 'ordfavgroup:'},
        {value: 'search:', label: 'search:'},
        {value: 'favgroup:', label: 'favgroup:'},
        {value: '-favgroup:', label: '-favgroup:'},
        {value: 'favcount:', label: 'favcount:'},
        {value: 'id:', label: 'id:'},
        {value: 'tagcount:', label: 'tagcount:'},
        {value: 'gentags:', label: 'gentags:'},
        {value: 'arttags:', label: 'arttags:'},
        {value: 'chartags:', label: 'chartags:'},
        {value: 'copytags:', label: 'copytags:'},
        {value: 'metatags:', label: 'metatags:'},
        {value: 'score:', label: 'score:'},
        {value: 'upvote:', label: 'upvote:'},
        {value: 'downvote:', label: 'downvote:'},
        {value: 'disapproved:', label: 'disapproved:'},
        {value: 'md5:', label: 'md5:'},
        {value: 'width:', label: 'width:'},
        {value: 'height:', label: 'height:'},
        {value: 'ratio:', label: 'ratio:'},
        {value: 'mpixels:', label: 'mpixels:'},
        {value: 'filesize:', label: 'filesize:'},
        {value: 'duration:', label: 'duration:'},
        {value: 'is:', label: 'is:'},
        {value: 'has:', label: 'has:'},
        {value: 'pool:', label: 'pool:'},
        {value: '-pool:', label: '-pool:'},
        {value: 'ordpool:', label: 'ordpool:'},
        {value: 'random:', label: 'random:'},
        {value: 'limit:', label: 'limit:'},
        {value: 'date:', label: 'date:'},
        {value: 'commenter:', label: 'commenter:'},
        {value: 'note:', label: 'note:'},
        {value: 'noter:', label: 'noter:'},
        {value: 'noteupdater:', label: 'noteupdater:'},
        {value: 'status:', label: 'status:'},
        {value: '-status:', label: '-status:'},
        {value: 'rating:', label: 'rating:'},
        {value: '-rating:', label: '-rating:'},
        {value: 'source:', label: 'source:'},
        {value: '-source:', label: '-source:'},
        {value: 'pixiv:', label: 'pixiv:'},
        {value: 'parent:', label: 'parent:'},
        {value: 'child:', label: 'child:'},
        {value: 'flagger:', label: 'flagger:'},
        {value: 'appealer:', label: 'appealer:'},
        {value: 'commentary:', label: 'commentary:'},
        {value: 'commentaryupdater:', label: 'commentaryupdater:'},
    ].map(data => ({type: 'query', ...data}))
}

export interface AutocompleteResult extends AutocompleteBaseData {}
export class AutocompleteResult {
    constructor(data: AutocompleteData) {
        Object.assign(this, data);
    }

    isTag(): this is AutocompleteResult & (AutocompleteTagData | AutocompleteTagAliasData | AutocompleteTagAutocorrectData) {
        return this.type === 'tag' || this.type === 'tag-autocorrect' || this.type === 'tag-alias' || this.type === 'tag-word';
    }

    isTagAutocorrect(): this is AutocompleteResult & AutocompleteTagAutocorrectData {
        return this.type === 'tag-autocorrect';
    }

    isTagAntecedent(): this is Autocomplete & AutocompleteTagAutocorrectData {
        //@ts-expect-error
        return !!this['antecedent' as any]
    }

    isTagWord(): this is AutocompleteResult & AutocompleteTagWordData {
        return this.type === 'tag-word'
    }

    isUser(): this is AutocompleteResult & AutocompleteUserData {
        return this.type === 'user';
    }
}

type AutocompleteData = AutocompleteBaseData & (AutocompleteUserData | AutocompleteTagData | AutocompleteTagAutocorrectData | AutocompleteTagAliasData | AutocompleteSearchQueryData);

interface AutocompleteBaseData {
    type: 'user' | 'tag' | 'tag-autocorrect' | 'tag-alias' | 'tag-word' | 'query';
    label: string;
    value: string;
}

interface AutocompleteUserData {
    type: 'user';
    id: number;
    level: Lowercase<keyof UserLevel>;
}
interface AutocompleteTagData {
    type: 'tag';
    category: TagCategory;
    post_count: number;
}
interface AutocompleteTagAutocorrectData {
    type: 'tag-autocorrect';
    category: TagCategory;
    post_count: number;
    antecedent: string;
}
interface AutocompleteTagAliasData {
    type: 'tag-alias';
    category: TagCategory;
    post_count: number;
    antecedent: string;
}
interface AutocompleteTagWordData{
    type: 'tag-word';
    category: TagCategory;
    post_count: number;
    antecedent: string;
}

interface AutocompleteSearchQueryData {type: 'query', value: string, label: string}