import React, { Component } from 'react';
import 'Styles/css/App.css';


export default class MenuButton extends Component {
  render() {
    return (
      <button
        id="roundButton"
        onMouseDown={this.props.handleMouseDown}
      />
    );
  }
}
