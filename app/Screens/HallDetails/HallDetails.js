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
import HTML from 'react-native-render-html';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
import UserProfile from '../../UserProfile';
import { AddReview, BestCoachesCirclesScroll, PickDates } from '../common';
import BestCoachesScroll from '../common/BestcoachesScroll';
import BestCoachesItemCircle from '../common/Items/BestcoachesItemCircle';
import PhotoHorItem from '../common/Items/PhotoHorItem';
import ModalPicker from '../common/ModalPicker';
import strings from '../strings';

class HallDetails extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.HideReview = this.HideReview.bind(this);
    this.HidePickDates = this.HidePickDates.bind(this);
    this.BookHall = this.BookHall.bind(this);
    this.state = {
      CurrentScrollIndex: 1,
      Data: '',
      hallCalendar: [],
      loading: true,
      IamOwner: false,
      ShowReview: false,
      ShowAddToCartView: false,
      APILoading: false,
      hallFeatures: [],
      PickerItemsLenght: 0,
      hallStatus: null,
    };
  }

  componentDidMount() {
    this.GetData();
    this.GetHalls_featuresData();
  }

  BookHall(PickedDatesIDs) {
    console.log('BookHall');
    const {Data, APILoading} = this.state;
    if (APILoading) return;
    this.setState({APILoading: true});
    const MyFormData = new FormData();
    MyFormData.append('hall_id', '' + Data.id);
    MyFormData.append('date_ids', JSON.stringify(PickedDatesIDs));
    console.log('MyFormData:' + JSON.stringify(MyFormData));
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/add_hall_to_cart?token=' +
          UserProfile.getInstance().clientObj.token,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer ' + UserProfile.getInstance().clientObj.token,
          },
          body: MyFormData,
        },
      ).then(response => {
        response
          .json()
          .then(responseJson => {
            this.setState({ShowAddToCartView: false, APILoading: false});
            console.log('Success:' + JSON.stringify(responseJson));
            if (responseJson.errors) alert(responseJson.errors[0]);
            else {
              alert(strings.successProcess);
              this.props.navigation.navigate('Home');
            }
          })
          .catch(error => {
            alert(strings.somthingWentWrong);
            this.setState({APILoading: false});
            console.log('Thirderr:' + error);
          });
      });
    } catch (error) {
      alert(strings.somthingWentWrong);
      this.setState({APILoading: false});
      console.log('FourthErr:' + error);
    }
  }

  HidePickDates() {
    this.setState({ShowAddToCartView: false});
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
    console.log(
      'ParamsData.ItemID:' + UserProfile.getInstance().clientObj.user.id,
    );
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/halls/' +
          ParamsData.ItemID +
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
            console.log('responseJson: hall detail', responseJson);
            if (responseJson.success)
              this.setState({
                loading: false,
                Data: responseJson.data.hall,
                hallCalendar: responseJson.data.hallCalendar,
                IamOwner:
                  responseJson.data.hall.owner.id ==
                  UserProfile.getInstance().clientObj.user.id,
                hallStatus: responseJson.data.hall.status,
              });
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

  GetHalls_featuresData() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    fetch('https://www.demo.ertaqee.com/api/v1/halls_features', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        const data = [];
        var arr = responseJson.data.items;
        console.log('Here GetHalls_featuresData' + JSON.stringify(arr));
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id.toString(),
            name: IsAr ? arr[index].name_ar : arr[index].name_en,
          };
          data.push(obj);
        }
        this.setState({
          hallFeatures: data,
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  Dot() {
    return (
      <View
        style={{
          backgroundColor: '#F9F9F9',
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
        <Image style={styles.slideBackGroundIMG} source={{uri: Img}} />
      </View>
    );
  }

  Photos(IMGS, mainImage) {
    let MyIMGS = [];
    if (IMGS.length < 1)
      return (
        <View style={[styles.slide1]}>
          <Image
            style={[styles.slideBackGroundIMG, {resizeMode: 'cover'}]}
            source={
              mainImage ? {uri: mainImage} : require('../../res/aboutlogo.png')
            }
          />
        </View>
      );
    for (let i = 0; i < 1; i++) MyIMGS.push(this.Photo(IMGS[0].path));

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
          {MyIMGS}
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
    // omar edit
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    let IsHallProvider = UserProfile.getInstance().IsHallProvider();

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
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // width: wp('50%'),
              flex: 1,
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
            {/* {IsHallProvider ? null : ( */}
              <TouchableOpacity onPress={() => this.AddToFav()}>
                <Icon
                  name={Data && Data.is_favorited ? 'star' : 'star-border'}
                  size={35}
                  color={Data && Data.is_favorited ? 'gold' : 'white'}
                />
              </TouchableOpacity>
             {/* )} */}

            <TouchableOpacity onPress={() => this.share(Data.title)}>
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

  Item(IconName, Title, Body, Width, IconColor, IconSize) {
    return (
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          width: wp(Width),
          height: hp('5%'),
        }}>
        <Icon
          name={IconName}
          size={23}
          color={IconColor ? IconColor : 'black'}
        />
        <Text style={{fontSize: hp('2%'), color: 'silver'}}> {Title} </Text>
        <Text style={{fontSize: hp('2%'), color: 'black'}}> {Body} </Text>
      </View>
    );
  }

  DescTxt(Title, data, desc) {
    let Data = this.state.Data;
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
        {this.state.hallFeatures.map((item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: wp('1%'),
              }}>
              <Text
                style={{
                  fontSize: wp('4%'),
                  color: 'black',
                  flex: 1,
                  textAlign: 'left',
                }}>
                {item.name}
              </Text>
              <Text style={{fontSize: wp('4%'), color: 'black'}}>
                {data?.includes(item.id) ? strings.yes : strings.no}
              </Text>
            </View>
          );
        })}
        <View style={{alignItems: 'flex-start', marginTop: 4}}>
          <HTML source={desc} />
        </View>
      </View>
    );
  }

  CheckItem(Body) {
    return (
      <View style={{width: wp('70%'), flexDirection: 'row'}}>
        <Icon name="check" size={30} color={'silver'} />
        <Text style={{fontSize: wp('4%'), color: 'grey'}}>{Body}</Text>
      </View>
    );
  }

  CheckList(Title, Data) {
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
        {this.CheckItem(`${strings.cost} : ${Data.cost} ${strings.SAR}`)}
        {Data.address != null &&
          this.CheckItem(strings.address + ': ' + Data.address)}
        {Data.center &&
          this.CheckItem(strings.center + Data.center.center_trade_name)}
        {Data.country &&
          this.CheckItem(strings.country + ' ' + Data.country.title)}
        {Data.city && this.CheckItem(strings.city + ' ' + Data.city.title)}
      </View>
    );
  }

  AvailableHallsItems = () => {
    let Items = [];
    for (let i = 0; i < 5; i++)
      Items.push(
        <BestCoachesItemCircle
          key={i}
          Img={require('../../res/itemsample.png')}
          Title={strings.hallName}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  AvailableHalls() {
    return (
      <View style={{width: wp('100%'), height: hp('20%')}}>
        <BestCoachesCirclesScroll
          Title={strings.numberOfHallsinCenter}
          Items={this.AvailableHallsItems()}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  BestCoachesItems = () => {
    let Items = [];
    for (let i = 0; i < 3; i++)
      Items.push(
        <BestCoachesItemCircle
          key={i}
          Title={strings.trainerName}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  BestCoaches() {
    return (
      <View style={{width: wp('100%'), height: hp('20%')}}>
        <BestCoachesCirclesScroll
          Title={strings.hallsOfCenter}
          Items={this.BestCoachesItems()}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  PhotosAndVidsItems = () => {
    let IMGS = this.state.Data.images;
    let Items = [];
    for (let i = 0; i < IMGS.length; i++)
      Items.push(<PhotoHorItem key={i} img={{uri: IMGS[i].path}} />);
    return Items;
  };

  PhotosAndVidsScroll(IMGS) {
    if (IMGS.length < 1)
      return (
        <View style={{width: wp('90%'), alignSelf: 'center'}}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: wp('5%'),
              marginTop: hp('3%'),
            }}>
            {strings.hall} {strings.photos}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: wp('3%'),
              marginTop: hp('2%'),
            }}>
            {strings.none}
          </Text>
        </View>
      );
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

  AddToFav() {
    let Data = this.state.Data;
    Data.is_favorited = !Data.is_favorited;
    this.setState({Data: Data});
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/halls/' +
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

  GetGender(Gender) {
    if (Gender == 'men') return strings.mensOnly;
    else if (Gender == 'women') return strings.womensOnly;
    else return strings.menAndWomen;
  }

  /*
{this.CheckList('شيك ليست')}
{this.Certs()}
<Text style={{marginTop:hp('2%'),alignSelf:'center',width:wp('90%'),fontSize:hp('2%'),color:'#25252A'}}>{strings.shortTxt}</Text>
*/

  FeatureItem(IconName, Title) {
    return (
      <View
        style={{
          margin: 5,
          backgroundColor: 'white',
          height: hp('7%'),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Icon name={IconName} style={{margin: 3}} size={30} color={'#4D75B8'} />
        <Text style={{margin: 3, fontSize: hp('2%'), color: 'silver'}}>
          {' '}
          {Title}{' '}
        </Text>
      </View>
    );
  }

  FeatureItemImg(Img, Title) {
    return (
      <View
        style={{
          margin: 5,
          backgroundColor: 'white',
          height: hp('7%'),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Image
          style={{
            margin: 5,
            resizeMode: 'contain',
            width: wp('7%'),
            height: hp('7%'),
          }}
          source={Img}
        />
        <Text style={{margin: 3, fontSize: hp('2%'), color: 'silver'}}>
          {' '}
          {Title}{' '}
        </Text>
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

  AddBTN() {
    console.log('AddBTN');
    this.props.navigation.navigate('CreateNew');
  }

  EditBTN() {
    console.log('EditBTN');
    this.props.navigation.navigate('CreateNew', {
      HallObj: this.state.Data,
    });
  }

  RemoveBTN() {
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/halls/' +
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
            console.log('responseJson delete:' + JSON.stringify(responseJson));
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

  // EditOrRemovePicker() {
  //   let userRole = UserProfile.getInstance().clientObj.user.role[0];
  //   console.log({
  //     userRole,
  //     Data: this.state.Data,
  //     user: UserProfile.getInstance().clientObj.user,
  //   });
  //   let PickerItems = [];

  //   PickerItems.push(<Picker.Item label={strings.choose + ':'} value={0} />);
  //   {
  //     userRole === 'Halls Provider' &&
  //       PickerItems.push(<Picker.Item label={strings.add} value={1} />);
  //   }
  //   // if(this.state.IamOwner)//T,Only for test
  //   // {
  //   {
  //     userRole === 'Halls Provider' &&
  //       this.state.Data.owner.id ===UserProfile.getInstance().clientObj.user.id &&
  //       PickerItems.push(<Picker.Item label={strings.edit} value={2} />);
  //   }
  //   {
  //     userRole === 'Halls Provider' &&
  //       this.state.Data.owner.id ===UserProfile.getInstance().clientObj.user.id &&
  //       PickerItems.push(<Picker.Item label={strings.remove} value={3} />);
  //   }
  //   //  omar edit
  //   {
  //     userRole === 'Halls Provider' &&
  //       this.state.Data.owner.id !==UserProfile.getInstance().clientObj.user.id &&
  //       PickerItems.push(<Picker.Item label={strings.evalute} value={4} />);
  //   }
  //   // PickerItems.push(<Picker.Item label={strings.evalute} value={4} />);
  //   // }

  //   return (
  //     <View style={{position: 'absolute', width: wp('10%'), height: hp('3%')}}>
  //       <Picker
  //         selectedValue={this.state.EditOrRemove}
  //         style={{backgroundColor: 'transparent', flex: 0}}
  //         mode={'dialog'}
  //         onValueChange={(itemValue, itemIndex) => {
  //           if (itemValue == 1) this.AddBTN();
  //           else if (itemValue == 2) this.EditBTN();
  //           else if (itemValue == 3) this.RemoveBTN();
  //           else if (itemValue == 4) this.setState({ShowReview: true});
  //         }}>
  //         {PickerItems}
  //       </Picker>
  //     </View>
  //   );
  // }

  EditOrRemovePicker() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    console.log({
      userRole,
      Data: this.state.Data,
      user: UserProfile.getInstance().clientObj.user,
    });
    var PickerItems = [];

    if (userRole === 'Halls Provider') {
      PickerItems.push({name: strings.add, id: 1});
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
      //  if(this.state.Data.owner.id ===UserProfile.getInstance().clientObj.user.id){
      //   PickerItems.push({name: strings.repeat, id: 5})
      // }
      if (
        this.state.Data.owner.id !== UserProfile.getInstance().clientObj.user.id
      ) {
        PickerItems.push({name: strings.evalute, id: 4});
      }
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: wp('20%'),
          height: hp('4%'),
          right: 6,
        }}>
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
            }}
          />
        ) : null}
      </View>
    );
  }

  AddReserveBTN() {
    if (!UserProfile.getInstance().IsHallProvider())
      this.setState({ShowAddToCartView: true});
    else {
      alert(strings.featuresNotAllowed);
    }
  }

  BookNow() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];

    return userRole === 'Center' || userRole === 'Trainer'|| userRole=='Company' ? (
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
          style={styles.LoginBTNStyle}
          onPress={() => this.AddReserveBTN()}>
          <Text style={{color: 'white'}}>{strings.addReservationtoCart}</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  }

  render() {
    if (this.state.loading)
      return (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );

    let Data = this.state.Data;
    try {
      console.log('xxxxxxxxxxxxxxxxx', JSON.stringify(Data));
    } catch (e) {
      console.log('Error:' + e);
    }
    // return(<View/>)

    const {ShowAddToCartView} = this.state;

    return (
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{backgroundColor: '#F8F9F9'}}>
            <Image
              style={{position: 'absolute', top: hp('65%'), right: 0}}
              source={require('../../res/backgroundlogo.png')}
            />
            <ImageBackground
              imageStyle={{resizeMode: 'contain'}}
              style={{width: wp('100%')}}>
              {this.Header(Data)}
              {this.Photos(Data.images, Data.main_image)}
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
              {this.Item(
                'location-on',
                strings.trainingCentersFollow,
                Data.center ? Data.center.title : strings.none,
                '90%',
              )}
              {this.Item(
                'mic',
                strings.capcityfor,
                Data.individuals_count + strings.person,
                '90%',
              )}
              <TouchableOpacity
                onPress={() => this.OpenMap(Data.latitude, Data.longitude)}>
                <Image
                  style={{
                    resizeMode: 'contain',
                    width: wp('90'),
                    height: hp('14%'),
                    marginBottom: hp('2%'),
                    alignSelf: 'center',
                  }}
                  source={require('../../res/map.png')}
                />
              </TouchableOpacity>
              {this.DescTxt(strings.hallFeatures, Data.features, Data.details)}
              {this.CheckList(strings.hallDetails, Data)}
              {this.PhotosAndVidsScroll(Data.images)}
              <View style={{height: hp('10%')}} />
              {/*
                  <Text style={{marginBottom:hp('1.5%'),fontSize:hp('3%'),color:'#25252A'}}>   قوانين القاعة </Text>
                  {this.Item('smoke-free','    التدخين : ممنوع','','90%','black',35)}
                  {this.Item('child-care','    الأطفال : ممنوع','','90%','black',35)}

                  <Text style={{marginBottom:hp('1.5%'),fontSize:hp('3%'),color:'#25252A'}}>   مميزات القاعة </Text>
                    <View style={{height:hp('10%'),alignSelf:'center',width:wp('90%'),flexDirection:'row'}}>
                      {this.FeatureItem('local-cafe','كافتريا')}
                      {this.FeatureItemImg(require('../../res/air-direction.png'),'مكيف')}
                      {this.FeatureItem('wifi','شبكة إنترنت')}
                    </View>
                    <View style={{height:hp('10%'),alignSelf:'center',width:wp('90%'),flexDirection:'row'}}>
                      {this.FeatureItem('dashboard','سبورة سوداء')}
                      {this.FeatureItemImg(require('../../res/projector.png'),'شاشة عرض')}
                    </View>
                  */}
            </ImageBackground>
          </View>
        </ScrollView>
        {this.BookNow()}
        <PickDates
          Show={this.state.ShowAddToCartView}
          HidePickDates={this.HidePickDates}
          BookHall={this.BookHall}
          hallCalendar={this.state.hallCalendar}
          APILoading={this.state.APILoading}
        />
        <AddReview
          APILink={
            'http://www.ertaqee.com/api/v1/halls/' +
            this.state.Data.id +
            '/review'
          }
          Show={this.state.ShowReview}
          HideReview={this.HideReview}
        />
      </SafeAreaView>
    );
  }
}

export default HallDetails;
const styles = StyleSheet.create({
  LoginBTNStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: wp('80%'),
    height: hp('6%'),
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
    // borderRadius: hp('2%'),
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
    backgroundColor: '#F9F9F9',
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
    width: wp('100%'),
    height: hp('30%'),
    alignItems: 'center',
  },
  BackArrow: {
    tintColor: 'black',
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
});
