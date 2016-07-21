const registerForPush = subscription => {
	const headers = new Headers();

	headers.append('Content-Type', 'application/json');

	return fetch('/push', {
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
		const config = {
			userVisibleOnly: true,
		};

		registration.pushManager.getSubscription()
			.then(subscription => subscription ? registerForPush(subscription) : registration.pushManager.subscribe(config).then(registerForPush));
	});
}
