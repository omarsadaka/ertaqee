import React, { Component } from 'react';
import { Image, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class PhotoHorItem extends Component {
  render() {
    console.log('this.props.img:' + this.props.img);
    return (
      <View style={{transform: [{scaleX: -1}]}}>
        <Image
          source={this.props.img}
          style={{
            resizeMode: 'stretch',
            borderRadius: wp('3%'),
            margin: wp('2%'),
            width: wp('35%'),
            height: hp('16.5%'),
          }}
        />
      </View>
    );
  }
}

export default PhotoHorItem;
