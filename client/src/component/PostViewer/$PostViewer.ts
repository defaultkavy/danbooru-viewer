import { $Container } from "elexis";
import type { Post } from "../../structure/Post";
import { Booru } from "../../structure/Booru";
import { ClientUser } from "../../structure/ClientUser";
import { $VideoController } from "../VideoController/$VideoController";
import { $Input } from "elexis/lib/node/$Input";

export class $PostViewer extends $Container<HTMLElement, $PostViewerEventMap> {
    $video = $('video');
    post: Post;
    constructor(post: Post) {
        super('div');
        this.post = post
        this.class('viewer');
        this.build();
    }

    async build() {
        await this.post.ready;
        this.events.on('video_play_pause', () => { if (this.$video.isPlaying) this.$video.pause(); else this.$video.play() })
        this.content([
            $('div').class('viewer-panel').hide(false).content($viewerPanel => {
                this.events.on('viewerPanel_hide', () => $viewerPanel.hide(true))
                    .on('viewerPanel_show', () => $viewerPanel.hide(false))
                    .on('viewerPanel_switch', () => { $viewerPanel.hide(!$viewerPanel.hide()) })
                return [
                    $('div').class('panel').content([
                        this.post.isVideo ? new $VideoController(this.$video, this, this.post) : null,
                        $('div').class('buttons').content([
                            $('ion-icon').title('Favorite').name('heart-outline').self($heart => {
                                if (Booru.used.user) $heart.hide(false);
                                else $heart.hide(true);
                                Booru.events.on('login', () => $heart.hide(false))
                                ClientUser.events.on('favoriteUpdate', (user) => {
                                    if (user.favorites.has(this.post.id)) $heart.name('heart');
                                    else $heart.name('heart-outline');
                                })
                                if (Booru.used.user?.favorites.has(this.post.id)) $heart.name('heart');
                                $heart.on('click', () => {
                                    if (Booru.used.user?.favorites.has(this.post.id)) this.post.deleteFavorite();
                                    else this.post.createFavorite();
                                })
                            }),
                            $('ion-icon').title('Original Size').name('resize-outline').self($original => {
                                $original.on('click', () => { this.events.fire('original_size'); $original.disable(true); })
                                if (!this.post.isLargeFile || this.post.isVideo) $original.disable(true);
                            })
                        ])
                    ]),
                    $('div').class('overlay')
                ]
            }),
            this.post.isVideo
            ? this.$video.height(this.post.image_height).width(this.post.image_width).src(this.post.file_ext === 'zip' ? this.post.large_file_url : this.post.file_url)
                .controls(false).loop(true).disablePictureInPicture(true)
            : $('img').height(this.post.image_height).width(this.post.image_width).self($img => {
                $img.once('load', () => 
                    $img.once('load', () => $img.removeClass('loading')).src(this.post.isLargeFile ? this.post.large_file_url : this.post.file_url)
                ).src(this.post.preview_file_url)
                if (!$img.complete) $img.class('loading')
                this.events.on('original_size', () => $img.src(this.post.file_url))
            })
        ])
        this.on('pointerleave', (e) => {
            if (e.pointerType === 'touch') return;
            this.events.fire('viewerPanel_hide');
        })
        this.on('pointermove', (e) => {
            if (e.pointerType === 'mouse' || e.pointerType === 'pen') this.events.fire('viewerPanel_show');
        })
        let doubleTap: Timer | null = null;
        $.pointers(this)
            .on('up', pointer => {
                if ( this.$(':.viewer-panel .panel')?.contains($(pointer.$target)) ) return;
                if (pointer.type === 'mouse') this.events.fire('video_play_pause');
                else {
                    if (doubleTap !== null) {
                        this.events.fire('video_play_pause');
                    }
                    doubleTap = setTimeout(() => {
                        doubleTap = null;
                    }, 300);
                    this.events.fire('viewerPanel_switch');
                }
            })
        $.keys($(window)).self($keys => $keys
            .if(e => {
                if ($(e.target) instanceof $Input) return;
                if (!this.inDOM()) return;
                return true;
            })
            .keydown(' ', e => {
                e.preventDefault();
                if (this.$video.isPlaying) this.$video.pause();
                else this.$video.play();
            })
        )
    }
}

export interface $PostViewerEventMap {
    viewerPanel_hide: [],
    viewerPanel_show: [],
    viewerPanel_switch: [],
    original_size: [],
    video_play_pause: [],
}