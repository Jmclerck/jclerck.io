'use strict';

let maxImages = 10;
let method = 'flickr.photos.search';
let apiKey = '10ee7fb7b6863856e45325ea1c26a9b2';
let tags = 'lego';

let flickrParse = json => {
  if (json.stat === 'ok') {
    let imageList = json.photos.photo;

    for (let i = 0, l = maxImages; i < l; i++) {
      let id = imageList[i].id;
      let farm = imageList[i].farm;
      let server = imageList[i].server;
      let secret = imageList[i].secret;
      let image = document.createElement('img');
      image.src = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
      document.body.appendChild(image);
    }
  }
};

fetch(`https://api.flickr.com/services/rest/?api_key=${apiKey}&format=json&method=${method}&tags=${tags}&nojsoncallback=1`)
  .then(res => res.json())
  .then(flickrParse);
