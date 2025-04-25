export const $idb = await $.idb('danbooru-viewer-db', 9)
    .store('search-history', store => store
        .keyPath('tag')
        .type<{
            tag: string,
            timestamp: number
        }>()
        .index('timestamp', index => index
            .keyPath('timestamp')
        )
        .upgrade(4, (list) => {
            return list.map(({key, value}) => ({ key, value: {...value, tags: value.tags.join(',')} }))
        })
    )
    .open();