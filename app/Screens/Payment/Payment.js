import { StackActions } from '@react-navigation/native';
import React, { Component } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import { RadioButton } from '../common';
import strings from '../strings';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ShowWebView: false,
      cart_id: 0,
      amount: 0,
      customer_givenName: '',
      customer_surname: '',
      customer_email: '',
      online_payment_method: 'visa',
      checked: false,
    };
  }

  componentDidMount() {
    let ParamsData = this.props.route.params;
    console.log('ParamsData:' + ParamsData.CartId);
    try {
      this.setState({cart_id: ParamsData.CartId, amount: ParamsData.Amount});
    } catch {}
  }

  InputFeild(PlaceHolder) {
    return (
      <View style={[styles.InputView, {opacity: 1, borderColor: '#F8F9F9'}]}>
        <TextInput
          placeholder={PlaceHolder}
          placeholderTextColor={'gray'}
          maxLength={20}
          style={[styles.InputStyleLarge]}
        />
      </View>
    );
  }

  GetCartStatus(cart_id) {
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/cart/' +
          cart_id +
          '/return_payment_status',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      ).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('responseJson: payment' + JSON.stringify(responseJson));
            if (responseJson.success) {
              this.setState({ShowWebView: false});
              // alert(strings.successProcess)
              Alert.alert(strings.signIn, strings.successProcess, [
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: strings.ok, onPress: () => console.log('OK Pressed')},
              ]);
              this.props.navigation.navigate('Home');
            }
          })
          .catch(error => {
            this.setState({loading: false});
            console.log('Thirderr:' + error);
            alert(strings.somthingWentWrong);
          });
      });
    } catch (error) {
      console.log('FourthErr:' + error);
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  WebViewComp() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    console.log(
      '🚀 ~ file: Payment.js:107 ~ Payment ~ WebViewComp ~ IsAr:',
      UserProfile.getInstance().clientObj,
    );
    const {type} = this.state;
    const {
      cart_id,
      amount,
      customer_surname,
      online_payment_method,
      customer_givenName,
      customer_email,
    } = this.state;
    const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;
    let URL =
      'https://www.demo.ertaqee.com/api/v1/cart/checkout?amount=' +
      amount +
      '&cart_id=' +
      cart_id +
      '&customer_givenName=' +
      UserProfile.getInstance().clientObj.user.full_name +
      '&customer_surname=' +
      UserProfile.getInstance().clientObj.user.username +
      '&customer_email=' +
      UserProfile.getInstance().clientObj.user.email +
      '&online_payment_method=' +
      online_payment_method +
      '&lang=' +
      UserProfile.getInstance().Lang;
    console.log('URL:' + URL);
    return (
      <View style={{flex: 1, width: wp('100%'), height: hp('100%')}}>
        <ImageBackground
          source={require('../../res/topbar2.png')}
          style={styles.Header}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              width: wp('95%'),
              height: hp('10%'),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: wp('85%'),
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name={IsAr ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
              <Text style={styles.MiddleTxt}>{strings.payment}</Text>
            </View>
          </View>
        </ImageBackground>

        <AutoHeightWebView
          source={{uri: URL}}
          scalesPageToFit={true}
          scrollEnabled={false}
          onNavigationStateChange={res => {
            console.log(
              '🚀 ~ file: ============================= ~ onNavigationStateChange ~ res:',
              res,
            );

            if (res.url.includes('payment_success')) {
              this.props.navigation.dispatch(StackActions.pop(2));
              alert(strings.successProcess);
            } else if (res.url.includes('payment_error')) {
              this.props.navigation.goBack();
            }
          }}
          viewportContent={'width=device-width, user-scalable=no'}
          removeClippedSubviews={true} // style={{width: width}}
        />

        {/* <WebView
          source={{uri: URL}}
          onNavigationStateChange={res => {
            console.log(
              '🚀 ~ file: ============================= ~ onNavigationStateChange ~ res:',
              res,
            );

            if (res.url.includes('payment_success')) {
              //hide progress indicator
              // setLoading(false);
              // showSuccess(I18n.t('payed_sucessfully'));
            } else if (res.url.includes('payment_error')) {
              // showError(I18n.t('payment_failed'));
              // setLoading(true);
              // setLoading2(false);
              // AppNavigation.pop();
            }
          }}
          onError={syntheticEvent => {
            // const {nativeEvent} = syntheticEvent;
            // // console.log("🚀 ~ file: Payment.js:83 ~ Payment ~ nativeEvent:", nativeEvent)
            // showError(nativeEvent.description ?? I18n.t('error'));
            // setTimeout(() => {
            //   AppNavigation.setStackRoot('home');
            // }, 3000);
          }}
        /> */}
      </View>
    );
  }

  renderCheckBox() {
    const {checked} = this.state;
    return (
      <TouchableOpacity
        style={{
          width: 15,
          height: 15,
          borderRadius: 1,
          borderColor: '#39A1F7',
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          if (this.state.checked) {
            this.setState({checked: false});
          } else {
            this.setState({checked: true});
          }
        }}>
        {checked ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 1,
              backgroundColor: '#39A1F7',
            }}></View>
        ) : (
          <View style={{display: 'none'}}></View>
        )}
      </TouchableOpacity>
    );
  }
  render() {
    const {ShowWebView, online_payment_method} = this.state;
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          {!ShowWebView && (
            <View style={{backgroundColor: '#F8F9F9', alignItems: 'center'}}>
              <Image
                style={styles.BackGroundLogo}
                source={require('../../res/backgroundlogo.png')}
              />
              <ImageBackground
                source={require('../../res/topbar2.png')}
                style={styles.Header}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: wp('85%'),
                    height: hp('10%'),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: wp('85%'),
                    }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}>
                      <Icon name="arrow-forward" size={30} color={'white'} />
                    </TouchableOpacity>
                    <Text style={styles.MiddleTxt}>{strings.payment}</Text>
                  </View>
                </View>
              </ImageBackground>
              <View style={{width: wp('95%'), height: hp('80%')}}>
                {/* <Text style={{marginTop:hp('2%'),fontSize:hp('2.5%'),color:'#25252A'}}> {strings.add} {strings.paymentInfo}</Text>
                <View style={styles.InputView}>
                  <TextInput placeholder={strings.first_name} onChangeText={(text) => this.setState({customer_givenName: text})} maxLength={20}  style={[styles.InputStyleLarge]} />
                </View>
                <View style={styles.InputView}>
                  <TextInput placeholder={strings.family_name} onChangeText={(text) => this.setState({customer_surname: text})} maxLength={20}  style={[styles.InputStyleLarge]} />
                </View>
                <View style={styles.InputView}>
                  <TextInput placeholder={strings.email} onChangeText={(text) => this.setState({customer_email: text})} style={[styles.InputStyleLarge]} />
                </View> */}
                <Text
                  style={{
                    marginTop: hp('2%'),
                    fontSize: hp('2%'),
                    color: '#25252A',
                    textAlign: 'left',
                    fontFamily: fonts.normal,
                  }}>
                  {' '}
                  {strings.payWith}
                </Text>

                <View style={styles.SocendMainView}>
                  <TouchableOpacity
                    style={[
                      styles.RestoreByPhoneOrEmail,
                      {marginTop: hp('1%')},
                    ]}
                    onPress={() =>
                      this.setState({online_payment_method: 'mada'})
                    }>
                    <RadioButton
                      selected={online_payment_method === 'mada'}
                      color={'#39A1F7'}
                    />
                    <Text style={styles.restoreByPhone}> MADA </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.RestoreByPhoneOrEmail,
                      {marginTop: hp('1%')},
                    ]}
                    onPress={() =>
                      this.setState({online_payment_method: 'visa'})
                    }>
                    <RadioButton
                      selected={online_payment_method === 'visa'}
                      color={'#39A1F7'}
                    />
                    <Text style={styles.restoreByPhone}> VISA </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.RestoreByPhoneOrEmail,
                      {marginTop: hp('1%')},
                    ]}
                    onPress={() =>
                      this.setState({online_payment_method: 'masterCard'})
                    }>
                    <RadioButton
                      selected={online_payment_method === 'masterCard'}
                      color={'#39A1F7'}
                    />
                    <Text style={styles.restoreByPhone}> MasterCard </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: wp('6%'),
                    },
                  ]}>
                  {this.renderCheckBox()}
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('TOS');
                    }}>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: hp('2%'),
                        marginHorizontal: 7,
                        fontFamily: fonts.normal,
                      }}>
                      {strings.accept_terms}{' '}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (this.state.checked) {
                      this.setState({ShowWebView: true});
                    } else {
                      alert(strings.accept_terms);
                    }
                  }}
                  style={styles.LoginBTNStyle}>
                  <Text style={styles.NextTxt}>{strings.confirm}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {ShowWebView && this.WebViewComp()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Payment;
const styles = StyleSheet.create({
  restoreByPhone: {
    fontSize: hp('1.8%'),
    color: '#483F8C',
    fontFamily: fonts.normal,
  },
  RestoreByPhoneOrEmail: {
    width: wp('80%'),
    height: hp('4%'),
    flexDirection: 'row',
  },
  SocendMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('3%'),
  },
  InputView: {
    borderColor: '#F8F9F9',
    marginTop: hp('2%'),
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('85%'),
    height: hp('7%'),
  },
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-7%'),
    bottom: hp('10%'),
    resizeMode: 'contain',
    width: wp('65%'),
    height: hp('25%'),
  },
  LoginBTNStyle: {
    position: 'absolute',
    bottom: hp('5%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('85%'),
    height: hp('6.5%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('2%'),
  },
  BackArrow: {
    tintColor: 'black',
    resizeMode: 'contain',
    width: wp('4%'),
    height: hp('3.5%'),
  },
  MiddleTxt: {
    color: 'white',
    fontSize: wp('5%'),
    marginLeft: wp('35%'),
    fontFamily: fonts.normal,
  },
  FloatingBTN: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    bottom: 90,
    right: 30,
  },
  NextTxt: {fontSize: hp('2.3%'), color: 'white', fontFamily: fonts.normal},
  InputStyle: {
    borderColor: 'silver',
    margin: 2,
    borderColor: 'silver',
    borderWidth: wp('0.1%'),
    borderRadius: wp('1%'),
    width: wp('90%'),
    marginTop: hp('2%'),
    height: hp('8%'),
    fontSize: hp('2%'),
  },
  footer: {
    width: wp('100%'),
    alignItems: 'center',
    position: 'absolute',
    height: hp('100%'),
  },
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {fontSize: hp('2%'), color: 'white'},
  InputStyleLarge: {
    textAlign: 'right',
    width: wp('85%'),
    height: hp('8%'),
    fontSize: hp('2%'),
    color: '#39A1F7',
  },
});
