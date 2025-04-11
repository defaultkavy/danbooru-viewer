type timestamp = number;
type ISOString = string;
type id = number;
type username = string;
type DateType = `${number}-${number}-${number}`;
type PeriodType = `${number}${PeriodUnit}`
type PeriodUnit = 'seconds' | 's' | 'minutes' | 'mi' | 'hours' | 'h' | 'days' | 'd' | 'weeks' | 'w' | 'months' | 'mo' | 'years' | 'y'
type UserSyntax = username | 'any' | 'none'
type Rating = 'explicit' | 'e' | 'questionable' | 'q' | 'sensitive' | 's' | 'general' | 'g'
type Source = 'http' | `https://${string}` | `*${string}*` | 'none'
type Ratio = `${numebr}:${numebr}` | `${number}/${number}` | number
type FileSize = `${number}${FileSizeUnit}`
type FileSizeUnit = 'b' | 'kb' | 'm'
type FileType = 'jpg' | 'png' | 'gif' | 'swf' | 'webm' | 'mp4' | 'zip' | 'webp'
type seconds = number;
type poolname = string;

type NumericSymbols = '<' | '>' | '<=' | '>='
type NumericBasicSyntax<N> = N | N[] | `${N}` | `${NumericSymbols}${N}` | `${N}..` | `..${N}` | `${N}...${N}`
type NumericSyntax<T> = NumericBasicSyntax<T> | NumericSyntaxComparisons<T>;
type NumericSyntaxComparisons<T> = 
    { _not: NumericBasicSyntax<T> } | 
    { _eq: NumericBasicSyntax<T> } |
    { _not_eq: NumericBasicSyntax<T> } |
    { _gt: NumericBasicSyntax<T> } |
    { _gteq: NumericBasicSyntax<T> } |
    { _lt: NumericBasicSyntax<T> } |
    { _lteq: NumericBasicSyntax<T>}

type TextSyntax<T> = T | TextSyntaxComparisons<T>;
type TextSyntaxComparisons<T> = 
    { _eq: T } |
    { _not_eq: T } |
    { _like: T } | 
    { _ilike: T } |
    { _not_like: T } |
    { _not_ilike: T } |
    { _regex: string } |
    { _not_regex: string } |
    { _array: string } |
    { _comma: string } |
    { _space: string } |
    { _lower_array: string } |
    { _lower_comma: string } |
    { _lower_space: string }

type UserSyntax = { _id: id } | { _name: username };
type ChainingSyntax = {_id: id} | {has_: boolean};
type PostSyntax = {_id: id} | {_tags_match: string};
interface APIError {
    success: false;
    error: string;
    message: string;
}