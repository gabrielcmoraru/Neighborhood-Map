import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  Toggle, fspink, blu, oranje, grey, black,
} from 'Utilities';
import { Modal } from 'Elements';
import fslogo from './foursquare-logo.png';

const Marker = ({ item }) => (
  <Toggle>
    {({ on, toggle }) => (
      <Fragment>
        <MarkerPoint onClick={toggle} key={item.id} lat={item.location.lat} lng={item.location.lng} />
        <Modal on={on} toggle={toggle}>
          <div>
            <Title>
              {item.name}
            </Title>
            <Address>
              <li>
                {item.location.formattedAddress[0]}
              </li>
              <li>
                {item.location.formattedAddress[1]}
              </li>
              <li>
                {item.location.formattedAddress[3]}
              </li>
              <li>
                {item.location.formattedAddress[4]}
              </li>
            </Address>
            <Cta href={`https://www.foursquare.com/v/${item.id}`}>
              Check out &nbsp;
              {item.name}
              &nbsp;
              on &nbsp;
              <img src={fslogo} width="20" height="20" />
              <span style={{ color: `${fspink}` }}>
              oursquare
              </span>
            </Cta>
          </div>
        </Modal>
      </Fragment>
    )}
  </Toggle>
);

export default Marker;

export const MarkerPoint = styled.button`
background: ${blu};
cursor: pointer;
width: 2em;
height: 2em;
display: inline-block;
border-radius: 100%;
&:hover {
  width: 2.2em;
  height: 2.2em;
  background:${oranje};
}
`;

export const Title = styled.h1`
  text-align: center;
`;

export const Address = styled.ul`
  list-style-type: none;
  padding:0;
  text-align: center;
`;

export const Cta = styled.a`
  display: flex;
  font-weight:500;
  border-radius: 2px;
  padding: 0.7em;
  text-decoration: none;
  color: black;
  &:hover {
    text-decoration: italic;
    color:${grey};
    background:${black};
  }
`;
