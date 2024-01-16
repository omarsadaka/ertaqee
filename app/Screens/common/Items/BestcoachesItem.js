import React, { Component } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class BestCoachesItem extends Component {
  Nav(ID) {
    this.props.navigation.navigate('CoachDetails', {
      ItemID: ID,
    });
  }

  render() {
    let Data = this.props.item;
    return (
      <TouchableOpacity
        onPress={() => this.Nav(Data.id)}
        style={{transform: [{scaleX: -1}]}}>
        <ImageBackground
          source={{uri: Data.photo}}
          imageStyle={{borderRadius: wp('3%')}}
          style={{margin: wp('2%'), width: wp('35%'), height: hp('16.5%')}}>
          <View
            style={{
              position: 'absolute',
              borderRadius: wp('3%'),
              width: wp('35%'),
              height: hp('16.5%'),
              backgroundColor: 'black',
              opacity: 0.2,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              width: wp('52%'),
              height: hp('16.5%'),
            }}>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: wp('3%'),
                marginTop: hp('7%'),
                marginLeft: wp('2%'),
              }}>
              {Data.full_name}
            </Text>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: wp('2%'),
                marginLeft: wp('2%'),
              }}>
              {Data.job_title}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export default BestCoachesItem;

const styles = StyleSheet.create({
  BackArrow: {resizeMode: 'contain', width: wp('4%'), height: hp('3.5%')},
});
