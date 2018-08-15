import React, { Component } from 'react';
import { createFilter } from 'react-search-input';
import mapStyle from './mapStyle.json';
import * as key from './keys';
import { foursquareAPI, googleAPI, infoWindowData } from './constants';
import Search from './Search';
import 'Styles/css/App.css';

const KEYS_TO_FILTERS = ['name'];


/* Everything below is properly explained in the Google API documentation.
 https://developers.google.com/maps/documentation/javascript/tutorial  */

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

  async componentWillMount() {
    window.initMap = this.initMap;
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `${googleAPI}js?key=${key.gApiKey}&libraries=places`;
    script.onerror = () => {
      document.getElementsByClassName('active-status')[0].innerHTML = '<h2>Google Maps ran into some issues please refresh</h2>';
    };

    document.body.appendChild(script);

    const params = {
      ll: `${this.props.center.lat},${this.props.center.lng}`,
      query: 'bar',
    };

    const fsUrl = `${foursquareAPI}search?ll=${params.ll}&query=${params.query}&v=20181308&client_id=${key.fsClientId}&client_secret=${key.fsClientSecret}`;

    const response = await fetch(fsUrl);
    const data = await response.json();
    this.setState({
      foursquare: data.response.venues,
    });

    window.setTimeout(this.initMap, 100);
  }

  initMap() {
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
    } else {
      document.getElementsByClassName('active-status')[0].innerHTML = '<h3>Foursquare data error !<br/> Please refresh page</h3>';
    }

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
    infowindow.setContent(infoWindowData(detailedMarker));
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
