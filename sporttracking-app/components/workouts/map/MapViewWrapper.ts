/* eslint-disable */
import { Platform } from 'react-native';

let MapView;
let Polyline;

if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
  Polyline = require('react-native-maps').Polyline;
}

export default MapView;
export { Polyline };
