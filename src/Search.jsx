import React, { Component } from 'react';
import { createFilter } from 'react-search-input';

const KEYS_TO_FILTERS = ['name'];

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      filteredLocations: [],
    };
  }

  searchUpdated = (searchTerm) => {
    const lowSearch = searchTerm.toLowerCase();

    this.setState({ searchTerm: lowSearch });

    this.props.locations.map((location) => {
      const lowLocation = location.name.toLowerCase();

      if (lowLocation.indexOf(lowSearch) >= 0) {
        location.marker.setVisible(true);
      } else {
        location.marker.setVisible(false);
      }
    });
  }

  render() {
    let filteredLocations;
    if (this.state.searchTerm) {
      filteredLocations = this.props.locations.filter(createFilter(this.state.searchTerm.toLocaleLowerCase(), KEYS_TO_FILTERS));
    } else {
      filteredLocations = this.props.locations;
    }

    return (
      <div id="location-list">
        <input
          role="search"
          id="Search"
          type="text"
          placeholder="Search for a Location"
          value={this.state.searchTerm}
          onChange={e => this.searchUpdated(e.target.value)}
        />
        <ul role="listbox" aria-label="Location list">
          {filteredLocations.map(place => (
            <li role="button" aria-label="List item" tabIndex="0" className="LocationItems" key={place.name} onClick={this.props.populateInfoWindow.bind(this, place.marker)}>
              {place.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
