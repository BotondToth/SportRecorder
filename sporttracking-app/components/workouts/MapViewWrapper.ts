import { Platform } from 'react-native';

// eslint-disable-next-line import/no-mutable-exports
let MapView;
// eslint-disable-next-line import/no-mutable-exports
let Polyline;

if (Platform.OS !== 'web') {
  // eslint-disable-next-line global-require
  MapView = require('react-native-maps').default;
  // eslint-disable-next-line global-require
  Polyline = require('react-native-maps').Polyline;
}

export default MapView;
export { Polyline };
