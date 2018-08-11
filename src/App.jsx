import React, { Component } from 'react';
import 'Styles/css/App.css';
import { createFilter } from 'react-search-input';
import MenuContainer from './MenuContainer';
import mapStyle from './mapStyle.json';
import * as key from './keys.js';
import Search from './Search';
import fslogo from './foursquare-logo.png';
import Header from './Header';
import Footer from './Footer';

const foursquare = require('react-foursquare')({
  clientID: key.fsClientId,
  clientSecret: key.fsClientSecret,
});

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

  componentWillMount() {
    window.initMap = this.initMap;
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key.gApiKey}&libraries=places&callback=initMap`;
    script.onerror = () => { alert('Error loading Google API'); };

    document.body.appendChild(script);
  }

  componentDidMount() {
    const params = {
      ll: `${this.props.center.lat},${this.props.center.lng}`,
      query: 'bar',
    };
    foursquare.venues.getVenues(params)
      .then((res) => {
        this.setState({
          foursquare: res.response.venues,
        });
      });
  }

  initMap() {
    const self = this;
    let map;
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: this.props.center,
      styles: mapStyle,
      zoom: this.props.zoom,
    });

    const largeInfowindow = new window.google.maps.InfoWindow({});
    const bounds = new window.google.maps.LatLngBounds();
    const locations = [];

    this.state.foursquare.forEach((location) => {
      const id = location.id;
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.location.lat, location.location.lng),
        map,
        title: location.name,
        // animation: window.google.maps.Animation.DROP,
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

    console.log(this.state.foursquare);
    console.log(this.state.locations);
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
    console.log(detailedMarker);
    console.log(this.state.foursquare);
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
        <img src=${fslogo} width='20' height='20' />
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
          <MenuContainer locations={this.state.locations} populateInfoWindow={this.populateInfoWindow} />
          {/* <Header />
          <Search locations={this.state.locations} populateInfoWindow={this.populateInfoWindow} />
          <Footer /> */}
        </div>
        <div id="map" role="application" aria-label="Map with locations" />
      </div>
    );
  }
}

export default App;
