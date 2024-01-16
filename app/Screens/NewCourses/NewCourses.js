import { Picker } from '@react-native-picker/picker';
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
import {
  BottomMenu,
  CoursesAndHallsFilter,
  FloatingCartBTN,
  NewCoursesScroll,
} from '../common';
import NewCoursesItem from '../common/Items/NewCoursesItem';
import strings from '../strings';

class NewCourses extends Component {
  constructor(props) {
    super(props);
    this.NavToSearchCourses = this.NavToSearchCourses.bind(this);
    this.Header = this.Header.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this.state = {
      ShowFilter: false,
      ScrollingDir: true,
      headerTitle: '',
    };
  }

  componentWillMount() {
    let ParamsData = this.props.route.params;
    this.setState({headerTitle: ParamsData.Title});
  }

  _onScroll(ScrollingDir) {
    console.log('ScrollingDir:');
    this.setState({ScrollingDir: ScrollingDir});
  }

  NewCoursesItems = () => {
    let Items = [];
    for (let i = 0; i < 8; i++)
      Items.push(
        <NewCoursesItem
          key={i}
          IsVer={true}
          navigation={this.props.navigation}
        />,
      );
    Items.push(<View key={-1} style={{width: wp('50%'), height: hp('15%')}} />);
    return Items;
  };

  NavToSearchCourses(SearchLink) {
    this.setState({ShowFilter: false});
    console.log('NavToSearchCourses');
    this.props.navigation.navigate('NewCourses', {
      Title: strings.addedCourses,
      IsMiddleTitle: strings.courses,
      ShowFloatingBTN: false,
      ShowBottomMenu: true,
      Filter: false,
      API: SearchLink,
    });
  }

  NewCourses() {
    let ParamsData = this.props.route.params;
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    return (
      <View
        style={{
          alignSelf: 'center',
          width: wp('100%'),
          flex: 1,
        }}>
        <NewCoursesScroll
          API={
            ParamsData.API
              ? ParamsData.API  
              :  userRole === 'Trainer'  //userRole === 'Center' ||
              ? 'https://www.demo.ertaqee.com/api/v1/created_courses/' +
                UserProfile.getInstance().clientObj.user.id
              : 'https://www.demo.ertaqee.com/api/v1/courses'
          }
          Items={this.NewCoursesItems()}
          Title={ParamsData.Title ? ParamsData.Title : ''}
          ViewAll={false}
          IsVer={true}
          ViewAddNew={true}
          navigation={this.props.navigation}
          _onScroll={this._onScroll}
        />
      </View>
    );
  }

  Picker(MyWidth) {
    return (
      <View
        style={{
          margin: 2,
          borderColor: 'silver',
          borderWidth: wp('0.1%'),
          borderRadius: wp('1%'),
        }}>
        <Picker
          style={{height: hp('5%'), margin: wp('2%'), width: wp(MyWidth)}}
          selectedValue={this.state.city}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({city: itemValue})
          }>
          <Picker.Item label="دولة 1" value="دولة 1" />
          <Picker.Item label="دولة 2" value="دولة 2" />
        </Picker>
      </View>
    );
  }

  SearchBTN() {
    this.setState({ShowFilter: false});
  }

  FilterFooter() {
    return;
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
              <Text style={styles.MiddleTxt}>{this.state.headerTitle}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  render() {
    let ParamsData = this.props.route.params;
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    let userRole = UserProfile.getInstance().clientObj.user.role[0];

    if (this.state.ShowFilter)
      return (
        <View>
          <CoursesAndHallsFilter
            NavToSearchCourses={this.NavToSearchCourses}
            Header={this.Header}
          />
        </View>
      );

    return (
      <SafeAreaView style={{flex: 1}}>
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
                width: wp('95%'),
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name={IsAr ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>

              <Text
                style={
                  ParamsData.IsMiddleTitle ? styles.MiddleTxt : styles.title
                }>
                {ParamsData.Title}
              </Text>

              <TouchableOpacity
                onPress={() => this.setState({ShowFilter: true})}>
                <Icon name="filter-list" size={30} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {this.NewCourses()}

        {userRole === 'Guest' ? null : (
          <FloatingCartBTN navigation={this.props.navigation} />
        )}

        {ParamsData.ShowBottomMenu && (
          <BottomMenu
            navigation={this.props.navigation}
            ScrollingDir={this.state.ScrollingDir}
          />
        )}
      </SafeAreaView>
    );
  }
}

export default NewCourses;
const styles = StyleSheet.create({
  MiddleTxt: {
    width: wp('80%'),
    textAlign: 'center',
    color: 'white',
    fontSize: wp('5.5%'),
  },
  FloatingBTN: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4D75B8',
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    bottom: 90,
    right: 30,
  },
  NextTxt: {fontSize: hp('2%'), color: 'white'},
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
  title: {
    fontSize: hp('3%'),
    color: 'white',
    width: wp('80%'),
    textAlign: 'center',
  },
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
