import React, { Component } from 'react';
import {
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
import fonts from '../../fonts';
import MenuIcon from '../../res/menu.svg';
import {
  BottomMenu,
  CoursesAndHallsFilter,
  TrainingCentersScroll,
} from '../common';

class TrainingCenters extends Component {
  constructor(props) {
    super(props);
    this._onScroll = this._onScroll.bind(this);
    this.NavToSearchHalls = this.NavToSearchHalls.bind(this);
    this.Header = this.Header.bind(this);
    this.state = {
      ShowFilter: false,
      HallOrCenter: false,
      ScrollingDir: true,
      headerTitle: '',
    };
  }

  _onScroll(ScrollingDir) {
    console.log('ScrollingDir:');
    this.setState({ScrollingDir: ScrollingDir});
  }

  componentWillMount() {
    let ParamsData = this.props.route.params;
    console.log(
      '🚀 ~ file: TrainingCenters.js:41 ~ TrainingCenters ~ componentWillMount ~ ParamsData:',
      ParamsData,
    );
    this.setState({HallOrCenter: ParamsData.NavTitle === 'halls'});
    this.setState({headerTitle: ParamsData.Title});
  }

  NavToSearchHalls(SearchLink) {
    this.setState({ShowFilter: false});
    console.log('NavToSearchHalls');
    this.props.navigation.navigate('TrainingCenters', {
      Title: 'القاعات',
      SubTitle: 'القاعات',
      NavTitle: 'halls',
      API: SearchLink,
    });
  }

  HallsOrCentersData() {
    let ParamsData = this.props.route.params;
    let HallOrCenter = ParamsData.NavTitle;
    let API = ParamsData.API;
    return (
      <View
        style={{
          alignSelf: 'center',
          width: wp('100%'),
          flex: 1,
        }}>
        <TrainingCentersScroll
          API={API ? API : 'https://www.demo.ertaqee.com/api/v1/' + HallOrCenter}
          HallOrCenter={HallOrCenter === 'halls'}
          Title={this.props.route.params.Title}
          SubTitle={this.props.route.params.SubTitle}
          navigation={this.props.navigation}
          _onScroll={this._onScroll}
          isFilter={API ? true : false}
        />
      </View>
    );
  }

  ActionBTN() {
    console.log('ActionBTN');
  }

  Header() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <View>
        <ImageBackground
          source={require('../../res/topbar.png')}
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
              <TouchableOpacity
                onPress={() => this.setState({ShowFilter: false})}>
                <Icon
                  name={IsAr ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
              <Text style={styles.MiddleTxt0}>{this.state.headerTitle}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  render() {
    const {HallOrCenter} = this.state;
    let ParamsData = this.props.route.params;
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    let IsHallProvider = UserProfile.getInstance().IsHallProvider();

    if (this.state.ShowFilter)
      return (
        <View>
          <CoursesAndHallsFilter
            NavToSearchHalls={this.NavToSearchHalls}
            IsHalls
            Header={this.Header}
          />
        </View>
      );
    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={require('../../res/topbar2.png')}
          style={styles.Header}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              width: wp('90%'),
              height: hp('10%'),
            }}>
            {IsHallProvider ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SideMenu')}>
                <MenuIcon style={styles.imgtab} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                styles={{backgroundColor: 'pink'}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name={IsAr ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.MiddleTxt}>{ParamsData.Title} </Text>

            {IsHallProvider ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('CreateNew');
                }}>
                {HallOrCenter && <Icon name="add" size={30} color={'white'} />}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.setState({ShowFilter: true})}>
                {HallOrCenter && (
                  <Icon name="filter-list" size={30} color={'white'} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
        {this.HallsOrCentersData()}
        <BottomMenu
          navigation={this.props.navigation}
          ScrollingDir={this.state.ScrollingDir}
        />
      </SafeAreaView>
    );
  }
}

export default TrainingCenters;
const styles = StyleSheet.create({
  MiddleTxt0: {
    width: wp('80%'),
    textAlign: 'center',
    color: 'white',
    fontSize: wp('5.5%'),
    fontFamily: fonts.normal,
  },
  imgtab: {margin: hp('1.3%')},
  MiddleTxt: {color: 'white', fontSize: wp('5%'), fontFamily: fonts.normal},
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
  NextTxt: {fontSize: hp('2%'), color: 'white', fontFamily: fonts.normal},
  LoginBTNStyle: {
    marginTop: hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('8%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('2%'),
  },
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
  BackArrow: {resizeMode: 'contain', width: wp('10%'), height: hp('3.1%')},
  InputView: {
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
  },
});
