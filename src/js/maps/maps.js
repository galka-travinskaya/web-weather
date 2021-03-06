import refs from '../refs';
import darkTheme from './mapThemeDark.json';

let geocoder;
let map;

export default class MyMap {
  constructor() {}

  initializeMap(mapStyle = []) {
    // let mapStyle;
    // if (localStorage.getItem('theme') === 'DARK') {
    //     mapStyle = darkTheme;
    // } else {
    //     mapStyle = []
    // }
    geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(47.563, 24.113);
    const mapOptions = {
      zoom: 2,
      center: latlng,
      styles: mapStyle,
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  eventListenerOnButtons({ target }) {
    map.overlayMapTypes.pop();

    if (target.dataset.layer === 'remove') {
      this.initializeMap();
      this.codeAddress();
      return;
    }

    this.addRadar(target.dataset.layer, '50');
  }

  addRadar(layer, opacity) {
    const radar = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        return [
          `https://maps.aerisapi.com/2maTDvFREtWHurd6iYTyL_uD8Jme8ANIunPUXr5vzU1jfyuED7pWqcU88lahdq/${layer}:${opacity}/`,
          zoom,
          '/',
          coord.x,
          '/',
          coord.y,
          '/current.png',
        ].join('');
      },
      tileSize: new google.maps.Size(256, 256),
    });

    map.overlayMapTypes.push(radar);
  }

  codeAddress() {
    const address = refs.headerInput.value;

    geocoder.geocode({ address }, function (results, status) {
      if (status === 'OK') {
        map.zoom = 7;
        map.setCenter(results[0].geometry.location);
        const marker = new google.maps.Marker({
          map,
          position: results[0].geometry.location,
        });
      } else {
        swal({
          title: 'Выберите пожалуйста ваш город!',
          icon: 'info',
        });
      }
    });
  }
}
