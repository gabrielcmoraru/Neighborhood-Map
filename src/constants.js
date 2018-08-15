import fslogo from './foursquare-logo.png';

const googleAPI = 'https://maps.googleapis.com/maps/api/';
const foursquareAPI = 'https://api.foursquare.com/v2/venues/';

const infoWindowData = detailedMarker => (
  `<div class='info-box'>
      <h1 class='info-title'>
        ${detailedMarker[0].name}
      </h1>
      <ul class='info-address'>
        <li>
          ${detailedMarker[0].location.formattedAddress[0]}
        </li>
        <li>
          ${detailedMarker[0].location.formattedAddress[1]}
        </li>
        <li>
          ${detailedMarker[0].location.formattedAddress[3]}
        </li>
      </ul>
      <a class='call_to_action' href='https://www.foursquare.com/v/${detailedMarker[0].id}'>
        Check it out on &nbsp;
        <img src=${fslogo} width='20' height='20' alt='FourthSquare Logo' />
        <span class='fs_logo'>
        oursquare
        </span>
      </a>
    </div>`
);

export {
  googleAPI,
  foursquareAPI,
  infoWindowData,
};
