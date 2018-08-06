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
        <SearchList>
          <SearchInput onChange={this.searchUpdated} />
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


// export default class Search extends Component {
//   constructor() {
//     super();
//     this.state = {
//       search: '',
//     };
//   }


//   render() {
//     const filteredLocations = this.props.items.filter(
//       (location) => {
//         location.name.indexOf(this.state.search) !== -1;
//         console.log(filteredLocations);
//       },
//     );
//     return (
//       <SearchObject>
//         <input
//           type="text"
//           value={this.state.search}
//           onChange={this.updateSearch.bind(this)}
//         />
//         <SearchList>
//           {filteredLocations.map(item => (
//             <li key={item.id} item={item}>
//               {item.name}
//             </li>
//           ))}
//         </SearchList>
//       </SearchObject>
//     );
//   }

//   updateSearch(event) {
//     this.setState({
//       search: event.target.value.substr(0, 20),
//     });
//   }
// }


export const SearchObject = styled.div`
    display: inline-block;
    width:80%;
`;

export const SearchList = styled.ul`
  list-style:none;
  padding:0;
  background:#888;
  height:100%;
  width:30%;
`;
