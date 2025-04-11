const SECOND_MS = 1000;
const MINUTE_MS = SECOND_MS * 60;
const HOUR_MS = MINUTE_MS * 60;
const DAY_MS = HOUR_MS * 24;
const WEEK_MS = DAY_MS * 7;
const INTL_RELATIVE_TIME = new Intl.RelativeTimeFormat('en', {style: 'long'})

export function time(timestamp: number) {
    timestamp = Math.floor(timestamp)
    const seconds = timestamp / SECOND_MS;
    const minutes = timestamp / MINUTE_MS;
    const hours = timestamp / HOUR_MS;
    const days = timestamp / DAY_MS;
    
    const mil = timestamp % 1000;
    const s = Math.floor(timestamp % 60_000 / 1000);
    const min = Math.floor(timestamp % 3600_000 / 60_000);
    const h = Math.floor(timestamp % (3600_000 * 24) / 3600_000)
    const ss = s.toString().padStart(2, '0');
    const mm = min.toString().padStart(2, '0');
    const hh = h.toString().padStart(2, '0');
    return {seconds, minutes, hours, days, mil, s, min, h, ss, mm, hh}
}

export function dateFrom(timestamp: number, from = Date.now()) {
    const diff = timestamp - from;
    const diff_abs = Math.abs(diff);
    if (diff_abs < MINUTE_MS) return INTL_RELATIVE_TIME.format(Math.round(diff / SECOND_MS), 'second');
    if (diff_abs < HOUR_MS) return INTL_RELATIVE_TIME.format(Math.round(diff / MINUTE_MS), 'minute');
    if (diff_abs < DAY_MS) return INTL_RELATIVE_TIME.format(Math.round(diff / HOUR_MS), 'hour');
    if (diff_abs < WEEK_MS) return INTL_RELATIVE_TIME.format(Math.round(diff / DAY_MS), 'day');
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate().toString().padStart(2, '0'))}`;
}

export function digitalUnit(bytes: number) {
    if (bytes < 1000) return `${bytes}B`
    const kb = bytes / 1000;
    if (kb < 1000) return `${kb.toFixed(2)}kB`;
    const mb = bytes / (1000 ** 2);
    if (mb < 1000) return `${mb.toFixed(2)}MB`;
    const gb = bytes / (1000 ** 3);
    if (gb < 1000) return `${gb.toFixed(2)}GB`;
    const tb = bytes / (1000 ** 4);
    if (tb < 1000) return `${tb.toFixed(2)}TB`;
    const pb = bytes / (1000 ** 5);
    if (pb < 1000) return `${pb.toFixed(2)}PB`;
    const eb = bytes / (1000 * 6);
    return `${eb.toFixed(2)}EB`;
}

const NUMBER_FORMAT = new Intl.NumberFormat('en', {notation: 'compact'})
export function numberFormat(number: number) {
    return NUMBER_FORMAT.format(number)
}