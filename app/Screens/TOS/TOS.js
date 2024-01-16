import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
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
import UserProfile from '../../UserProfile';
import { LoadingScreen, ReloadScreen } from '../common';
import strings from '../strings';
import SectionContent from './SectionContent';

class TOS extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.state = {
      Data: '',
      loading: true,
      ShowReloadBTN: false,
    };
  }

  componentDidMount() {
    this.GetData();
  }

  ShowReloadBTN() {
    alert(strings.somthingWentWrong);
    this.setState({ShowReloadBTN: true, loading: false});
  }

  ReloadBTN() {
    console.log('ReloadBTN');
    this.GetData();
  }

  GetData() {
    this.setState({Data: '', loading: true, ShowReloadBTN: false});
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/page/terms-and-conditions', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('responseJson:' + JSON.stringify(responseJson));
            if (responseJson.success)
              this.setState({
                loading: false,
                Data: responseJson.data,
                ShowReloadBTN: false,
              });
            else this.ShowReloadBTN();
          })
          .catch(error => {
            console.log('Thirderror:' + error);
            this.ShowReloadBTN();
          });
      });
    } catch (error) {
      console.log('FourthErr:' + error);
      this.ShowReloadBTN();
    }
  }

  render() {
    let MyState = this.state;
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    if (MyState.loading)
      return (
        <View style={{flex: 1}}>
          <LoadingScreen Show={true} />
        </View>
      );

    if (MyState.ShowReloadBTN)
      return (
        <View style={{flex: 1}}>
          <ReloadScreen ShowReloadBTN={true} ReloadBTN={this.ReloadBTN} />
        </View>
      );
    let Data = this.state.Data;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{backgroundColor: '#F8F9F9', alignItems: 'center', flex: 1}}>
          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />
          <ImageBackground
            source={require('../../res/topbar2.png')}
            style={styles.Header}>
            <Text style={styles.MiddleTxt}>{strings.termsAndCond}</Text>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('100%'),
                height: hp('10%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp('100%'),
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{marginLeft: wp('2%')}}>
                  <Icon
                    name={IsAr ? 'arrow-forward' : 'arrow-back'}
                    size={30}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* <Image style={{marginTop:hp('5%'),resizeMode:'stretch',width:wp('90%'),height:hp('25%')}} source={{uri:Data.image}} /> */}

          <View
            style={{alignItems: 'center', width: wp('90%'), height: hp('90%')}}>
            {/* <Text
              style={{
                alignSelf: 'flex-start',
                marginVertical: hp('3%'),
                fontWeight: 'bold',
                fontSize: 22,
                color: 'black',
              }}>
              {' '}
              {strings.termsAndCond}
            </Text> */}
            <ScrollView
              style={{flex: 1, paddingTop: 15}}
              showsVerticalScrollIndicator={false}>
              <SectionContent
                content={`${IsAr ? Data.content_ar : Data.content_en || ''}`}
                rtl={IsAr}
              />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default TOS;
const styles = StyleSheet.create({
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackArrow: {
    position: 'absolute',
    top: hp('8%'),
    left: wp('25%'),
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
  },
  MiddleTxt: {
    width: wp('100%'),
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    right: wp('0%'),
    left: wp('0%'),
    color: 'white',
    fontSize: wp('5%'),
  },
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-5%'),
    bottom: hp('5%'),
    resizeMode: 'contain',
    width: wp('75%'),
    height: hp('35%'),
  },
});
