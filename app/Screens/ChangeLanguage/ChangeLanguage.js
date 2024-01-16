import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
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
import strings from '../strings';

class ChangeLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentLang: 0,
      loading: true,
    };
  }

  componentWillMount() {
    this.setState({
      loading: false,
      CurrentLang: UserProfile.getInstance().Lang,
    });
  }

  SetLang(Lang) {
    if (this.state.CurrentLang !== Lang) {
      this.setState({loading: true});
      UserProfile.getInstance().SetThisLangSelected(Lang);
    }
  }

  render() {
    if (this.state.loading)
      return (
        <View style={styles.MainView}>
          <View style={styles.Loader}>
            <ActivityIndicator size="large" color="#37A0F7" />
          </View>
        </View>
      );

    let IsAr = UserProfile.getInstance().Lang === 'ar';
    const {CurrentLang} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.MainView}>
          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />
          <ImageBackground
            source={require('../../res/topbar2.png')}
            style={styles.Header}>
            <Text style={styles.MiddleTxt}>{strings.changeLang}</Text>
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

          <TouchableOpacity
            onPress={() => this.SetLang('ar')}
            style={{
              justifyContent: 'center',
              marginTop: hp('3%'),
              alignItems: 'center',
              elevation: 2,
              backgroundColor: 'white',
              width: wp('90%'),
              height: hp('8%'),
              shadowOpacity: 0.1,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                width: wp('80%'),
                height: hp('6%'),
              }}>
              <Text
                style={{
                  fontSize: hp('2.1%'),
                  width: wp('10%'),
                  color: IsAr ? '#8BD1EF' : 'black',
                }}>
                عربي
              </Text>
              {this.state.CurrentLang == 0 && (
                <Icon name="check" size={33} color={'#8BD1EF'} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.SetLang('en')}
            style={{
              justifyContent: 'center',
              marginTop: hp('2%'),
              alignItems: 'center',
              elevation: 2,
              backgroundColor: 'white',
              width: wp('90%'),
              height: hp('8%'),
              shadowOpacity: 0.1,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                width: wp('80%'),
                height: hp('6%'),
              }}>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: hp('2.1%'),
                  width: wp('20%'),
                  color: !IsAr ? '#8BD1EF' : 'black',
                }}>
                English
              </Text>
              {this.state.CurrentLang == 1 && (
                <Icon name="check" size={33} color={'#8BD1EF'} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export { ChangeLanguage };
const styles = StyleSheet.create({
  MainView: {
    alignItems: 'center',
    backgroundColor: '#F8F9F9',
    width: wp('100%'),
    height: hp('91%'),
  },
  Loader: {justifyContent: 'center', alignItems: 'center', flex: 1},
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackArrow: {
    position: 'absolute',
    bottom: 0,
    left: wp('-8%'),
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
    right: wp('-7%'),
    bottom: hp('5%'),
    resizeMode: 'contain',
    width: wp('65%'),
    height: hp('25%'),
  },
});
