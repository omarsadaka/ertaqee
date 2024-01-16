import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../../UserProfile';

class ChangeLang extends React.Component {
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
      <View style={styles.MainView}>
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
    );
  }
}

export { ChangeLang };
const styles = StyleSheet.create({
  MainView: {
    alignItems: 'center',
    backgroundColor: '#F8F9F9',
    bottom: 0,
    position: 'absolute',
    width: wp('100%'),
    height: hp('91%'),
  },
  Loader: {justifyContent: 'center', alignItems: 'center', flex: 1},
});
