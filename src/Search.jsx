import React, { Component } from 'react';
import styled from 'styled-components';
import SearchInput, { createFilter } from 'react-search-input';


const KEYS_TO_FILTERS = ['name'];

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
    this.searchUpdated = this.searchUpdated.bind(this);
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term.toLocaleLowerCase() });
  }

  render() {
    const filteredLocations = this.props.items.filter(createFilter(this.state.searchTerm.toLocaleLowerCase(), KEYS_TO_FILTERS));
    return (
      <SearchObject>
        <SearchInput style={{ width: '100%', height: '100%' }} onChange={this.searchUpdated} />
        <SearchList filteredLocations={this.filteredLocations}>
          {filteredLocations.map(item => (
            <li key={item.id}>
              {item.name}
            </li>
          ))}
        </SearchList>
      </SearchObject>
    );
  }
}


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
