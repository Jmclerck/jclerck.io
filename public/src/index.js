if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js');

	// navigator.serviceWorker.ready.then(registration => {
		// const config = {
		// 	applicationServerKey: new Uint8Array(['...']),
		// 	userVisibleOnly: true,
		// };

		// registration.pushManager.subscribe(config).then(subscription => {
		// 	const headers = new Headers();

		// 	headers.append('Content-Type', 'application/json');

		// 	return fetch('/push', {
		// 		method: 'POST',
		// 		headers,
		// 		body: JSON.stringify({
		// 			endpoint: subscription.endpoint,
		// 		}),
		// 	});
		// });
	// });
}

document.addEventListener('DOMContentLoaded', () => {
	const body = document.body;

	const caps = document.createElement('script');
	caps.src = '../dropcap.js/dropcap.min.js';
	caps.onload = () => {
		const dropcaps = document.querySelectorAll('.dropcap');
		window.Dropcap.layout(dropcaps, 3);
	};
	body.appendChild(caps);

	const maps = document.createElement('script');
	maps.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAIzu8NUUUfOxBSWUfjrvlWUkmHO9YUfKo';
	maps.onload = () => {
		const elem = document.querySelector('.map');

		const map = new google.maps.Map(elem, {
			center: {
				lat: 55.948913,
				lng: -3.194697,
			},
			zoom: 13,
		});

		const marker = new google.maps.Marker({
			position: {
				lat: 55.948913,
				lng: -3.194697,
			},
		});

		marker.setMap(map);
	};
	body.appendChild(maps);
});
