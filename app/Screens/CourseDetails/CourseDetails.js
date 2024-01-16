import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
import UserProfile from '../../UserProfile';
import { AddReview } from '../common';
import BestCoachesCirclesScroll from '../common/BestcoachesCirclesScroll';
import BestCoachesItemCircle from '../common/Items/BestcoachesItemCircle';
import ModalPicker from '../common/ModalPicker';
import strings from '../strings';

class CourseDetails extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.HideReview = this.HideReview.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.state = {
      CurrentScrollIndex: 1,
      Data: '',
      loading: true,
      IamOwner: false,
      ShowReview: false,
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      date: '',
      isFavourite: this.props.route.params.IsFav,
    };
  }

  componentDidMount() {
    this.GetData();
  }

  HideReview() {
    this.setState({ShowReview: false});
  }
  ShowReloadBTN() {
    alert(strings.somthingWentWrong);
    this.setState({ShowReloadBTN: true, loading: false});
  }

  ReloadBTN() {
    this.setState({Data: '', loading: true, ShowReloadBTN: false});
    this.GetData();
  }

  GetData() {
    let ParamsData = this.props.route.params;
    console.log('ParamsData.CourseID:' + ParamsData.CourseID);
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/courses/' +
          ParamsData.CourseID +
          '?user_id=' +
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
            console.log('responseJson: omar' + JSON.stringify(responseJson));
            if (responseJson.success) {
              this.setState({
                loading: false,
                Data: responseJson.data,
                IamOwner:
                  responseJson.data.owner.id ==
                  UserProfile.getInstance().clientObj.user.id,
              });
            } else {
              this.AddBTN();
              // this.setState({ loading: false })
              alert(strings.somthingWentWrong);
            }
          })
          .catch(error => {
            // this.setState({ loading: false })
            console.log('Thirderr:' + error);
            alert(strings.somthingWentWrong);
          });
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: CourseDetails.js:107 ~ CourseDetails ~ GetData ~ error:',
        error,
      );
      // console.log('FourthErr:' + error);
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  Dot() {
    return (
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,.13)',
          width: 21,
          height: 3,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3,
        }}
      />
    );
  }

  Photo(Img) {
    return (
      <View style={styles.slide1}>
        <Image
          style={styles.slideBackGroundIMG}
          source={{uri: Img}}
          resizeMode="contain"
        />
      </View>
    );
  }

  SwiperPhotos() {
    this.Photo(require('../../res/course.png'));
  }

  Photos(Data) {
    return (
      <View
        style={{
          width: wp('95%'),
          alignSelf: 'center',
          marginTop: hp('1%'),
          height: hp('35%'),
        }}>
        <Swiper
          index={this.state.CurrentScrollIndex}
          activeDotStyle={styles.activeDotStyle}
          loop={true}
          ref={swiper => {
            this._swiper = swiper;
          }}
          style={styles.wrapper}>
          {this.Photo(Data.image)}
        </Swiper>
        <View
          style={{
            position: 'absolute',
            bottom: hp('6%'),
            right: 0,
            alignItems: 'center',
            width: wp('30%'),
            height: hp('5%'),
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: wp('15%'),
              height: hp('4%'),
            }}>
          
          </View>
        </View>
      </View>
    );
  }

  Header(Data) {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    let userType = UserProfile.getInstance().clientObj.user.role[0];

    return (
      <ImageBackground
        source={require('../../res/topbar2.png')}
        style={styles.Header}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: wp('100%'),
            height: hp('10%'),
            paddingHorizontal: wp('4%'),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // width: wp('25%'),
            }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name={IsAr ? 'arrow-forward' : 'arrow-back'}
                size={30}
                color={'white'}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // width: wp('50%'),
            }}>
            <Text
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: hp('3%'),
                color: 'white',
              }}>
              {Data.title}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              // width: wp('20%'),
            }}>
            {/* omar edit */}
            { userType !== 'Trainer' ? ( //userType !== 'Center' &&
              <TouchableOpacity onPress={() => this.AddToFav()}>
                <Icon
                  name={this.state.isFavourite ? 'star' : 'star-border'}
                  size={35}
                  color={this.state.isFavourite ? 'gold' : 'white'}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => this.share(Data.course_field.title_ar)}>
              <Icon name="share" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  StarsNoList = StarsNo => {
    let MyStarsNoList = [];
    for (let i = 0; i < 5; i++)
      MyStarsNoList.push(
        <Icon
          key={i}
          name="star"
          size={20}
          color={i < StarsNo ? '#FFD685' : 'grey'}
        />,
      );
    return MyStarsNoList;
  };

  Stars(StarsNo) {
    return (
      <View
        style={{
          marginLeft: wp('5%'),
          alignItems: 'center',
          flexDirection: 'row',
          width: wp('35%'),
          height: hp('4%'),
        }}>
        {this.StarsNoList(StarsNo)}
      </View>
    );
  }

  Item(IconName, Title, Body, Width) {
    return (
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          width: wp(Width),
          height: hp('5%'),
        }}>
        <Icon name={IconName} size={23} color={'black'} />
        <Text style={{fontSize: hp('2%'), color: 'silver'}}> {Title} </Text>
        <Text style={{fontSize: hp('2%'), color: 'black'}}> {Body} </Text>
      </View>
    );
  }

  DescTxt(Title, Body) {
    return (
      <View style={{width: wp('90%'), alignSelf: 'center'}}>
        <Text
          style={{
            alignSelf: 'flex-start',
            fontSize: wp('5%'),
            marginTop: hp('3%'),
          }}>
          {Title}
        </Text>
        <View style={{alignItems: 'flex-start', marginTop: 4}}>
          {/* <HTML source={Body} /> */}
          <Text style={{fontSize: hp('2%'), color: 'black'}}> {Body} </Text>
        </View>
      </View>
    );
  }

  CheckItem(Body) {
    return (
      <View style={{width: wp('70%'), flexDirection: 'row'}}>
        <Icon name="check" size={30} color={'silver'} />
        <Text style={{fontSize: wp('4%'), color: 'grey'}}> {Body}</Text>
      </View>
    );
  }

  CheckList(Title, Data) {
    console.log(
      '🚀 ~ file: CourseDetails.js:354 ~ CourseDetails ~ CheckList ~ Data:',
      Data.hall,
    );
    return (
      <View style={{width: wp('90%'), alignSelf: 'center'}}>
        <Text
          style={{
            alignSelf: 'flex-start',
            fontSize: wp('5%'),
            marginTop: hp('3%'),
          }}>
          {Title}
        </Text>
        {Data.hall != null
          ? this.CheckItem(strings.hall + ': ' + Data.hall.title)
          : null}
        {this.CheckItem(strings.noOfDays + ': ' + Data.days_per_week)}
        {this.CheckItem(`${strings.cost} : ${Data.cost} ${strings.SAR}`)}
        {this.CheckItem(
          strings.remoteCourse +
            ': ' +
            (Data.remote == 0 ? strings.no : strings.yes),
        )}
        {this.CheckItem(
          strings.studentEvalute +
            ': ' +
            (Data.evaluate_students == true ? strings.yes : strings.no),
        )}
        {this.CheckItem(
          strings.thereIsCertificate +
            ': ' +
            (Data.certify_students == true ? strings.yes : strings.no),
        )}
      </View>
    );
  }

  BestCoachesItems(Owner) {
    return (
      <BestCoachesItemCircle
        Title={Owner.full_name}
        Img={{uri: Owner.photo}}
        navigation={this.props.navigation}
      />
    );
  }

  BestCoaches(Owner) {
    return (
      <View style={{marginTop: hp('5%'), width: wp('90%'), height: hp('20%')}}>
        <BestCoachesCirclesScroll
          Title={strings.aboutTrainer}
          Items={this.BestCoachesItems(Owner)}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  AddToFav() {
    let Data = this.state.Data;
    Data.is_favorited = !Data.is_favorited;
    this.setState({Data: Data});
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/courses/' +
          Data.id +
          '/favorite?user_id=' +
          UserProfile.getInstance().clientObj.user.id,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
          },
        },
      ).then(response => {
        this.setState({loading: false});
        response
          .json()
          .then(responseJson => {
            console.log('Success:' + JSON.stringify(responseJson));
            if (responseJson.success) {
              this.setState({isFavourite: !this.state.isFavourite});
            }
          })
          .catch(error => {
            console.log('Thirderr:' + error);
          });
      });
    } catch (error) {
      console.log('FourthErr:' + error);
    }
  }

  Share(Title) {
    const shareOptions = {
      title: 'مشاركة',
      message: 'دورة ' + Title + ' مقدمة من تطبيق ارتقي',
      url: 'http://play.google.com/store/apps/details?id=com.fudex.ertaqee',
    };
    Share.open(shareOptions);
  }

  share = async Title => {
    const options = {
      message: `مشاركة ${`\n\n`} دورة ${Title} مقدمة من تطبيق ارتقي ${`\n\n`} ${'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'}`,
    };
    const response = await Share.share(options);
  };

  GetCourseGender(Gender) {
    if (Gender == 'men') return strings.mensOnly;
    else if (Gender == 'women') return strings.womensOnly;
    else return strings.menAndWomen;
  }

  EditBTN() {
    this.props.navigation.navigate('CreateNew', {
      CourseObj: this.state.Data,
      Course: true,
    });
  }

  RemoveBTN() {
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/courses/' +
          this.state.Data.id +
          '/delete?token=' +
          UserProfile.getInstance().clientObj.token,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer ' + UserProfile.getInstance().clientObj.token,
          },
        },
      ).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log(
              'responseJson: delete omar' + JSON.stringify(responseJson),
            );
            if (responseJson.success) {
              alert(strings.successProcess);
              this.props.navigation.navigate('Home');
            } else {
              alert(responseJson.message);
            }
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            alert(strings.somthingWentWrong);
          });
      });
    } catch (error) {
      console.log('FourthErr:' + error);
      alert(strings.entervaliddata);
    }
  }

  AddBTN() {
    console.log('AddBTN');
    this.props.navigation.navigate('CreateNew', {
      Course: true,
    });
  }

  RepeatBTN() {
    this.props.navigation.navigate('CreateNew', {
      CourseObj: this.state.Data,
      Course: true,
      Repeat: true,
    });
  }

  EditOrRemovePicker() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    console.log({
      userRole,
      Data: this.state.Data,
      user: UserProfile.getInstance().clientObj.user,
    });
    var PickerItems = [];

    if (userRole === 'Center' || userRole === 'Trainer') {
      if (
        this.state.Data.owner.id === UserProfile.getInstance().clientObj.user.id
      ) {
        PickerItems.push({name: strings.edit, id: 2});
      }
      if (
        this.state.Data.owner.id === UserProfile.getInstance().clientObj.user.id
      ) {
        PickerItems.push({name: strings.remove, id: 3});
      }
       if(this.state.Data.owner.id ===UserProfile.getInstance().clientObj.user.id){
        PickerItems.push({name: strings.repeat, id: 5})
      }
    } else if (userRole === 'User') {
      if (this.state.Data.is_reserved) {
        PickerItems.push({name: strings.evalute, id: 4});
      }
    }

    return (
      <View
        style={{
          position: 'absolute',
          width: wp('30%'),
          right: 6,
        }}>
        {/* <Picker
          selectedValue={this.state.EditOrRemove}
          style={{backgroundColor: 'transparent', flex: 0}}
          mode={'dialog'}
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue == 1) this.AddBTN();
            else if (itemValue == 2) this.EditBTN();
            else if (itemValue == 3) this.RemoveBTN();
            else if (itemValue == 4) this.setState({ShowReview: true});
            else if (itemValue == 5) this.RepeatBTN();
          }}>
          {PickerItems}
        </Picker> */}
        {PickerItems.length > 0 ? (
          <ModalPicker
            hasBorder={true}
            data={PickerItems}
            hint={strings.choose}
            onSelect={(index, value) => {
              if (value.id == 1) this.AddBTN();
              else if (value.id == 2) this.EditBTN();
              else if (value.id == 3) this.RemoveBTN();
              else if (value.id == 4) this.setState({ShowReview: true});
              else if (value.id == 5) this.RepeatBTN();
            }}
          />
        ) : null}
      </View>
    );
  }

  BookNowBTN() {
    // this.setState({isDatePickerVisible: true})
    let CanReserveCourse = UserProfile.getInstance().CanReserveCourse();
    console.log(
      '🚀 ~ file: CourseDetails.js:604 ~ CourseDetails ~ BookNowBTN ~ CanReserveCourse:',
      this.state.Data.is_availabel,
    );
    // if (CanReserveCourse) {
      if (this.state.Data.is_availabel) {
        this.props.navigation.navigate('CourseCart', {
          course_id: this.state.Data.id,
        });
      } else {
        alert(strings.up_to_data);
      }
    // } else {
    //   alert(strings.featuresNotAllowed);
    // }
  }

  BookNow() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: 'white',
          width: wp('100%'),
          height: hp('9%'),
        }}>
        <TouchableOpacity
          style={[styles.LoginBTNStyle, {width: wp('80%')}]}
          onPress={() => this.BookNowBTN()}>
          <Text style={{color: 'white'}}>{strings.addReservationtoCart}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // this.setState({isTimePickerVisible: true})

  DatePickerWindow() {
    let Data = this.state.Data;
    if (!this.state.isDatePickerVisible) return;
    return (
      <DateTimePicker
        onChange={this.handleDatePicked}
        minimumDate={new Date(Data.date[0].start_date)}
        maximumDate={new Date(Data.date[0].end_date)}
        value={new Date()}
        style={{width: '99%'}} //add this
      />
    );
  }

  handleDatePicked = (event, date) => {
    this.setState({isDatePickerVisible: false});
    var date_picked = moment(date).format('YYYY-MM-DD');
    this.setState({
      date: date_picked,
      isDatePickerVisible: false,
      isTimePickerVisible: true,
    });
    console.log('date_picked', date_picked);
  };

  renderModel() {
    let Data = this.state.Data;
    return (
      <Modal
        isVisible={this.state.isTimePickerVisible}
        onBackdropPress={() => this.setState({isTimePickerVisible: false})}
        swipeDirection="down">
        <View style={styles.modal}>
          <Text style={{fontSize: hp('2%'), color: 'black'}}>
            {this.state.date}
          </Text>
          {Data.date.map((item, index) => {
            return (
              <TouchableOpacity
                key={(index, item.id)}
                onPress={() => {
                  this.setState({isTimePickerVisible: false});
                  let CanReserveCourse =
                    UserProfile.getInstance().CanReserveCourse();
                  if (CanReserveCourse) {
                    if (this.state.Data.is_availabel) {
                      this.props.navigation.navigate('CourseCart', {
                        course_id: this.state.Data.id,
                      });
                    } else {
                      alert(strings.up_to_data);
                    }
                  } else {
                    alert(strings.featuresNotAllowed);
                  }
                }}
                style={{
                  marginTop: hp('2%'),
                  alignItems: 'center',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  backgroundColor: 'blue',
                  borderRadius: 5,
                  paddingHorizontal: wp('2%'),
                  width: wp('70%'),
                  height: hp('5%'),
                }}>
                <Text style={{fontSize: hp('2%'), color: 'white'}}>
                  {strings.from}
                  {': '}
                </Text>
                <Text style={{fontSize: hp('2%'), color: 'white'}}>
                  {item.start_time}
                </Text>
                <View style={{width: wp('6%')}} />
                <Text style={{fontSize: hp('2%'), color: 'white'}}>
                  {strings.too}
                  {': '}
                </Text>
                <Text style={{fontSize: hp('2%'), color: 'white'}}>
                  {item.end_time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    );
  }

  render() {
    let CanReserveCourse = UserProfile.getInstance().CanReserveCourse();
    if (this.state.loading)
      return (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );

    let Data = this.state.Data;
    console.log('Data:' + JSON.stringify(Data));
    try {
    } catch (e) {
      console.log('Error:' + e);
    }

    return (
      <SafeAreaView style={{flex: 1}}>
        <Image
          style={{position: 'absolute', top: hp('65%'), right: 0}}
          source={require('../../res/backgroundlogo.png')}
        />
        {this.Header(Data)}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 9}}
          showsHorizontalScrollIndicator={false}>
          {this.Photos(Data)}
          <View
            style={{
              alignSelf: 'center',
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: hp('3%'),
                color: '#25252A',
              }}>
              {' '}
              {Data.title}{' '}
            </Text>

            <View>
              {/* <Image
                style={styles.BackArrow1}
                source={require('../../res/menudots.png')}
              /> */}
              {this.EditOrRemovePicker()}
            </View>
          </View>
          {this.Stars(Data.average_rate)}

          {Data.date.map((item, index) => {
            return (
              <View
                key={item.id}
                style={{
                  marginTop: hp('1%'),
                  alignItems: 'center',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: wp('90%'),
                  height: hp('5%'),
                }}>
                {this.Item('date-range', '', item.start_date, '40%')}
                {this.Item('date-range', '', item.end_date, '40%')}
              </View>
            );
          })}

          {/* {this.Item('mic', '', '', '90%')} */}
          {this.Item(
            'person',
            strings.typeOfCourse,
            this.GetCourseGender(Data.individuals_type),
            '90%',
          )}
          {this.Item(
            'equalizer',
            strings.number_of_hours,
            Data.number_of_hours,
            '90%',
          )}

          {Data.date.map(item => {
            return (
              <View
                key={item.id}
                style={{
                  marginTop: hp('1%'),
                  alignItems: 'center',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: wp('90%'),
                  height: hp('5%'),
                }}>
                {this.Item('timer', '', item.start_time, '40%')}
                {this.Item('timer', '', item.end_time, '40%')}
              </View>
            );
          })}

          {Data.center
            ? this.Item(
                'location-on',
                strings.trainingCentersFollow,
                Data.center.center_trade_name,
                '90%',
              )
            : this.Item(
                'location-on',
                strings.trainingCentersFollow,
                strings.none,
                '90%',
              )}
          {this.DescTxt(strings.aboutCourse, Data.details)}
          {this.CheckList(strings.checkList, Data)}
          {this.BestCoaches(Data.owner)}
          <View style={{height: hp('20%')}} />
          {this.DatePickerWindow()}
        </ScrollView>
        <View style={{width: '100%'}}>
          {/* {CanReserveCourse && Data.is_availabel ? this.BookNow() : null} */}
          { 
          this.state.Data.owner.id !== UserProfile.getInstance().clientObj.user.id
          ? this.BookNow() : null} 

          {/*<BottomMenu navigation={this.props.navigation}/>*/}
          <AddReview
            APILink={
              'http://www.ertaqee.com/api/v1/course/' +
              this.state.Data.id +
              '/review'
            }
            Show={this.state.ShowReview}
            HideReview={this.HideReview}
          />
          {this.renderModel()}
        </View>
      </SafeAreaView>
    );
  }
}

export default CourseDetails;
const styles = StyleSheet.create({
  LoginBTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('40%'),
    height: hp('5%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('2%'),
  },
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-7%'),
    bottom: 0,
    resizeMode: 'contain',
    width: wp('65%'),
    height: hp('25%'),
  },
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  skiptxt: {fontSize: hp('2%'), fontWeight: 'bold', color: 'white'},
  SkipView: {
    flexDirection: 'row',
    position: 'absolute',
    width: wp('100%'),
    height: hp('5%'),
    marginTop: hp('95%'),
  },
  slideView: {
    marginTop: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('15%'),
  },
  slideBackGroundIMG: {
    borderRadius: hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('30%'),
  },
  BTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('40%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('3%'),
  },
  BTNTxt: {fontWeight: 'bold', fontSize: hp('2.5%'), color: 'white'},
  Desc: {
    textAlign: 'center',
    marginTop: hp('2.7%'),
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: 'white',
  },
  activeDotStyle: {
    backgroundColor: 'rgba(77, 117, 184,255)',
    width: 9,
    height: 9,
    borderRadius: 9 / 2,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  wrapper: {
    flexDirection: 'row-reverse',
  },
  Loader: {justifyContent: 'center', alignItems: 'center', flex: 1},
  slide1: {
    flex: 1,
    alignItems: 'center',
  },
  BackArrow: {
    tintColor: '#4D75B8',
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
  },
  BackArrow1: {
    tintColor: 'black',
    resizeMode: 'contain',
    width: wp('5%'),
    height: hp('3.5%'),
  },
  modal: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp('3%'),
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
