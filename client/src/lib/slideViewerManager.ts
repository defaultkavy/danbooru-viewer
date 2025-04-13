import type { $Video } from "elexis";
import { $SlideViewer } from "../component/$SlideViewer";

export const $slideViewerMap = new Map<string | undefined, $SlideViewer>();
/** create slide viewer or get from cached */
export function $getSlideViewer(q: string | undefined) {
    const $slideViewer = $slideViewerMap.get(q) ?? 
        $($SlideViewer)
            .css({
                display: 'block',
                height: 'calc(100dvh - 2rem - var(--nav-height))',
                width: 'calc(100vw - 300px - 4rem)',
                backgroundColor: '#000000',
                borderRadius: 'var(--border-radius-large)',
                overflow: 'hidden',
                margin: '1rem',
                transition: 'all 0.3s ease',
                touchAction: 'pan-y',
                '@media (max-width: 800px)': {
                    width: '100%',
                    height: 'calc(100dvh - var(--nav-height))',
                    borderRadius: 0,
                    margin: 0
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