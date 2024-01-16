import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
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
import Swiper from 'react-native-swiper';
import UserProfile from '../../UserProfile';
import { FloatingCartBTN } from '../common';
import BestCoachesCirclesScroll from '../common/BestcoachesCirclesScroll';
import BestCoachesScroll from '../common/BestcoachesScroll';
import BestCoachesItem from '../common/Items/BestcoachesItem';
import BestCoachesItemCircle from '../common/Items/BestcoachesItemCircle';
import PhotoHorItem from '../common/Items/PhotoHorItem';
import ModalPicker from '../common/ModalPicker';
import strings from '../strings';

class CenterDetails extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.HideReview = this.HideReview.bind(this);
    this.state = {
      CurrentScrollIndex: 1,
      Data: '',
      loading: true,
      loadingAllTrainer: false,
      AllTrainer: [],
    };
  }

  componentDidMount() {
    this.GetData();
    this.GetAllTrainer();
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
    console.log('ParamsData.ItemID:' + ParamsData.ItemID);
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/centers/' + ParamsData.ItemID, {
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
              this.setState({loading: false, Data: responseJson.data});
            else {
              this.setState({loading: false});
              alert(strings.somthingWentWrong);
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

  GetAllTrainer() {
    this.setState({loadingAllTrainer: true});
    fetch('https://www.demo.ertaqee.com/api/v1/trainers', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('GetAllTrainer ', responseJson);
        this.setState({
          AllTrainer: responseJson.data.trainers,
          loadingAllTrainer: false,
        });
      })
      .catch(error => {
        this.setState({loadingAllTrainer: false});
        console.log('123123error:' + error);
      });
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

  Photos(IMGS) {
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
          {this.Photo(IMGS)}
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
            {/*
              <Icon name='bookmark-border' color='white' style={styles.BackArrow1}/>
              <Image style={styles.BackArrow1} source={require('../../res/menudots.png')} />
              */}
          </View>
        </View>
      </View>
    );
  }

  Header(Data) {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
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
            width: wp('96%'),
            height: hp('10%'),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: hp('1.8%'),
                color: 'white',
              }}>
              {Data.center_trade_name}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => this.AddToFav()}>
              <Icon 
                name={Data && Data.is_favorited ? 'bookmark':'bookmark-border'}
                size={35}
                color={Data && Data.is_favorited ? 'gold' : 'white'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.share(Data.job_title)}>
              <Icon name="share" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  AddToFav(IsFav) {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    if (userRole == 'Guest') {
      alert(strings.must_login);
      return;
    }
    let Data = this.state.Data;
    Data.is_favorited = !Data.is_favorited;
    this.setState({Data: Data});
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/courses/' + Data.id + '/favorite', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then(response => {
        this.setState({loading: false});
        response
          .json()
          .then(responseJson => {
            console.log('Success:' + JSON.stringify(responseJson));
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

  Item(IconName, Title, Body, Width, IconColor) {
    return (
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          width: wp(Width),
          height: hp('6%'),
        }}>
        <Icon
          name={IconName}
          size={23}
          color={IconColor ? IconColor : 'black'}
        />
        <Text
          style={{textAlign: 'left', fontSize: hp('1.8%'), color: 'silver'}}>
          {' '}
          {Title}{' '}
        </Text>
        <Text
          style={{
            textAlign: 'left',
            width: wp('70%'),
            fontSize: hp('1.8%'),
            color: 'black',
          }}>
          {' '}
          {Body}{' '}
        </Text>
      </View>
    );
  }
  // source={require('../../res/example.png')}

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
        <Text style={{marginTop: hp('2%'), fontSize: wp('4%'), color: 'grey'}}>
          {Body}
        </Text>
      </View>
    );
  }

  CheckItem() {
    return (
      <View style={{width: wp('70%'), flexDirection: 'row'}}>
        <Icon name="check" size={30} color={'silver'} />
        <Text style={{fontSize: wp('4%'), color: 'grey'}}>
          {' '}
          {strings.sometxt}
        </Text>
      </View>
    );
  }

  CheckList(Title) {
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
        {this.CheckItem()}
        {this.CheckItem()}
        {this.CheckItem()}
        {this.CheckItem()}
        {this.CheckItem()}
      </View>
    );
  }

  AvailableHallsItems(Halls) {
    let Items = [];
    for (let i = 0; i < Halls.length; i++)
      Items.push(
        <BestCoachesItemCircle
          key={i}
          Img={{uri: Halls[i].main_image}}
          Title={Halls[i].title}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  }

  AvailableHalls(Halls) {
    return (
      <View style={{width: wp('100%'), height: hp('20%')}}>
        <BestCoachesCirclesScroll
          Title={strings.hallsOfCenter}
          Items={this.AvailableHallsItems(Halls)}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  BestCoachesItems(Trainers) {
    let Items = [];
    for (let i = 0; i < Trainers.length; i++)
      Items.push(
        <BestCoachesItemCircle
          key={i}
          Img={{uri: Trainers[i].photo}}
          Title={Trainers.full_name}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  }

  BestCoaches(Trainers) {
    if (Trainers.length < 1)
      return (
        <View
          style={{
            margin: hp('5%'),
            height: hp('5%'),
            justifyContent: 'space-between',
            width: wp('90%'),
            alignSelf: 'center',
          }}>
          <Text style={{fontSize: wp('4.5%'), textAlign: 'left'}}>
            المدربين
          </Text>
          <Text style={{fontSize: wp('3.5%'), textAlign: 'left'}}>لايوجد</Text>
        </View>
      );
    return (
      <View style={{width: wp('100%'), height: hp('22%')}}>
        <BestCoachesCirclesScroll
          Title={strings.trainers}
          Items={this.BestCoachesItems(Trainers)}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  PhotosAndVidsItems = () => {
    let IMGS = this.state.Data.photo;
    let Items = [];
    for (let i = 0; i < 1; i++)
      Items.push(
        <PhotoHorItem
          key={i}
          img={{uri: IMGS}}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  PhotosAndVidsScroll() {
    return (
      <View style={{marginTop: hp('1%'), width: wp('100%'), height: hp('25%')}}>
        <BestCoachesScroll
          Items={this.PhotosAndVidsItems()}
          Title={strings.photos}
          ViewAll={' '}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  CertsItems = () => {
    let Items = [];
    for (let i = 0; i < 2; i++)
      Items.push(
        <BestCoachesItem
          key={i}
          Title={' '}
          SubTitle={' '}
          Img={require('../../res/cert.png')}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  Certs() {
    return (
      <View
        style={{marginTop: hp('-2%'), width: wp('100%'), height: hp('25%')}}>
        <BestCoachesScroll
          Items={this.CertsItems()}
          Title={' '}
          ViewAll={' '}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  OpenMap(Lat, Lon) {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${Lat},${Lon}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  }

  TrainerPicker() {
    let loadingAllTrainer = this.state.loadingAllTrainer;
    try {
      if (loadingAllTrainer)
        return (
          <View style={styles.InputView}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
    } catch {
      return (
        <View style={styles.InputView}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }
    let AllTrainer = this.state.AllTrainer;
    if (AllTrainer.length !== 0) {
      let PickerItems = [];
      // PickerItems.push(
      //   <Picker.Item key={-1} label={`${strings.Trainer}`} value={null} />,
      // );
      // for (let i = 0; i < AllTrainer.length; i++)
      //   PickerItems.push(
      //     <Picker.Item
      //       key={i}
      //       label={AllTrainer[i].full_name}
      //       value={AllTrainer[i].id}
      //     />,
      //   );
      AllTrainer.forEach(element => {
        const obj = {
          name: element.full_name,
          id: element.id,
        };
        PickerItems.push(obj);
      });

      return (
        <View style={styles.pickerView}>
          {/* <Picker
            style={{height: hp('7%'), width: wp('90%')}}
            selectedValue={this.state.trainer_id}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({trainer_id: itemValue})
            }>
            {PickerItems}
          </Picker> */}
          <ModalPicker
            hasBorder={true}
            data={PickerItems}
            hint={''}
            onSelect={value => {
              this.setState({trainer_id: value.id});
            }}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    if (this.state.loading)
      return (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );

    let Data = this.state.Data;
    try {
      console.log('Data:' + JSON.stringify(Data));
    } catch (e) {
      console.log('Error:' + e);
    }

    return (
      <SafeAreaView>
        <Image
          style={{position: 'absolute', top: hp('65%'), right: 0}}
          source={require('../../res/backgroundlogo.png')}
        />
        {this.Header(Data)}
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{width: wp('100%')}}>
            {this.Photos(Data.photo)}
            <Text
              style={{
                textAlign: 'left',
                fontSize: hp('2.5%'),
                color: '#25252A',
              }}>
              {' '}
              {Data.center_trade_name}{' '}
            </Text>
            {this.Stars(Data.average_rate)}
            {this.Item('timer', strings.workDates, strings.none, '90%')}
            {this.Item('location-on', strings.address, Data.address, '90%')}
            {this.Item(
              'local-activity',
              strings.centerActivity,
              Data.center_activity,
              '90%',
            )}
            <TouchableOpacity
              onPress={() => this.OpenMap(Data.latitude, Data.longitude)}>
              <Image
                style={{
                  resizeMode: 'contain',
                  width: wp('90'),
                  height: hp('14%'),
                  marginTop: hp('1%'),
                  marginBottom: hp('2%'),
                  alignSelf: 'center',
                }}
                source={require('../../res/map.png')}
              />
            </TouchableOpacity>
            {this.PhotosAndVidsScroll()}
            {this.AvailableHalls(Data.related_halls)}
            {this.BestCoaches(Data.related_trainers)}
            <View style={{height: hp('5%')}} />
            <Text
              style={{
                fontSize: hp('2%'),
                color: '#25252A',
                textAlign: 'left',
              }}>
              {' '}
              {strings.contactInfo}
            </Text>
            <View style={{height: hp('1%')}} />
            {this.Item(
              'phone',
              strings.phoneNumber,
              Data.phone,
              '90%',
              'silver',
            )}
            {this.Item('phone', strings.email, Data.email, '90%', 'silver')}
            <View style={{height: hp('5%')}} />
          </View>
        </ScrollView>
        {userRole == 'Guest' ? null : (
          <FloatingCartBTN navigation={this.props.navigation} />
        )}
      </SafeAreaView>
    );
  }
}

export default CenterDetails;
const styles = StyleSheet.create({
  FloatingBTN: {
    elevation: 2,
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
  skiptxt: {fontSize: hp('1.8%'), fontWeight: 'bold', color: 'white'},
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
  BTNTxt: {fontWeight: 'bold', fontSize: hp('2%'), color: 'white'},
  Desc: {
    textAlign: 'center',
    marginTop: hp('2.7%'),
    fontSize: hp('3%'),
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
  BackArrow1: {
    tintColor: 'black',
    resizeMode: 'contain',
    width: wp('5%'),
    height: hp('3.5%'),
  },
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
  pickerView: {
    marginTop: hp('2%'),
    height: hp('7%'),
  },
});
