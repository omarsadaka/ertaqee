import React, { Component } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class BestCoachesItemCircle extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          marginTop: hp('1%'),
          alignItems: 'center',
          width: wp('30%'),
          transform: [{scaleX: -1}],
        }}>
        <Image
          style={{width: wp('20%'), height: hp('12%')}}
          resizeMode='contain'
          source={
            this.props.Img
              ? this.props.Img
              : require('../../../res/userimg.png')
          }
        />
        <Text style={{color: 'grey', fontSize: wp('3%')}}>
          {this.props.Title}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default BestCoachesItemCircle;
