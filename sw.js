self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Core Studio', {
    body: d.body || '', icon: 'corecard-192.png', badge: 'corecard-192.png', data: { url: d.url || 'estrellas.html' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || 'estrellas.html';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ls => {
    for (const c of ls) if (c.url.indexOf('estrellas') > -1 && 'focus' in c) return c.focus().then(w => (w && w.navigate ? w.navigate(url) : w)).catch(() => self.clients.openWindow(url));
    return self.clients.openWindow(url);
  }));
});
