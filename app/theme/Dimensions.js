import {Dimensions} from 'react-native';

export default {
    DEVICE_WIDTH: Dimensions.get('window').width,
    DEVICE_WIDTH_HALF: Dimensions.get('window').width / 2,
    DEVICE_WIDTH_QUARTER: Dimensions.get('window').width / 4,
    DEVICE_HEIGHT: Dimensions.get('window').height,
    DEVICE_HEIGHT_HALF: Dimensions.get('window').height / 2,
    DEVICE_HEIGHT_QUARTER: Dimensions.get('window').height / 4,
};
