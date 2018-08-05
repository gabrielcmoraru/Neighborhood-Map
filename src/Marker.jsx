import React from 'react';
import styled from 'styled-components';
import Toggle from './ToggleInfo';

const Marker = ({ item }) => (
  <Toggle>
    {({ on, toggle }) => (
      <div>
        {on && (
        <InfoMarker>
          {item.name}<hr/>
          {item.location.address}<hr/>
          {item.hereNow.summary}
        </InfoMarker>
        )}
        <MarkerPoint onClick={toggle} key={item.id} lat={item.location.lat} lng={item.location.lng} />
      </div>
    )}
  </Toggle>
);

export default Marker;

export const MarkerPoint = styled.button`
  background: red;
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  border-radius: 100%;
  &:hover {
    content:"X";
    width: 2.2em;
    height: 2.2em;
    background:black;
  }
`;
export const InfoMarker = styled.div`
  width:10em;
  height:10em;
  background:white;
  border: 1px solid black;
`;
