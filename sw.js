const cacheName = 'myPwaCache-v1'
const cacheList = ['/index.html', '/images/Elden-Ring.jpg', '/images/melina.jpg']

// install
self.addEventListener('install', e => {
    console.log('[Service Worker] Install')
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('[Service Worker] Init cache')
            return cache.addAll(cacheList)
        })
    )
})

// fetch
self.addEventListener('fetch', e => {
    if (e.request.url.indexOf('http') === 0) {
        e.respondWith(
            caches.match(e.request).then(res => {
                if (res) {
                    console.log('[Service Worker] Use cache:' + e.request.url)
                    return res
                }
                return fetch(e.request).then(response => {
                    return caches.open(cacheName).then(cache => {
                        console.log('[Service Worker] Caching new:' + e.request.url)
                        cache.put(e.request, response.clone())
                        return response
                    })
                })
            })
        )
    }
})

// activate
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (cacheName.indexOf(key) === -1) {
                        return caches.delete(key)
                    }
                })
            )
        })
    )
})
