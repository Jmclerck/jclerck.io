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
    return { [key]: value, ...prev };
  }, {});
};

const maps = () => {
  const maps = document.createElement(`script`);
  maps.setAttribute('defer', '');
  maps.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAIzu8NUUUfOxBSWUfjrvlWUkmHO9YUfKo`;
  maps.onload = () => {
    const elem = document.querySelector(`.map`);
    const map = new google.maps.Map(elem, { center: { lat: 55.948913, lng: -3.194697 }, zoom: 13 });
    const marker = new google.maps.Marker({ position: { lat: 55.948913, lng: -3.194697 } });
    marker.setMap(map);
  };
  document.body.appendChild(maps);
};

const translations = () => {
  return fetch(`translations.json`)
    .then(res => res.json())
    .then(data => {
      const attr = `data-translate-key`;
      const labels = data[searchParams().lang || `en-gb`];
      const elements = Array.from(document.querySelectorAll(`[${attr}]`));

      elements.forEach(elem => {
        const path = elem.getAttribute(`${attr}`);

        if (path) {
          const text = path.split(`/`).reduce((prev, part) => prev[part], labels);

          if (elem.tagName === 'UL') {
            text.forEach(item => {
              const link = document.createElement('a');
              link.href = item.link;
              link.target = '_blank';
              link.innerText = item.name;

              const listItem = document.createElement('li');
              listItem.appendChild(link);

              elem.appendChild(listItem);
            });
          } else if (elem.tagName === `IMG`) {
            elem.setAttribute(`alt`, text);
          } else {
            elem.innerHTML = text;
          }
        }
      });
    });
};

document.addEventListener(`DOMContentLoaded`, () => {
  maps();
  translations();
});
