// シフト管理アプリ Service Worker
// 役割はプッシュ通知の表示とアイコンバッジ更新のみ。
// fetch ハンドラは持たない（オフラインキャッシュはせず、Hosting の no-cache 配信に任せる）。

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
    let payload = {};
    try { payload = event.data.json(); } catch (e) { /* data なし push は既定文言で表示 */ }
    const d = payload.data || {};
    event.waitUntil((async () => {
        // iOS は silent push を許さないため、push を受けたら必ず通知を表示する
        await self.registration.showNotification(d.title || 'シフト管理アプリ', {
            body: d.body || '新しい申請があります',
            tag: 'shift-app-request-' + (d.requestId || Date.now()),
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            data: { url: '/index.html' }
        });
        if ('setAppBadge' in navigator) {
            const n = parseInt(d.badgeCount || '0', 10);
            try {
                if (n > 0) { await navigator.setAppBadge(n); }
                else { await navigator.clearAppBadge(); }
            } catch (e) { /* バッジ非対応環境では無視 */ }
        }
    })());
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil((async () => {
        const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        if (wins.length > 0) return wins[0].focus();
        return self.clients.openWindow((event.notification.data && event.notification.data.url) || '/index.html');
    })());
});
