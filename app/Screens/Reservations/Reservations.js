import React, { Component } from 'react';
import {
  ActivityIndicator,
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
import { FavList } from '../../components/favourite';
import { TraineesList } from '../../components/trainees';
import {
  BottomMenu,
  MyResvs,
  NewCoursesScroll,
  TrainingCentersScroll,
} from '../common';
import NewCoursesItem from '../common/Items/NewCoursesItem';
import strings from '../strings';
import fonts from '../../fonts';
class Reservations extends Component {
  constructor(props) {
    super(props);
    this._onScroll = this._onScroll.bind(this);
    this.state = {
      CurrentTab: 0,
      ScrollingDir: true,
      trainees: [],
      favourites: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getAllTrainees();
    this.getAllTFavourite();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('Heeeeeeere_unsubscribe');
      this.getAllTFavourite();
      this.getAllTrainees();
    });
  }

  _onScroll(ScrollingDir) {
    console.log('ScrollingDir:');
    this.setState({ScrollingDir: ScrollingDir});
  }

  ReservationsItems = () => {
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

  async getAllTrainees() {
    await fetch(
      `https://www.demo.ertaqee.com/api/v1/trainees/all?token=${
        UserProfile.getInstance().clientObj.token
      }`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(parsedRes => {
        console.log('trainee', parsedRes.data);
        this.setState({trainees: parsedRes.data});
      })
      .catch(err => {
        console.log(err);
      });
  }

  async getAllTFavourite() {
    console.log(
      'aaaaaaa',
      `https://www.demo.ertaqee.com/api/v1/profile/favorites` +
        '?token=' +
        UserProfile.getInstance().clientObj.token +
        '&user_id=' +
        UserProfile.getInstance().clientObj.user.id,
    );
    await fetch(
      `https://www.demo.ertaqee.com/api/v1/profile/favorites` +
        '?token=' +
        UserProfile.getInstance().clientObj.token +
        '&user_id=' +
        UserProfile.getInstance().clientObj.user.id,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(parsedRes => {
        console.log('favourites', parsedRes.data);
        var arr = parsedRes.data.favorites;
        const data = [];
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            title: arr[index].title,
            quantity: arr[index].number_of_attendees,
            course_field: arr[index].course_field?.title,
            cost: arr[index].cost,
            number_of_attendees: arr[index].number_of_attendees,
            image: arr[index].image ? arr[index].image : arr[index].main_image,
            is_favorited: arr[index].is_favorited,
            model_type: arr[index].model_type,
          };
          data.push(obj);
        }
        this.setState({favourites: data, loading: false});
      })
      .catch(err => {
        console.log(err);
        this.setState({loading: false});
      });
  }

  async handelDeleteUser(id) {
    console.log(UserProfile.getInstance().clientObj.token);
    await fetch(`https://www.demo.ertaqee.com/api/v1/trainee/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: UserProfile.getInstance().clientObj.token,
      }),
    })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        alert(parsedRes.message);
        this.getAllTrainees();
      })
      .catch(err => {
        console.log(err);
      });
  }

  SavedCourses() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    return (
      <View
        style={{marginTop: hp('1%'), alignSelf: 'center', width: wp('100%')}}>
        {userRole == 'Center' ? (
          <NewCoursesScroll
            API={
              'https://www.demo.ertaqee.com/api/v1/created_courses/' +
              UserProfile.getInstance().clientObj.user.id
            }
            Items={this.ReservationsItems()}
            Title={' '}
            ViewAll={false}
            IsVer={true}
            navigation={this.props.navigation}
          />
        ) : userRole == 'Halls Provider' ? (
          <TrainingCentersScroll
            API={
              'https://www.demo.ertaqee.com/api/v1/created_active_halls/' +
              UserProfile.getInstance().clientObj.user.id
            }
            HallOrCenter={'halls'}
            Title={''}
            SubTitle={''}
            navigation={this.props.navigation}
            _onScroll={this._onScroll}
          />
        ) : userRole == 'Company' ? (
          <TraineesList
            onPress={item =>
              this.props.navigation.navigate('EditTrainee', {item})
            }
            onDelete={item => this.handelDeleteUser(item.id)}
            items={this.state.trainees}
            onEdit={item =>
              this.props.navigation.navigate('EditTrainee', {item})
            }
          />
        ) : null}
      </View>
    );
  }

  Favourites() {
    return (
      <View style={{alignSelf: 'center', width: wp('100%')}}>
        <FavList
          loadData={() => this.getAllTFavourite()}
          onPress={item => {
            console.log('itemitem', item);
            if (item.model_type == 'Course') {
              this.props.navigation.navigate('CourseDetails', {
                CourseID: item.id,
                IsFav: item.is_favorited,
              });
            } else {
              this.props.navigation.navigate('HallDetails', {
                ItemID: item.id,
                IsFav: item.is_favorited,
              });
            }
          }}
          items={this.state.favourites}
        />
      </View>
    );
  }

  SetCurrentTab(IndexNo) {
    this.setState({CurrentTab: IndexNo});
  }

  FavDataReservationsItems = () => {
    let Items = [];
    let FavData = this.state.FavData;
    for (let i = 0; i < FavData.length; i++)
      Items.push(
        <NewCoursesItem
          key={i}
          item={FavData[i]}
          IsVer={true}
          navigation={this.props.navigation}
        />,
      );
    Items.push(<View key={-1} style={{width: wp('50%'), height: hp('15%')}} />);
    return Items;
  };

  ShowScrollsBasedOnCurrentTab() {
    if (this.state.CurrentTab == 0) {
      return <View>{<MyResvs />}</View>;
    } else if (this.state.CurrentTab == 1) {
      return <View>{this.SavedCourses()}</View>;
    } else if (this.state.CurrentTab == 2) {
      return (
        <View>
          {this.Favourites()}
          {/* {<MyFavs />} */}
        </View>
      );
    }
  }

  TabItem(Name, No) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.SetCurrentTab(No);
          }}>
          <Text
            style={[
              styles.TabTxt,
              {
                borderColor: 'white',
                borderBottomWidth: this.state.CurrentTab == No ? 4 : 0,
                fontWeight: this.state.CurrentTab == No ? '600' : '400',
              },
            ]}>
            {Name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          {userRole !== 'Guest' ? (
            <>
              <ImageBackground
                source={require('../../res/topbar3.png')}
                style={styles.Header}>
                <View style={{width: wp('95%'), height: hp('15%')}}>
                  <View
                    style={{
                      marginTop: hp('2%'),
                      flexDirection: 'row',
                      height: hp('4%'),
                      width: wp('85%'),
                    }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}>
                      <Icon
                        name={IsAr ? 'arrow-forward' : 'arrow-back'}
                        size={30}
                        color={'white'}
                      />
                    </TouchableOpacity>
                    <Text style={styles.MiddleTxt}>{strings.reservations}</Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      width: wp('95%'),
                    }}>
                    {/* {this.TabItem(strings.reservtions,0)}
                {userRole!='User'?this.TabItem(strings.courses,1):null}
                {this.TabItem(strings.fav,2)} */}
                    {this.TabItem(
                      userRole == 'Trainer'
                        ? strings.reservtions_halls
                        : userRole == 'Center'
                        ? strings.courses_reser
                        : strings.reservtions,
                      0,
                    )}
                    {userRole != 'User' && userRole != 'Trainer'
                      ? this.TabItem(
                          userRole == 'Center'
                            ? strings.courses
                            : userRole == 'Halls Provider'
                            ? strings.halls
                            : strings.trainees,
                          1,
                        )
                      : null}
                    {/* {userRole != 'Halls Provider'?
                     this.TabItem(strings.fav, 2)
                      : null} */}
                      { this.TabItem(strings.fav, 2)}
                  </View>
                </View>
              </ImageBackground>
              {this.state.loading ? (
                <ActivityIndicator
                  size={'large'}
                  color={'blue'}
                  style={{marginTop: 30}}
                />
              ) : (
                this.ShowScrollsBasedOnCurrentTab()
              )}
            </>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20}}>{strings.loginFirst}</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SignMenu')}>
                <Text style={{fontSize: 20, color: 'blue'}}>
                  {strings.login}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <BottomMenu navigation={this.props.navigation} ScrollingDir={true} />
        </SafeAreaView>
      </View>
    );
  }
}

export default Reservations;
const styles = StyleSheet.create({
  TabTxt: {
    textAlign: 'center',
    marginTop: hp('2.5%'),
    // width: wp('50%'),
    height: hp('4.5%'),
    color: 'white',
    fontSize: wp('4%'),
    fontFamily: fonts.normal
  },
  MiddleTxt: {color: 'white', fontSize: wp('5%'), marginLeft: wp('28%')},
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
    height: hp('12%'),
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
