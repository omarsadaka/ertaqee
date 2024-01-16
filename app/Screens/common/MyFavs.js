import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { NewCoursesScroll } from '../common';
import NewCoursesItem from './Items/NewCoursesItem';

class MyFavs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  ReservationsItems = () => {
    let Items = [];
    for (let i = 0; i < 8; i++)
      Items.push(
        <NewCoursesItem
          key={i}
          IsVer={true}
          navigation={this.props.navigation}
          CartItem={true}
          IsFav={true}
        />,
      );
    Items.push(<View key={-1} style={{width: wp('50%'), height: hp('15%')}} />);
    return Items;
  };

  Items() {
    return (
      <View
        style={{
          marginTop: hp('1%'),
          alignSelf: 'center',
          width: wp('100%'),
          height: hp('46%'),
        }}>
        <NewCoursesScroll
          API={'https://www.demo.ertaqee.com/api/v1/profile/favorites/'}
          PaginationParm={'favorites'}
          // Items={this.ReservationsItems()}
          // ViewAll={false} IsVer={true}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  render() {
    return (
      <View
        style={{alignItems: 'center', width: wp('100%'), height: hp('100%')}}>
        <Image
          style={styles.BackGroundLogo}
          source={require('../../res/backgroundlogo.png')}
        />
        {this.Items()}
      </View>
    );
  }
}

export { MyFavs };
const styles = StyleSheet.create({
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-7%'),
    bottom: hp('1%'),
    resizeMode: 'contain',
    width: wp('65%'),
    height: hp('25%'),
  },
});
