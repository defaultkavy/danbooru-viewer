import type { $Video } from "elexis";
import { $SlideViewer } from "../component/$SlideViewer";
import { $CSS } from "@elexis.js/css";

export const $slideViewerMap = new Map<string | undefined, $SlideViewer>();
/** create slide viewer or get from cached */
export function $getSlideViewer(q: string | undefined) {
    const $slideViewer = $slideViewerMap.get(q) ?? 
        $($SlideViewer)
            .css({
                selector: '.slide-viewer',
                display: 'block',
                h: 'calc(100dvh - 2rem - var(--nav-height))',
                w: 'calc(100vw - 300px - 4rem)',
                bgColor: '#000000',
                bRadius: 'var(--border-radius-large)',
                overflow: 'hidden',
                m: '1rem',
                transition: 'all 0.3s ease',
                touchAction: 'pan-y',
                media: {
                    query: '(max-width: 800px)',
                    w: '100%',
                    h: 'calc(100dvh - var(--nav-height))',
                    bRadius: 0,
                    m: 0
                }
            })
            .pointerException((pointer) => {
                if ($slideViewer.currentSlide?.$('::.progressbar-container').find($div => $div.contains(pointer.$target))) return false;
                if (pointer.type === 'mouse') return false;
                return true;
            })
            // change path after slide switch
            .on('switch', ({$nextSlide: nextSlide}) => {
                $.replace(`/posts/${nextSlide.slideId()}${q ? `?q=${q}` : ''}`);
            })
            // pause prev slide video and play next one
            .on('beforeSwitch', ({$prevSlide: prevSlide, $nextSlide: nextSlide}) => {
                prevSlide?.$<$Video>(':video')?.pause();
            })
            .on('afterSwitch', ({$nextSlide: nextSlide}) => {
                nextSlide.$<$Video>(':video')?.play();
            })
            // pause video when slide moving
            .on('slideMove', ($slide) => {
                if (!$slide) return;
                $slide.$<$Video>(':video')?.pause();
            })
            .on('slideBack', ($slide) => {
                if (!$slide) return;
                const $v = $slide.$<$Video>(':video')
                $v?.play();
                console.debug($v)
            })
    $slideViewerMap.set(q, $slideViewer);
    return $slideViewer;
}