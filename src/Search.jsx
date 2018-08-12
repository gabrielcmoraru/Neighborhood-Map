import React, { Component } from 'react';
import { createFilter } from 'react-search-input';
import SideNav from 'react-simple-sidenav';
import Header from './Header';
import Footer from './Footer';

const KEYS_TO_FILTERS = ['name'];

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      filteredLocations: [],
      showNav: true,
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
        <button
          type="button"
          tabIndex="0"
          className="menu-button"
          onClick={() => this.setState({ showNav: true })}
        >
        &#128463; MENU
        </button>
        <SideNav
          tabIndex="1"
          openFromRight
          style={{ overflowScrolling: 'touch' }}
          showNav={this.state.showNav}
          onHideNav={() => this.setState({ showNav: false })}
        >
          <Header />
          <input
            role="search"
            id="Search"
            type="text"
            tabIndex="0"
            placeholder="
          &#128269; Search in the results"
            value={this.state.searchTerm}
            onChange={e => this.searchUpdated(e.target.value)}
          />
          <h2>
          Found
            {' '}
            {filteredLocations.length ? filteredLocations.length : 'no'}
            {' '}
            {filteredLocations.length === 1 ? 'result' : 'results'}
          </h2>
          <ul role="listbox" aria-label="Location list">
            {filteredLocations.map(place => (
              <li
                role="button"
                aria-label="List item"
                tabIndex="0"
                className="LocationItems"
                key={place.id}
                onKeyPress={this.props.populateInfoWindow.bind(this, place.marker)}
                onClick={this.props.populateInfoWindow.bind(this, place.marker)}
              >
                {place.name}
              </li>
            ))}
          </ul>
          <Footer />
        </SideNav>
      </div>
    );
  }
}
