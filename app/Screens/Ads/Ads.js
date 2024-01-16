import React, { Component } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
import { ReloadScreen } from '../common';
import strings from '../strings';
import fonts from '../../fonts';

class Ads extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.state = {
      loading: false,
      Data: '',
      ShowReloadBTN: false,
      CurrentScrollIndex: 0,
    };
  }

  componentDidMount() {
    // this.ShowReloadBTN();
  }

  ShowReloadBTN() {
    alert(strings.noDataToShow);
    this.setState({ShowReloadBTN: true, loading: false});
  }

  ReloadBTN() {
    console.log('ReloadBTN');
    this.setState({Data: '', loading: true, ShowReloadBTN: false});
    // this.GetData();
  }

  Dot() {
    return (
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,.13)',
          width: 21,
          height: 3,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3,
        }}
      />
    );
  }

  SeeAll() {
    this.props.navigation.navigate('NewCourses', {
      Title: strings.Ads,
      IsMiddleTitle: strings.Ads,
      ShowFloatingBTN: false,
      ShowBottomMenu: true,
      Filter: false,
    });
  }

  render() {
    if (this.state.loading)
      return (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );
    return (
      <View style={{flex: 1}}>
        <ReloadScreen
          ShowReloadBTN={this.state.ShowReloadBTN}
          ReloadBTN={this.ReloadBTN}
        />

        <Swiper
          index={this.state.CurrentScrollIndex}
          activeDotStyle={{backgroundColor: 'white'}}
          loop={false}
          ref={swiper => {
            this._swiper = swiper;
          }}
          style={styles.wrapper}>
          <View style={styles.slide1}>
            <ImageBackground
              style={styles.slideBackGroundIMG}
              source={require('../../res/ad1.png')}>
              <View style={styles.slideView}>
                <Text style={styles.Desc}> {strings.newCourse}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.BTNStyle}
                onPress={() => this.SeeAll()}>
                <Text style={styles.BTNTxt}>{strings.seeAll}</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.slide1}>
            <ImageBackground
              style={styles.slideBackGroundIMG}
              source={require('../../res/ad2.png')}>
              <View style={styles.slideView}>
                <Text style={styles.Desc}> {strings.newCourse}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.BTNStyle}
                onPress={() => this.SeeAll()}>
                <Text style={styles.BTNTxt}>{strings.seeAll}</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.slide1}>
            <ImageBackground
              style={styles.slideBackGroundIMG}
              source={require('../../res/ad1.png')}>
              <View style={styles.slideView}>
                <Text style={styles.Desc}> {strings.newCourse}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.BTNStyle}
                onPress={() => this.SeeAll()}>
                <Text style={styles.BTNTxt}>{strings.seeAll}</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </Swiper>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Home')}
          style={styles.SkipView}>
          <Icon
            name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
            size={30}
            color={'white'}
          />
          <Text style={styles.skiptxt}> {strings.skip}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Ads;
const styles = StyleSheet.create({
  skiptxt: {fontSize: hp('1.8%'), color: 'white', fontFamily: fonts.normal},
  SkipView: {
    flexDirection: 'row',
    position: 'absolute',
    width: wp('100%'),
    height: hp('5%'),
    marginTop: hp('95%'),
  },
  slideView: {
    marginTop: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('15%'),
  },
  slideBackGroundIMG: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('100%'),
  },
  BTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('40%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('3%'),
  },
  BTNTxt: {fontWeight: 'bold', fontSize: hp('2.5%'), color: 'white'},
  Desc: {
    textAlign: 'center',
    marginTop: hp('2.7%'),
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: 'white',
  },
  activeDotStyle: {
    backgroundColor: 'rgba(36, 169, 226,1)',
    width: 21,
    height: 3,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  wrapper: {
    flexDirection: 'row-reverse',
  },
  Loader: {justifyContent: 'center', alignItems: 'center', flex: 1},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
