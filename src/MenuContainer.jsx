import React, { Component, Fragment } from 'react';
import MenuButton from 'MenuButton';
import Menu from './Menu';


export default class MenuContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      visible: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  handleMouseDown(e) {
    this.toggleMenu();

    console.log('clicked');
    e.stopPropagation();
  }

  toggleMenu() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <Fragment>
        <MenuButton handleMouseDown={this.handleMouseDown} />
        <Menu
          locations={this.props.locations}
          populateInfoWindow={this.props.populateInfoWindow}
          handleMouseDown={this.handleMouseDown}
          menuVisibility={this.state.visible}
        />

      </Fragment>
    );
  }
}
