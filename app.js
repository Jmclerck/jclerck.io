'use strict';

let registerPushSubscription = subscription => {
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');

  return fetch('https://registration.jclerck.io/push', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    }),
  });
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');

  navigator.serviceWorker.ready.then(registration => {
    registration.pushManager.getSubscription()
      .then(subscription => {
        return subscription ?
          registerPushSubscription(subscription) :
          registration.pushManager.subscribe({
            userVisibleOnly: true,
          }).then(registerPushSubscription);
      });
  });
}
