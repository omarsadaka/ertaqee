import React from 'react';
import {
  Image,
  ImageBackground,
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

class JoinRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
      loading: false,
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
      fetch('https://www.demo.ertaqee.com/api/v1/trainer/centers/requests_join', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
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

  ApproveJoinReq(JoinReqID) {
    this.setState({Data: '', loading: true, ShowReloadBTN: false});
    const MyFormData = new FormData();
    MyFormData.append('approved', '1');
    let APIURL =
      'https://www.demo.ertaqee.com/api/v1/trainer/requests_join/' + JoinReqID;
    console.log('APIURL:' + APIURL);
    try {
      fetch(APIURL, {
        method: 'POST',
        body: MyFormData,
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('responseJson:' + JSON.stringify(responseJson));
            if (responseJson.success) {
              alert(strings.successProcess);
              this.GetData();
            } else this.ShowReloadBTN();
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

  JoinItem(ReqID, Date) {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: hp('2%'),
          width: wp('90%'),
          height: hp('13.5%'),
        }}>
        <Icon name="person" size={35} color={'#5B739F'} />
        <View
          style={{marginTop: hp('0.5%'), width: wp('70%'), height: hp('10%')}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp('45%'),
              height: hp('3%'),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: hp('2.5%'),
                  color: '#4D75B8',
                }}>
                {' '}
                {strings.joinRequest + ': ' + ReqID}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('0.15%'),
              width: wp('50%'),
              height: hp('3%'),
            }}>
            <Text style={{fontSize: hp('1.75%'), color: '#8D95A6'}}>
              {Date}{' '}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => this.ApproveJoinReq(ReqID)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: wp('-5%'),
            width: 50,
            borderRadius: 50 / 2,
            height: 50,
            backgroundColor: '#6D9ECE',
          }}>
          <Icon name="check" size={30} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  }

  joinRequestsItems() {
    const {Data} = this.state;
    let Items = [];
    console.log('Data.length:' + Data.length);
    for (let i = 0; i < Data.length; i++)
      Items.push(
        this.JoinItem(Data[i].id, Data[i].created_at.substring(0, 10), i),
      );
    return Items;
  }

  render() {
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

    return (
      <ScrollView>
        <View style={{alignItems: 'center', flex: 1}}>
          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />
          <ImageBackground
            source={require('../../res/topbar2.png')}
            style={styles.Header}>
            <Text style={styles.MiddleTxt}>{strings.joinRequests}</Text>
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
                  <Icon name="arrow-forward" size={30} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#F8F9F9',
              width: wp('100%'),
              height: hp('90%'),
            }}>
            <Image
              style={styles.BackGroundLogo}
              source={require('../../res/backgroundlogo.png')}
            />
            <ScrollView>{this.joinRequestsItems()}</ScrollView>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default JoinRequests;
const styles = StyleSheet.create({
  Header: {
    width: wp('100%'),
    height: hp('9%'),
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
    right: wp('-10%'),
    bottom: hp('-4%'),
    resizeMode: 'contain',
    width: wp('75%'),
    height: hp('35%'),
  },
});
