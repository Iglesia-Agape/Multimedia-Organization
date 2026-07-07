// Service Worker para notificaciones push del tablero "Ministerio Media".
// Se encarga de dos cosas: mostrar la notificación cuando llega un push,
// y abrir/enfocar la app cuando alguien toca esa notificación.

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    let datos = { titulo: 'Ministerio Media', cuerpo: 'Tienes una nueva notificación.' };
    try {
        if (event.data) datos = event.data.json();
    } catch (err) {
        if (event.data) datos.cuerpo = event.data.text();
    }

    const opciones = {
        body: datos.cuerpo || '',
        icon: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=200',
        badge: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=100',
        tag: 'ministerio-media',
        renotify: true,
        data: { url: datos.url || './' }
    };

    event.waitUntil(self.registration.showNotification(datos.titulo || 'Ministerio Media', opciones));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlDestino = (event.notification.data && event.notification.data.url) || './';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((listaClientes) => {
            for (const cliente of listaClientes) {
                if ('focus' in cliente) return cliente.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow(urlDestino);
        })
    );
});
