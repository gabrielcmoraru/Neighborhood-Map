import React, { Component } from 'react';
import './App.css';
import mapStyle from './mapStyle.json';
import * as key from './keys.js';

const foursquare = require('react-foursquare')({
  clientID: key.fsClientId,
  clientSecret: key.fsClientSecret,
});

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
    window.google.maps.event.addListener(largeInfowindow, 'closeclick', () => {
      self.closeWindow(largeInfowindow);
    });

    this.setState({
      map,
      InfoWindow: largeInfowindow,
    });

    const locations = [];
    this.state.foursquare.forEach((location) => {
      const id = location.name;
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
    console.log(this.state.foursquare);
    console.log(this.state.locations);
  }

  populateInfoWindow(marker) {
    const infowindow = this.state.InfoWindow;
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent(`<h1>${marker.title}</h1>`);
      infowindow.open(this.state.map, marker);
  }

  closeWindow(infowindow) {
    infowindow.marker = '';
  }

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <h1 id="title">
            Googler
          </h1>
        </div>
        <div id="map" role="application" aria-label="Map with locations" />
      </div>
    );
  }
}

export default App;
