import { CommonActions } from '@react-navigation/native';
import React, { Component } from 'react';
import {
  I18nManager,
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
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import MenuIcon from '../../res/menu.svg';
import {
  BestCentersHorScroll,
  BottomMenu,
  CoursesAndHallsFilter,
  FloatingCartBTN,
  LoadingScreen,
  NewCoursesScroll,
  ReloadScreen,
} from '../common';
import BestCoachesScroll from '../common/BestcoachesScroll';
import BestCoachesItem from '../common/Items/BestcoachesItem';
import NewCoursesItem from '../common/Items/NewCoursesItem';
import strings from '../strings';

class Home extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.NavToSearchCourses = this.NavToSearchCourses.bind(this);
    this.Header0 = this.Header0.bind(this);
    this.state = {
      Data: '',
      loading: true,
      ShowReloadBTN: false,
      searchCourse: '',
      ShowFilter: false,
      ScrollingDir: true,
      cartCount: 0,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('Heeeeeeere_unsubscribe');
      this.GetData();
    });

    if (UserProfile.getInstance().IsHallProvider()) this.GoToHalls();
    else this.GetData();
  }

  // componentWillUnmount() {
  //   this._unsubscribe.remove();
  // }

  GoToHalls() {
    console.log('🚀 ~ file: Home.js:60 ~ Home ~ GoToHalls ~ GoToHalls:');
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [
        {
          name: 'TrainingCenters',
          params: {
            Title: strings.halls,
            SubTitle: strings.halls,
            NavTitle: 'halls',
          },
        },
      ],
    });
    this.props.navigation.dispatch(resetAction);
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
      fetch(
        'https://www.demo.ertaqee.com/api/v1/home/' +
          UserProfile.getInstance().clientObj.user.id,
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
            console.log('responseJson:' + JSON.stringify(responseJson));
            console.log(
              '🚀 ~ file: Home.js:112 ~ Home ~ GetData ~ responseJson:',
              responseJson.data.cart_count,
            );
            if (responseJson.success) {
              this.setState({
                loading: false,
                Data: responseJson.data,
                ShowReloadBTN: false,
                cartCount: responseJson.data.cart_count,
              });
              UserProfile.getInstance().CartNo = responseJson.data.cart_count;
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

  Header() {
    let myDate = new Date();
    let hours = myDate.getHours();

    return (
      <View style={styles.Header}>
        <View style={styles.subheader}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SideMenu')}>
            <MenuIcon
              style={[
                styles.imgtab,
                {transform: [{rotateY: I18nManager.isRTL ? '0deg' : '180deg'}]},
              ]}
            />
          </TouchableOpacity>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={styles.hello}>{`${strings.hello}, ${
              UserProfile.getInstance().clientObj.user.username
            }`}</Text>
            <Text style={styles.greeting}>
              {hours < 12
                ? strings.morning
                : hours <= 17
                ? strings.afternoon
                : strings.evening}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.subheader,
            {
              width: wp('18%'),
              alignItems: 'center',
              marginHorizontal: 20,
              justifyContent: 'space-between',
            },
          ]}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Msgs', {
                MsgsOrNotifications: false,
              })
            }>
            <Icon
              name="bell-ring-outline"
              type="material-community"
              size={23} //style={{marginStart:wp('2%')}}
              color={'white'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Msgs', {
                MsgsOrNotifications: true,
              })
            }>
            <Icon
              name="message1"
              type="antdesign"
              size={23} //style={{marginLeft:wp('2%')}}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  NavToSearchCourses(SearchLink) {
    console.log(
      '🚀 ~ file: Home.js:200 ~ Home ~ NavToSearchCourses ~ SearchLink:',
      SearchLink,
    );
    let SearchKeyword = this.state.searchCourse;
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

  SearchArea() {
    return (
      <View style={styles.searcharea}>
        {/* <View style={styles.FirstMainView}>
          <Text style={styles.title}> {strings.namesSearchFor}</Text>
          <Text style={styles.subtitle}> {strings.yourcoachandcenter}</Text>
        </View> */}

        <View style={[styles.FirstMainView, styles.subFirstMainView]}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              placeholder={strings.courseName}
              placeholderTextColor={'gray'}
              style={styles.courseName}
              onChangeText={text => {
                this.setState({searchCourse: text});
              }}
            />
            {/* <TouchableOpacity
              onPress={() => {
                 this.setState({ShowFilter: true})
                // this.props.navigation.navigate('CourseRequest');
              }}
              style={styles.filter}>
              <Icon name="filter" type="feather" color={'#4D75B8'} />
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity
            onPress={() =>
              this.NavToSearchCourses(
                'https://www.demo.ertaqee.com/api/v1/courses_filter?keyword=' +
                  this.state.searchCourse,
              )
            }
            style={styles.search}>
            <Text
              style={[
                styles.title,
                {textAlign: 'center', fontSize: wp('3.3%')},
              ]}>
              {strings.search}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{height: hp('10%')}} />
        <TouchableOpacity
          onPress={() => {
            // this.setState({ShowFilter: true})
            this.props.navigation.navigate('CourseRequest');
          }}
          style={styles.spcifiybtn}>
          <Text style={[styles.title, styles.specifywhatyouneed]}>
            {strings.specifywhatyouneed}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  BestCenters() {
    return (
      <View
        style={{marginTop: hp('-6%'), width: wp('100%'), height: hp('25%')}}>
        <BestCentersHorScroll
          Title={strings.trainingCenters}
          Items={this.state.Data.top_centers}
          SubTitle={strings.trainingCenters}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  NewCoursesItems = () => {
    let BestCoursesItems = this.state.Data.latest_courses;
    let Items = [];
    for (let i = 0; i < BestCoursesItems.length; i++)
      Items.push(
        <NewCoursesItem
          key={i}
          item={BestCoursesItems[i]}
          IsVer={false}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  NewCourses() {
    return (
      <View style={{marginTop: hp('1%'), width: wp('100%'), height: hp('30%')}}>
        <NewCoursesScroll
          Items={this.NewCoursesItems()}
          Title={strings.newCources}
          ViewAllNav={true}
          IsMiddleTitle={false}
          ShowFloatingBTN={true}
          ShowBottomMenu={false}
          IsVer={false}
          Filter={true}
          SubTitle={strings.seeAll}
          navigation={this.props.navigation}
        />
        {/*<NewCoursesScroll Title={'دورات تدريبية'} ViewAllNav={true} IsMiddleTitle={false} ShowFloatingBTN={false} ShowBottomMenu={true} IsVer={false} Filter={false} navigation={this.props.navigation}/>*/}
      </View>
    );
  }

  BestCoachesItems = () => {
    let TopTrainers = this.state.Data.top_trainers;
    let Items = [];
    for (let i = 0; i < TopTrainers.length; i++)
      Items.push(
        <BestCoachesItem
          key={i}
          item={TopTrainers[i]}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  BestCoaches() {
    return (
      <View style={{marginTop: hp('7%'), width: wp('100%'), height: hp('25%')}}>
        <BestCoachesScroll
          Items={this.BestCoachesItems()}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  /*
  ScrollingDir:
  true=> UP
  false=> Down
  */

  _onScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset || 0);
    const {ScrollingDir} = this.state;

    if (Math.abs(dif) < 3) return;
    if (dif < 0) {
      if (ScrollingDir == false) this.setState({ScrollingDir: true});
      this.offset = currentOffset;
      return;
    } else if (ScrollingDir == true && this.offset > 0)
      this.setState({ScrollingDir: false});
    this.offset = currentOffset;
  };

  Header0() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <ImageBackground
        source={require('../../res/topbar.png')}
        style={styles.Header0}>
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
          </View>
        </View>
      </ImageBackground>
    );
  }

  render() {
    let MyState = this.state;
    let userRole = UserProfile.getInstance().clientObj.user?.role[0];

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
      <View style={{backgroundColor: '#F8F9F9', flex: 1}}>
        <SafeAreaView>
          {/* <NavigationEvents
            onWillFocus={() => {
              this.GetData();
            }}
          /> */}

          <ScrollView
            onScroll={event => this._onScroll(event)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Image
              style={styles.backcurve}
              source={require('../../res/backcurve.png')}
            />
            {this.Header()}
            {this.SearchArea()}
            {this.BestCenters()}
            {this.NewCourses()}
            {this.BestCoaches()}
            <View style={{height: hp('20%')}} />
          </ScrollView>

          {userRole === 'Guest' ? null : (
            <FloatingCartBTN
              navigation={this.props.navigation}
              cartCount={this.state.cartCount}
            />
          )}

          <BottomMenu
            navigation={this.props.navigation}
            ScrollingDir={this.state.ScrollingDir}
          />
          {this.state.ShowFilter && (
            <CoursesAndHallsFilter
              NavToSearchCourses={this.NavToSearchCourses}
              Header={this.Header0}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  profileIMG: {width: wp('10%'), resizeMode: 'contain', height: hp('5%')},
  imgtab: {margin: hp('1.3%')},
  footertab: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('8.5%'),
    width: wp('20%'),
  },
  footer: {
    width: wp('100%'),
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: hp('14%'),
  },
  backcurve: {
    position: 'absolute',
    width: wp('100%'),
    marginTop: wp('-2%'),
    height: hp('30%'),
  },
  BackArrow: {
    tintColor: '#4D75B8',
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
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
  search: {
    justifyContent: 'center',
    height: hp('6%'),
    marginStart: wp('5%'),
    borderRadius: wp('2%'),
    backgroundColor: '#4D75B8',
    width: wp('20%'),
  },
  filter: {
    justifyContent: 'center',
    marginStart: wp('-8%'),
  },
  courseName: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    height: hp('6%'),
    width: wp('65%'),
    paddingEnd: wp(10),
    fontFamily: fonts.normal,
  },
  subFirstMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp('90%'),
  },
  specifywhatyouneed: {alignSelf: 'center', fontSize: wp('5%')},
  spcifiybtn: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
    backgroundColor: '#8BD1EF',
    width: wp('87%'),
    height: hp('7%'),
  },
  searchbtn: {borderRadius: wp('3%'), marginLeft: wp('2%'), width: wp('22%')},
  subtitle: {fontSize: hp('1.5%'), color: '#cfcaca', fontFamily: fonts.normal},
  title: {fontSize: hp('2.2%'), color: 'white', fontFamily: fonts.normal},
  FirstMainView: {width: wp('100%'), height: hp('7.5%')},
  searcharea: {
    width: wp('100%'),
    marginTop: hp('2%'),
    height: hp('22%'),
    marginBottom: hp('7%'),
  },
  exampleimg: {alignSelf: 'center', width: wp('100%'), height: hp('140%')},
  Header: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp('90%'),
    marginTop: hp('5%'), //header was 6
    height: hp('5%'),
  },
  subheader: {
    flexDirection: 'row',
    width: wp('65%'),
    height: hp('5%'),
    alignItems: 'center',
  },
  Header0: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  hello: {fontSize: hp('2%'), color: 'white', fontFamily: fonts.normal},
  greeting: {
    fontSize: hp('1.8%'),
    color: 'lightgrey',
    fontFamily: fonts.normal,
    // marginTop: hp('1%'),
  },
});
