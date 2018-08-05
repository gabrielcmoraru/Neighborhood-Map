import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import mapStyle from './mapStyle.json';
import Marker from './Marker';

const foursquare = require('react-foursquare')({
  clientID: 'MDL3L4ZAR3BCRYQGBLUNCH5FW1CYY43XJQCCIAAJFH1HM21M',
  clientSecret: 'XKLCEBLVI125M2WMHTJN3JGH33EPBMI5FGV2F3MPBJBPTRLY',
});

const params = {
  ll: '51.4276472,-0.1701949',
  query: 'bar',
};

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 51.4276472,
      lng: -0.1701949,
    },
    zoom: 16,
  };

  constructor(props) {
    super(props);
    this.state = {
      foursquare: [],
    };
  }

  componentDidMount() {
    foursquare.venues.getVenues(params)
      .then((res) => {
        this.setState({ foursquare: res.response.venues });
        console.log(this.state.foursquare);
      });
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          options={{ styles: mapStyle }}
          bootstrapURLKeys={{ key: 'AIzaSyDuVUBfjdAwk8mVwkhVZl794692wvszwi8' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          { this.state.foursquare.map(item => (
            <Marker key={item.id} item={item} lat={item.location.lat} lng={item.location.lng} />))}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
