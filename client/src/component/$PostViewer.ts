import { $Container, $Input, $Option } from "elexis";
import type { Post } from "../structure/Post";
import { $Notify } from "./$Notify";
import { $PostViewerPanel } from "./$PostViewerPanel";

export class $PostViewer extends $Container<HTMLElement, $PostViewerEventMap> {
    $video = $('video');
    post: Post;
    constructor(post: Post) {
        super('post-viewer');
        this.post = post;
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
            // viewer panel
            $($PostViewerPanel, this),

            $('div').class('container')
            .css({height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'})
            .content([
                // viewer content
                this.post.isVideo
                    // is video
                    ? this.$video.height(this.post.image_height).width(this.post.image_width)
                    .css({ maxWidth: '100%', maxHeight: '100%', '-webkit-user-drag': 'none', transition: 'all 0.3s ease' })
                    .src(this.post.file_ext === 'zip' ? this.post.large_file_url : this.post.file_url)
                    .controls(false).loop(true).disablePictureInPicture(true)
                    // is image
                    : $('img').height(this.post.image_height).width(this.post.image_width)
                    .css({maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', transition: 'all 0.3s ease' })
                    .use($img => {
                        const fileURL = this.post.isLargeFile ? this.post.large_file_url : this.post.file_url;
                        $img
                        .css({ opacity: 0 })
                        .animate({ opacity: [0, 1] }, { duration: 300, fill: 'both' })
                        .src(this.post.previewURL)
                        
                        if ($img.src() !== fileURL) {
                            const cacheImg = $('img').src(fileURL);
                            setTimeout(() => {
                                const height = this.post.image_height > this.clientHeight ? this.clientHeight : this.post.image_height;
                                const width = this.post.image_width > this.clientWidth ? this.clientWidth : this.post.image_width;
                                const IS_EXCEED_WIDTH = this.clientHeight * this.post.ratio >= this.clientWidth
                                const scale = IS_EXCEED_WIDTH ? $img.clientWidth / width : $img.clientHeight / height;
                                if (isNaN(scale)) return;
                                const animate = () => 
                                    $img.src(fileURL).animate({
                                        transform: [`scale(${scale})`, `scale(1)`]
                                    }, {duration: 300, easing: 'ease'});
                                cacheImg.complete ? animate() : cacheImg.once('load', animate);
                            }, 400);
                        }

                        this.events.on('original_size', () => {
                            $Notify.push('Original size image is loading...')
                            $img.src(this.post.file_url).once('load', () => $Notify.push('Original size image loaded.'));
                        })
                    })
            ])
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
        $.keys($(window))
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
    }
}

export interface $PostViewerEventMap {
    viewerPanel_hide: [],
    viewerPanel_show: [],
    viewerPanel_switch: [],
    original_size: [],
    video_play_pause: [],
}