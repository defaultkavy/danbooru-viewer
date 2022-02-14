export class Loader {
    url: string
    callback: ((url: string) => any) | undefined
    total: number
    loaded: number
    #onloadstart?: () => any;
    #onloadprogress?: () => any;
    #onabort?: () => any;
    xhr: XMLHttpRequest;
    constructor(url: string, callback?: (url: string) => any) {
        this.url = url
        this.callback = callback
        this.total = 0
        this.loaded = 0
        this.xhr = new XMLHttpRequest
        this.load()
    }

    load() {
        this.xhr.open('GET', this.url, true)
        this.xhr.responseType = 'arraybuffer'
        this.xhr.onload = (e) => {
            const blob = new Blob([this.xhr.response])
            if (this.callback) this.callback(window.URL.createObjectURL(blob))
        }

        this.xhr.onloadstart = (e) => {
            this.total = e.total
            this.loaded = 0
            if (this.#onloadstart) this.#onloadstart()
        }

        this.xhr.onprogress = (e) => {
            this.total = e.total
            this.loaded = e.loaded
            if (this.#onloadprogress) this.#onloadprogress()
        }

        this.xhr.onabort = (e) => {
            if (this.#onabort) this.#onabort()
        }

        this.xhr.send()
    }

    abort() {
        this.xhr.abort()
    }
    
    onloadprogress(fn: () => any) {
        this.#onloadprogress = fn
    }
    
    onloadstart(fn: () => any) {
        this.#onloadstart = fn
    }
    
    onabort(fn: () => any) {
        this.#onabort = fn
    }

    get percentage() {
        return (this.loaded / this.total) * 100
    }
}