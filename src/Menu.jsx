import React, { Component } from 'react';
import 'Styles/css/App.css';
import Search from './Search';

export default class Menu extends Component {
  render() {
    let visibility = 'hide';

    if (this.props.menuVisibility) {
      visibility = 'show';
    }

    return (
      <div
        id="flyoutMenu"
        className={visibility}
      >
        <h2>

          <a href="#" onMouseDown={this.props.handleMouseDown}>
        Home
          </a>
        </h2>
        <Search locations={this.props.locations} populateInfoWindow={this.props.populateInfoWindow} />
      </div>
    );
  }
}
