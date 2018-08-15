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
      showNav: true,
    };
  }

  /* Set the marker to visible if the name matches the search term, hide if it doesn't  */
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

  /* Update array with items matching search term if no search show all items.
     This array will be used to populate the location list.
  */

  render() {
    let filteredLocations;
    if (this.state.searchTerm) {
      filteredLocations = this.props.locations.filter(createFilter(this.state.searchTerm.toLocaleLowerCase(), KEYS_TO_FILTERS));
    } else {
      filteredLocations = this.props.locations;
    }
    const { populateInfoWindow } = this.props;
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
            aria-label="Search in the results"
            placeholder="
          &#128269; Search in the results"
            value={this.state.searchTerm}
            onChange={e => this.searchUpdated(e.target.value)}
          />
          <h2 className="active-status">
          Found
            {' '}
            {filteredLocations.length ? filteredLocations.length : 'no'}
            {' '}
            {filteredLocations.length === 1 ? 'result' : 'results'}
          </h2>
          <ul role="menu" aria-label="Location list">
            {filteredLocations.map(place => (
              <li
                role="menuitem"
                aria-label="List item"
                tabIndex="0"
                className="LocationItems"
                key={place.id}
                onKeyPress={populateInfoWindow.bind(this, place.marker)}
                onClick={populateInfoWindow.bind(this, place.marker)}
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
