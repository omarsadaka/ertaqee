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
import SectionContent from '../TOS/SectionContent';
import { LoadingScreen, ReloadScreen } from '../common';
import strings from '../strings';

class About extends Component {
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
      fetch('https://www.demo.ertaqee.com/api/v1/page/about-us', {
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

  UserNameAndIMG(IMG) {
    return <View></View>;
  }

  AboutSec(Title, Body, Img) {
    return (
      <View style={{width: wp('90%'), marginTop: hp('2%')}}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Image
            style={{
              resizeMode: 'contain',
              width: wp('15%'),
              height: hp('10%'),
              alignSelf: 'center',
            }}
            source={Img.length > 2 ? Img : require('../../res/about1.png')}
          />
          <View style={{width: 10}} />
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
            {Title ? Title : 'أكثر من +500 دورة'}
          </Text>
        </View>
        <ScrollView
          style={{flex: 1, paddingTop: 15}}
          showsVerticalScrollIndicator={false}>
          <SectionContent
            content={`${Body || ''}`}
            rtl={UserProfile.getInstance().Lang === 'ar'}
          />
        </ScrollView>
      </View>
    );
  }

  render() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    let MyState = this.state;

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
      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor:'#597ebd',
        }}>
        <ScrollView>
          <View style={{backgroundColor: '#F8F9F9', alignItems: 'center'}}>
            <Image
              style={styles.BackGroundLogo}
              source={require('../../res/backgroundlogo.png')}
            />
            <ImageBackground
              source={require('../../res/topbar2.png')}
              style={styles.Header}>
              <Text style={styles.MiddleTxt}>{strings.aboutApp}</Text>
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

            <View style={{alignItems: 'center', width: wp('90%')}}>
              <Image
                style={{
                  resizeMode: 'stretch',
                  marginTop: hp('5%'),
                  width: wp('90%'),
                  alignSelf: 'center',
                }}
                source={{uri: Data.image}}
              />
              <Text
                style={{
                  alignSelf: 'flex-start',
                  marginVertical: hp('3%'),
                  fontWeight: 'bold',
                  fontSize: 22,
                  color: 'black',
                }}>
                {' '}
                {IsAr ? Data.title_ar : Data.title_en}
              </Text>
              <SectionContent
                content={`${IsAr ? Data.content_ar : Data.content_en || ''}`}
                rtl={IsAr}
              />
              <View style={{height: hp('3%')}} />
              {this.AboutSec(
                IsAr ? Data.block1_title_ar : Data.block1_title_en,
                IsAr ? Data.block1_content_ar : Data.block1_content_en,
                {uri: Data.icon1},
              )}
              {this.AboutSec(
                IsAr ? Data.block2_title_ar : Data.block2_title_en,
                IsAr ? Data.block2_content_ar : Data.block2_content_en,
                {uri: Data.icon2},
              )}
              {this.AboutSec(
                IsAr ? Data.block3_title_ar : Data.block3_title_en,
                IsAr ? Data.block3_content_ar : Data.block3_content_en,
                {uri: Data.icon3},
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default About;
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
