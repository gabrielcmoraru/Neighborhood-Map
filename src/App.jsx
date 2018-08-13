import React, { Component } from 'react';
import { createFilter } from 'react-search-input';
import mapStyle from './mapStyle.json';
import * as key from './keys';
import Search from './Search';
import fslogo from './foursquare-logo.png';
import 'Styles/css/App.css';

const KEYS_TO_FILTERS = ['name'];

class App extends Component {
  static defaultProps = {
    center: {
      lat: 51.4276472,
      lng: -0.1701949,
    },
    zoom: 13,
  };

  constructor(props) {
    super(props);
    this.state = {
      foursquare: [],
      locations: [],
      map: '',
      InfoWindow: '',
    };
    this.initMap = this.initMap.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key.gApiKey}&libraries=places&callback=initMap`;
    script.onerror = () => { alert('Error loading Google API'); };

    document.body.appendChild(script);

    const params = {
      ll: `${this.props.center.lat},${this.props.center.lng}`,
      query: 'bar',
    };

    const fsUrl = `https://api.foursquare.com/v2/venues/search?ll=${params.ll}&query=${params.query}&v=20181308&client_id=${key.fsClientId}&client_secret=${key.fsClientSecret}`;

    fetch(fsUrl).then((response) => {
      response.json().then((data) => {
        this.setState({
          foursquare: data.response.venues,
        });
      });
    }).catch((error) => {
      console.log(`Something went wrong please look into this ${error}`);
    });
  }


  initMap() {
    console.log(this.state.foursquare);
    const self = this;
    let map;
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: this.props.center,
      styles: mapStyle,
      zoom: this.props.zoom,
      disableDefaultUI: true,
    });

    const largeInfowindow = new window.google.maps.InfoWindow({});
    const bounds = new window.google.maps.LatLngBounds();
    const locations = [];

    if (this.state.foursquare) {
      this.state.foursquare.map((location) => {
        const id = location.id;
        const marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(location.location.lat, location.location.lng),
          map,
          title: location.name,
          animation: window.google.maps.Animation.DROP,
        });

        location.id = id;
        location.marker = marker;
        locations.push(location);

        bounds.extend(marker.position);

        marker.addListener('click', () => {
          self.populateInfoWindow(marker);
        });

        map.fitBounds(bounds);
      });
    } else { console.log('No data imported from foursquare API'); }

    this.setState({
      locations,
    });
    window.google.maps.event.addListener(largeInfowindow, 'closeclick', () => {
      self.closeWindow(largeInfowindow);
    });

    this.setState({
      map,
      InfoWindow: largeInfowindow,
    });
  }

  populateInfoWindow(marker) {
    const infowindow = this.state.InfoWindow;
    infowindow.marker = marker;
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    window.setTimeout(() => { marker.setAnimation(null); }, 1200);
    infowindow.open(this.state.map, marker);
    this.expandInfoWindow(marker, infowindow);
  }

  expandInfoWindow(marker, infowindow) {
    const detailedMarker = this.state.foursquare.filter(createFilter(marker.title, KEYS_TO_FILTERS));
    infowindow.setContent(`
    <div class='info-box'>
      <h1 class='info-title'>
        ${detailedMarker[0].name}
      </h1>
      <ul class='info-address'>
        <li>
          ${detailedMarker[0].location.formattedAddress[0]}
        </li>
        <li>
          ${detailedMarker[0].location.formattedAddress[1]}
        </li>
        <li>
          ${detailedMarker[0].location.formattedAddress[3]}
        </li>
      </ul>
      <a class='call_to_action' href='https://www.foursquare.com/v/${detailedMarker[0].id}'>
        Check it out on &nbsp;
        <img src=${fslogo} width='20' height='20' alt='FourthSquare Logo' />
        <span class='fs_logo'>
        oursquare
        </span>
      </a>
    </div>`);
  }

  closeWindow(infowindow) {
    infowindow.marker = '';
  }

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <Search locations={this.state.locations} populateInfoWindow={this.populateInfoWindow} />
        </div>
        <div id="map" role="application" aria-label="Map with locations" />
      </div>
    );
  }
}

export default App;
