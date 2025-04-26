import { $Container, $Video } from "elexis";
import type { Post } from "../structure/Post";
import { time } from "../structure/Util";
import type { $PostViewer } from "./$PostViewer";

export class $VideoController extends $Container {
    $video: $Video;
    $viewer: $Container;
    duration$ = $.state('00:00');
    post: Post;
    constructor($video: $Video, $viewer: $PostViewer, post: Post) {
        super('video-controller')
        this.$video = $video
        this.$viewer = $viewer;
        this.post = post;
        this.build();
    }

    protected build() {
        const events = $.events<{
            progressChange: [number]
        }>();
        this.$video.on('timeupdate', () => this.durationUpdate())
        this
        .css({ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', width: '100%' })
        .content([
            $('div').class('video-details')
            .css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                // controll buttons
                "$div": { display: 'flex', alignItems: 'center', width: '100%', gap: '1rem', '$&.right': { justifyContent: 'end' } }
             })
            .content([
                $('div').class('left').content([
                    $('ion-icon').class('play').css({ flexShrink: 0 }).title('Play').name('play').use($play => {
                        this.$video.on('play', () => $play.name('pause'))
                            .on('pause', () => $play.name('play'))
                        $play.on('click', () => this.$video.isPlaying ? this.$video.pause() : this.$video.play())
                    }),
                    $('div').class('duration').content([
                        $('span').class('current-time').content(this.duration$),
                        $('span').content('/'),
                        $('span').class('total-time').content('00:00').use($time => {
                            this.$video.on('loadeddata', () => {
                                const t = time(this.$video.duration * 1000);
                                $time.content(Number(t.hh) > 0 ? `${t.hh}:${t.mm}:${t.ss}` : `${t.mm}:${t.ss}`);
                            })
                        }),
                    ]),
                ]),
                $('div').class('right').content([
                    $('ion-icon').class('volume').title('Volume').name('volume-high').disable(!this.post.hasSound).use($volume => {
                        const check = () => {
                            if (this.$video.muted()) $volume.name('volume-mute');
                            else $volume.name('volume-high');
                        }
                        $volume.on('click', () => {
                            this.$video.muted(!this.$video.muted())
                            check();
                        })
                    }),
                    $('ion-icon').class('full-screen').title('Full-Screen').name('scan').use($fullscreen => {
                        $fullscreen.on('click', () => {
                            if (document.fullscreenElement) document.exitFullscreen()
                            else this.$viewer.dom.requestFullscreen()
                        })
                    })
                ])
            ]),
            $('div').class('progressbar-container')
            .css({ height: '2rem', width: '100%', display: 'flex', touchAction: 'none', alignItems: 'center', cursor: 'pointer' })
            .content([
                $('div').class('progressbar')
                .css({ height: '0.4rem', width: '100%', backgroundColor: 'var(--secondary-color-1)', flexShrink: 1 })
                .content([
                    $('div').class('progress')
                    .css({ height: '100%', backgroundColor: 'var(--secondary-color-3)', width: '100px' })
                    .use($progress => {
                        this.$video.on('timeupdate', e => {
                            $progress.style({width: `${(this.$video.currentTime() / this.$video.duration) * 100}%`})
                        })
                        events.on('progressChange', percentage => {
                            $progress.style({width: `${percentage * 100}%`})
                        })
                    })
                ])
            ]).use($bar => {
                const pointers = $.pointers($(document.body));
                let isPlaying = false;
                pointers.on('down', (pointer, e) => {
                    if (!$bar.contains(pointer.$target)) return pointer.delete();
                    e.preventDefault()
                    if (this.$video.isPlaying) {
                        isPlaying = true;
                        this.$video.pause();
                    }
                    const percentage = (pointer.x - $bar.dom.getBoundingClientRect().x) / $bar.offsetWidth;
                    this.$video.currentTime(percentage * this.$video.duration);
                })
                pointers.on('move', (pointer, e) => {
                    e.preventDefault()
                    const percentage = (pointer.x - $bar.dom.getBoundingClientRect().x) / $bar.offsetWidth;
                    this.$video.currentTime(percentage * this.$video.duration);
                    events.fire('progressChange', percentage)
                })
                pointers.on('up', (pointer, e) => {
                    if (isPlaying) this.$video.play();
                    isPlaying = false;
                })
            })
        ])
    }

    durationUpdate() {
        const t = time(this.$video.currentTime() * 1000)
        this.duration$.value(Number(t.hh) > 0 ? `${t.hh}:${t.mm}:${t.ss}` : `${t.mm}:${t.ss}`)
    }
}