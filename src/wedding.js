const searchParams = () =>
  location.search.substring(1).split(`&`).reduce((prev, param) => {
    const [key, value] = param.split(`=`);
    return {
      [key]: value,
      ...prev,
    };
  }, {});

const maps = () => {
  const maps = document.createElement(`script`);
  maps.setAttribute('defer', '');
  maps.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBTqJ8dlbsgcLF6LxaEFGxHIGvA12QHhUs`;
  maps.onload = () => {
    const elem = document.querySelector(`.map`);
    const map = new google.maps.Map(elem, { center: { lat: 55.948913, lng: -3.194697 }, zoom: 13 });
    const marker = new google.maps.Marker({ position: { lat: 55.948913, lng: -3.194697 } });
    marker.setMap(map);
  };
  document.body.appendChild(maps);
};

const translations = async () => {
  const attr = `data-translate-key`;
  const lang = searchParams().lang || `en-gb`;
  const elements = Array.from(document.querySelectorAll(`[${attr}]`));

  try {
    const res = await fetch(`translations/${lang}.json`);
    const labels = await res.json();

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
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener(`DOMContentLoaded`, () => {
  maps();
  translations();
});
