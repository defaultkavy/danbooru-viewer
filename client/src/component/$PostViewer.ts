import { $Container } from "elexis";
import type { Post } from "../structure/Post";
import { Booru } from "../structure/Booru";
import { $Input } from "elexis/lib/node/$Input";
import { $Notify } from "./$Notify";
import { User } from "../structure/User";
import { $VideoController } from "./$VideoController";

export class $PostViewer extends $Container<HTMLElement, $PostViewerEventMap> {
    $video = $('video');
    post: Post;
    constructor(post: Post) {
        super('div');
        this.post = post
        this.build();
    }

    async build() {
        await this.post.ready;
        this.events.on('video_play_pause', () => { 
            if (this.$video.isPlaying) this.$video.pause(); else this.$video.play();
        })
        this.class('viewer')
        .css({ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 'var(--border-radius-large)', overflow: 'hidden', position: 'relative', transition: 'all 0.3s ease'})
        .content([
            // viewer control panel
            $('div').class('viewer-panel')
            .css({ position: 'absolute', bottom: 0, width: '100%', zIndex: 1 })
            .hide(false)
            .content($viewerPanel => {
                this.events.on('viewerPanel_hide', () => $viewerPanel.hide(true))
                    .on('viewerPanel_show', () => $viewerPanel.hide(false))
                    .on('viewerPanel_switch', () => { $viewerPanel.hide(!$viewerPanel.hide()) })
                return [
                    // button container
                    $('div').class('panel')
                    .css({ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', gap: '1rem', boxSizing: 'border-box' })
                    .content([
                        // if post is video, show video controller component
                        this.post.isVideo ? $($VideoController, this.$video, this, this.post) : null,
                        // buttons
                        $('div').class('buttons')
                        .css({ width: '100%', display: 'flex', justifyContent: 'center', gap: '2rem' })
                        .content([
                            $('ion-icon').title('Favorite').name('heart-outline').self($heart => {
                                if (Booru.used.user) $heart.hide(false);
                                else $heart.hide(true);
                                Booru.events.on('login', () => $heart.hide(false))
                                User.events.on('favoriteUpdate', (user) => {
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
                                if (!this.post.isLargeFile || this.post.isVideo) $original.hide(true);
                            })
                        ])
                    ]),
                    // overlay on viewer
                    $('div').class('overlay')
                    .css({position: 'absolute', bottom: 0, width: '100%', height: '200%', zIndex: -1, 
                        background: `linear-gradient(180deg, 
                            color-mix(in srgb, var(--secondary-color-1) 0%, transparent) 0%, 
                            color-mix(in srgb, var(--secondary-color-0) 70%, transparent) 100%
                    );`})
                ]
            }),
            this.post.isVideo
                // is video
                ? this.$video.height(this.post.image_height).width(this.post.image_width)
                .css({ maxWidth: '100%', maxHeight: '100%', '-webkit-user-drag': 'none', transition: 'all 0.3s ease' })
                .src(this.post.file_ext === 'zip' ? this.post.large_file_url : this.post.file_url)
                .controls(false).loop(true).disablePictureInPicture(true)
                // is image
                : $('img').height(this.post.image_height).width(this.post.image_width)
                .css({maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'all 0.3s ease' })
                .self($img => {
                    $img.once('load', () => 
                        $img.once('load', () => $img.removeClass('loading')).src(this.post.isLargeFile ? this.post.large_file_url : this.post.file_url)
                    ).src(this.post.preview_file_url)
                    if (!$img.complete) $img.css({ '$&.loading': {filter: 'blur(5px)'} }).class('loading');
                    this.events.on('original_size', () => {
                        $Notify.push('Original size image is loading...')
                        $img.src(this.post.file_url).once('load', () => $Notify.push('Original size image loaded.'));
                    })
                })
        ])
        // viewer panel hide/show
        .on('pointerleave', (e) => {
            if (e.pointerType === 'touch') return;
            this.events.fire('viewerPanel_hide');
        })
        .on('pointermove', (e) => {
            if (e.pointerType === 'mouse' || e.pointerType === 'pen') this.events.fire('viewerPanel_show');
        })

        let doubleTap: Timer | null = null;
        $.pointers(this)
        // double tap control video play/pause and viewer panel hide/show
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
        });

        // hotkey assign
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