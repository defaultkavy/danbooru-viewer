import { $Container, type $ContainerContentType } from "elexis";
import type { Post } from "../../structure/Post";
import { Booru } from "../../structure/Booru";
import { Tag, TagCategory } from "../../structure/Tag";
import { numberFormat } from "../../structure/Util";
import type { $IonIcon } from "../IonIcon/$IonIcon";
import type { $Page, $Route } from "@elexis.js/router";
import { LocalSettings } from "../../structure/LocalSettings";

export class $DetailPanel extends $Container {
    static $container = $('div').class('detail-panel-container').css({ width: '300px', position: 'fixed', right: 0, top: 0,
        "@media (max-width: 800px)": { position: 'relative', width: '100%' }
     })
    post: Post | null = null;
    options: $DetailPanelOptions;
    constructor(options?: $DetailPanelOptions) {
        super('detail-panel');
        this.options = {
            preview: options?.preview ?? false,
            tagsType: options?.tagsType ?? 'detail'
        };
        this.build();
        
    }

    private build() {
        if (this.post) {
            this.content([
                this.options.preview ? $('div').class('preview').content([
                        $('img').src(this.post.previewURL)
                ]) : null,
                $('div').class('detail').content([
                    $('section').class('post-info').content([
                        new $Property('id').name('Post').content(`#${this.post.id}`),
                        new $Property('uploader').name('Uploader').content(this.post.uploader$).href(`/users/${this.post.uploader?.id}`).self($prop => {
                            if (this.post?.uploader) $prop.href(`/users/${this.post.uploader?.id}`);
                            this.post?.on('update', () => this.post?.uploader && $prop.href(`/users/${this.post.uploader.id}`))
                        }),
                        new $Property('approver').name('Approver').content(this.post.approver$).self($prop => {
                            if (this.post?.approver) $prop.href(`/users/${this.post.approver?.id}`);
                            this.post?.on('update', () => this.post?.approver ? $prop.href(`/users/${this.post.approver.id}`) : null)
                        }),
                        new $Property('date').name('Date').content(this.post.created_date$),
                        new $Property('size').name('Size').content([this.post.file_size$, this.post.dimension$]),
                        new $Property('file-type').name('File Type').content(this.post.file_ext$),
                        $('div').class('inline').content([
                            new $Property('favorites').name('Favorites').content(this.post.favcount$),
                            new $Property('score').name('Score').content(this.post.score$)
                        ]),
                        this.post.file_url ? new $Property('file-url').name('File').content([
                            $('a').href(this.post.file_url$).content(this.post.file_url$.convert((value) => value ? value.replace('https://', '') : '' )).target('_blank'),
                            $('ion-icon').name('clipboard').on('click', (e, $ion) => this.copyButtonHandler($ion, this.post!.file_url!))
                        ]) : null,
                        new $Property('source-url').name('Source').content([
                            $('a').href(this.post.source$).content(this.post.source$.convert((value) => value.replace('https://', ''))).target('_blank'),
                            $('ion-icon').name('clipboard').on('click', (e, $ion) => this.copyButtonHandler($ion, this.post!.source))
                        ]),
                        new $Property('booru-url').name(Booru.name$).content([
                            $('a').href(this.post.booruUrl$).content(this.post.booruUrl$.convert((value) => value.replace('https://', ''))).target('_blank'),
                            $('ion-icon').name('clipboard').on('click', (e, $ion) => this.copyButtonHandler($ion, this.post!.booruUrl))
                        ]),
                        new $Property('webm-url').name('Webm').hide(true).self(async ($property) => {
                            await this.post!.ready;
                            if (this.post!.isUgoria) $property.content($('a').href(this.post!.webm_url$).content(this.post!.webm_url$.convert((value) => value.replace('https://', ''))).target('_blank')).hide(false);
                        }),
                    ]),
                    $('div').class('post-tags').content(async $tags => {
                        if (this.options.tagsType === 'detail') {
                            const tags = (await this.post!.fetchTags()).tags;
                            const [artist_tags, char_tags, gen_tags, meta_tags, copy_tags] = [
                                tags.filter(tag => tag.category === TagCategory.Artist),
                                tags.filter(tag => tag.category === TagCategory.Character),
                                tags.filter(tag => tag.category === TagCategory.General),
                                tags.filter(tag => tag.category === TagCategory.Meta),
                                tags.filter(tag => tag.category === TagCategory.Copyright),
                            ]
                    
                            function $tag_category(category: string, tags: Tag[]) {
                                return tags.length ? [
                                    $('h3').content(category),
                                    $('section').content([
                                        tags.map(tag => $('div').class('tag').content([
                                            $('a').class('tag-name').content(tag.name).href(`/posts?tags=${tag.name}`),
                                            $('span').class('tag-post-count').content(tag.post_count$.convert(numberFormat))
                                        ]))
                                    ])
                                ] : null
                            }

                            return [
                                $tag_category('Artist', artist_tags),
                                $tag_category('Character', char_tags),
                                $tag_category('Copyright', copy_tags),
                                $tag_category('Meta', meta_tags),
                                $tag_category('General', gen_tags),
                            ]
                        } else {
                            function $tag_category(category: string, tags: string[]) {
                                return tags.at(0)?.length ? [
                                    $('h3').content(category),
                                    $('section').class('tag-name-only').content([
                                        tags.map(tag => $('a').class('tag').content(tag).href(`/posts?tags=${tag}`)),
                                    ])
                                ] : null
                            }
                            return [
                                $tag_category('Artist', this.post!.tag_string_artist.split(' ')),
                                $tag_category('Character', this.post!.tag_string_character.split(' ')),
                                $tag_category('Copyright', this.post!.tag_string_copyright.split(' ')),
                                $tag_category('Meta', this.post!.tag_string_meta.split(' ')),
                                $tag_category('General', this.post!.tag_string_general.split(' ')),
                            ]
                        }
                    })
                ])
            ])
        } else {
            this.content($('span').class('no-content').content('No Selected'))
        }
    }

    update(post: Post | null) {
        this.post = post;
        this.build();
        return this;
    }

    private copyButtonHandler($ion: $IonIcon, text: string) {
        $ion.name('checkmark');
        navigator.clipboard.writeText(text);
        setTimeout(() => $ion.name('clipboard'), 3000);
    }

    position($page: $Page<any>) {
        let scrollTop = 0;
        addEventListener('scroll', () => { if (this.inDOM()) scrollTop = document.documentElement.scrollTop }, {passive: true})
        $page
            .on('beforeShift', () => { if (innerWidth > 800) this.style({position: `absolute`, top: `calc(${scrollTop}px + var(--nav-height) + var(--padding))`}) })
            .on('afterShift', () => this.style({position: '', top: ''}))
        return this;
    }

    open() {
        $DetailPanel.$container.insert(this);
        this.animate({
            transform: ['translateX(100%)', 'translateX(0)'],
            opacity: [0, 1]
        }, {
            duration: 300,
            composite: 'replace',
            easing: 'ease',
        })
    }

    close() {
        this.animate({
            transform: ['translateX(0)', 'translateX(100%)'],
            opacity: [1, 0]
        }, {
            duration: 300,
            composite: 'replace',
            easing: 'ease',
            onfinish: () => this.remove()
        })
    }

    static toogle() {
        if ($(':page#posts') || $(':page#user')) LocalSettings.previewPanelEnable$.set(!LocalSettings.previewPanelEnable$.value)
        else if ($(':page#post')) LocalSettings.detailPanelEnable$.set(!LocalSettings.detailPanelEnable$.value)
    }
}

export interface $DetailPanelOptions {
    preview?: boolean;
    tagsType?: 'detail' | 'name_only';
}

class $Property extends $Container {
    $name = $('span').class('property-name')
    $values = $('a').class('property-values')
    constructor(id: string) {
        super('div');
        this.staticClass('property').attribute('property-id', id);
        super.content([
            this.$name,
            this.$values.hide(true)
        ])
    }

    name(content: $ContainerContentType) {
        this.$name.content(content);
        return this;
    }

    content(content: OrMatrix<$ContainerContentType>) {
        this.$values.hide(false);
        const list = $.orArrayResolve(content);
        this.$values.content(list.map($item => $('span').staticClass('property-value').content($item)));
        return this;
    }

    href(url: string) {
        this.$values.href(url);
        return this;
    }
}