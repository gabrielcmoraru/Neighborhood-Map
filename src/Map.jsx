import React, { Component, Fragment } from 'react';
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';
import SearchInput, { createFilter } from 'react-search-input';
import mapStyle from './mapStyle.json';
import Marker from './Marker';

const foursquare = require('react-foursquare')({
  clientID: 'MDL3L4ZAR3BCRYQGBLUNCH5FW1CYY43XJQCCIAAJFH1HM21M',
  clientSecret: 'XKLCEBLVI125M2WMHTJN3JGH33EPBMI5FGV2F3MPBJBPTRLY',
});

const KEYS_TO_FILTERS = ['name'];
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
    zoom: 13,
  };

  constructor(props) {
    super(props);
    this.state = {
      foursquare: [],
      searchTerm: '',
      searchResults: [],
      active: [],
    };
    this.searchUpdated = this.searchUpdated.bind(this);
    this.handler = this.handler.bind(this);
  }

  componentDidMount() {
    foursquare.venues.getVenues(params)
      .then((res) => {
        this.setState({
          foursquare: res.response.venues,
          searchResults: res.response.venues,
        });
        console.log(res.response.venues);
      });
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term.toLocaleLowerCase() });

    const filteredLocations = this.state.foursquare.filter(createFilter(this.state.searchTerm.toLocaleLowerCase(), KEYS_TO_FILTERS));
    this.setState({ searchResults: filteredLocations });
  }

  handler = (item) => {
    console.log(item);
  }

  render() {
    console.log(this.state.active);
    return (
      // Important! Always set the container height explicitly
      <Fragment>
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact
            options={{ styles: mapStyle }}
            bootstrapURLKeys={{ key: 'AIzaSyDuVUBfjdAwk8mVwkhVZl794692wvszwi8' }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}

          >
            { this.state.searchResults.map(item => (
              <Marker key={item.id} active={this.state.active} item={item} lat={item.location.lat} lng={item.location.lng} />))}
          </GoogleMapReact>
          <SearchObject
            filteredLocations={this.state.searchResults}
          >
            <SearchInput style={{ width: '100%', height: '100%' }} onChange={this.searchUpdated} />
            <SearchList filteredLocations={this.filteredLocations}>
              {this.state.searchResults.map(item => (
                <li key={item.id} item={item} onClick={() => this.handler(item)}>
                  {item.name}
                </li>
              ))}
            </SearchList>
          </SearchObject>
        </div>
      </Fragment>
    );
  }
}

export default Map;

export const SearchObject = styled.div`
display: inline-grid;
border: 1px solid black;
`;

export const SearchList = styled.ul`
  list-style:none;
  margin:0;
  padding:0;
  height:100%;
  width:200px;
`;
