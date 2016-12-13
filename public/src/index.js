if (`serviceWorker` in navigator) {
	navigator.serviceWorker.register(`sw.js`);

	// navigator.serviceWorker.ready.then(registration => {
		// const config = {
		// 	applicationServerKey: new Uint8Array([`...`]),
		// 	userVisibleOnly: true,
		// };

		// registration.pushManager.subscribe(config).then(subscription => {
		// 	const headers = new Headers();

		// 	headers.append(`Content-Type`, `application/json`);

		// 	return fetch(`/push`, {
		// 		method: `POST`,
		// 		headers,
		// 		body: JSON.stringify({
		// 			endpoint: subscription.endpoint,
		// 		}),
		// 	});
		// });
	// });
}

const searchParams = () => {
	return location.search.substring(1).split(`&`).reduce((prev, param) => {
		const [ key, value ] = param.split(`=`);
		return {
			[key]: value,
			...prev
		};
	}, {});
}

const dropcaps = () => {
	document.querySelectorAll(`.dropcaps`).forEach(elem => {
		const [first, rest] = [elem.innerText.substring(0, 1), elem.innerText.substring(1)];

		const span = document.createElement(`span`);
		span.classList.add(`dropcap`);
		span.innerText = first;

		elem.innerHTML = `${span.outerHTML}${rest}`;
	});

	const caps = document.createElement(`script`);
	caps.src = `../dropcap.js/dropcap.min.js`;
	caps.onload = () => {
		const dropcaps = document.querySelectorAll(`.dropcap`);
		window.Dropcap.layout(dropcaps, 3);
	};
	document.body.appendChild(caps);
};

const maps = () => {
	const maps = document.createElement(`script`);
	maps.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAIzu8NUUUfOxBSWUfjrvlWUkmHO9YUfKo`;
	maps.onload = () => {
		const elem = document.querySelector(`.map`);

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
	document.body.appendChild(maps);
};

const translations = () => {
	return fetch(`translations.json`)
		.then(res => res.json())
		.then(data => {
			const attr = `data-translate-key`
			const labels = data[searchParams().lang || `en-gb`];

			document.querySelectorAll(`[${attr}]`).forEach(elem => {
				const path = elem.getAttribute(`${attr}`);

				if (path) {
					const text = path.split(`/`).reduce((prev, part) => prev[part], labels);

					if (elem.tagName === `IMG`) {
						elem.setAttribute(`alt`, text);
					} else {
						elem.innerText = text;
					}
				}
			});
		});
};

document.addEventListener(`DOMContentLoaded`, () => {
	maps();
	translations().then(dropcaps);
});
