import React, { Component } from 'react';
import './App.css';
import * as key from './keys.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  initMap() {
    const self = this;
    let map;
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 51.4276472,
        lng: -0.1701949,
      },
      zoom: 13,
    });

    const InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, 'closeclick', () => self.closeWindow(InfoWindow));

    this.setState({
      map,
      InfoWindow,
    });

    const locations = [];
    this.state.locations.forEach((location) => {
      const id = location.name;
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.lat, location.lng),
        latitude: location.lat,
        longitude: location.lng,
        map,
        title: location.name,
      });
      location.id = id;
      location.marker = marker;
      locations.push(location);
      marker.addListener('click', () => self.populateInfoWindow(marker));
    });

    this.setState({
      locations,
    });
  }

  populateInfoWindow(marker) {
  }

  closeWindow(InfoWindow) {
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
