import { $Container, $Image, $State, $Video } from "elexis";
import type { Post } from "../../structure/Post";
import { time } from "../../structure/Util";
import type { $PostGrid } from "../PostGrid/$PostGrid";
import { LocalSettings } from "../../structure/LocalSettings";
export class $PostTile extends $Container {
    post: Post;
    $video: $Video | null;
    $img: $Image;
    duration$ = $.state(``);
    $grid: $PostGrid;
    constructor($grid: $PostGrid, post: Post) {
        super('post-tile');
        this.$grid = $grid;
        this.post = post;
        this.$video = this.post.isVideo ? $('video').width(this.post.image_width).height(this.post.image_height).disablePictureInPicture(true).loop(true).muted(true).hide(true).on('mousedown', (e) => e.preventDefault()) : null;
        this.$img = $('img').draggable(false).style({opacity: '0'}).width(this.post.image_width).height(this.post.image_height).src(this.post.previewURL).loading('lazy');
        this.attribute('filetype', this.post.file_ext);
        this.durationUpdate();
        this.build();
    }

    build() {
        this.$video?.on('timeupdate', (e, $video) => {
            this.durationUpdate();
        })
        this.class('loading').content([
            // Video Detail
            this.post.isVideo 
                ? $('div').class('video-detail').content([
                    this.post.hasSound ? $('ion-icon').name('volume-medium-outline') : null,
                    this.post.isUgoria ? $('ion-icon').name('images-outline') : null,
                    $('span').class('duration').content(this.duration$) 
                ]) : null,
            // Gif
            this.post.isGif
                ? $('div').class('gif-detail').content([
                    $('span').content('GIF')
                ]) : null,
            // Tile
            $('a').href(this.url).preventDefault(LocalSettings.previewPanelEnable$).content(() => [
                this.$video,
                this.$img.on('mousedown', (e) => e.preventDefault())
                    .once('load', (e, $img) => { 
                        $img.animate({opacity: [0, 1]}, {duration: 300}, () => $img.style({opacity: ''}));
                        this.removeClass('loading'); 
                    })
            ])
        ])
        this.on(['focus', 'mouseenter', 'touchstart'], () => { 
                if (!this.$video?.isPlaying) { 
                    this.$video?.src(this.post.large_file_url).hide(false).play().catch(err => undefined)
                } 
                if (this.post.isGif) { this.$img.src(this.post.large_file_url) }
            }, {passive: true} )
            .on(['blur', 'mouseleave', 'touchend', 'touchcancel'], () => {
                this.$video?.pause().currentTime(0).hide(true); 
                if (this.post.isGif) { this.$img.src(this.post.previewURL) }
            }, {passive: true} )
            .on('click', () => {
                if (!LocalSettings.previewPanelEnable$.value) return;
                if (innerWidth <= 800) return $.open(this.url);
                if (this.attribute('focus') === '') $.open(this.url);
                else this.trigger('$focus');
            })
    }

    durationUpdate() {
        if (!this.$video) return;
        const t = time(this.post.media_asset.duration * 1000 - this.$video.currentTime() * 1000)
        this.duration$.set(Number(t.hh) > 0 ? `${t.hh}:${t.mm}:${t.ss}` : `${t.mm}:${t.ss}`)
    }

    get url() { return `${this.post.pathname}${this.$grid.tags ? `?q=${this.$grid.tags}` : ''}` }
}