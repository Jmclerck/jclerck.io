'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');

  navigator.serviceWorker.ready.then(registration => {
    registration.pushManager.getSubscription()
      .then(subscription => {
        return subscription ? subscription : registration.pushManager.subscribe({
          userVisibleOnly: true,
        });
      });
  });
}
