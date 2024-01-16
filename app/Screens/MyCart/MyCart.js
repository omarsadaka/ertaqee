import React, { Component } from 'react';
import {
  Alert,
  Image,
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
import { LoadingScreen, NewCoursesScroll, ReloadScreen } from '../common';
import NewCoursesItem from '../common/Items/NewCoursesItem';
import strings from '../strings';

class MyCart extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.RemoveThis = this.RemoveThis.bind(this);
    this.state = {
      Data: '',
      loading: true,
      ShowReloadBTN: false,
      IsEmpty: false,
    };
  }

  ShowReloadBTN() {
    alert(strings.somthingWentWrong);
    this.setState({ShowReloadBTN: true, loading: false});
  }

  RemoveThis(ItemObj) {
    try {
      fetch(
        `https://www.demo.ertaqee.com/api/v1/delete_from_basket?cart_item_index=${
          ItemObj.CartIndex
        }&token=${UserProfile.getInstance().clientObj.token}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer ' + UserProfile.getInstance().clientObj.token,
          },
        },
      ).then(response => {
        console.log(response);
        response
          .json()
          .then(responseJson => {
            console.log('responseJson:' + JSON.stringify(responseJson));
            this.GetData();
          })
          .catch(error => {
            console.log(error.response);
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

  ReloadBTN() {
    console.log('ReloadBTN');
    this.GetData();
  }

  componentDidMount() {
    this.GetData();
  }

  GetData() {
    this.setState({ShowReloadBTN: false, loading: true, Data: ''});
    let formData = new FormData();
    formData.append('token', UserProfile.getInstance().clientObj.token);
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/basket?token=' +
          UserProfile.getInstance().clientObj.token,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer ' + UserProfile.getInstance().clientObj.token,
          },
          // body: formData,
        },
      ).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('basket', responseJson);
            if (responseJson.success) {
              if (this.IsCartEmpty(responseJson.data.cart_items)) {
                Alert.alert(
                  strings.alert,
                  responseJson.message
                    ? strings.cart_retrieved
                    : strings.cartEmpty,
                  [
                    {
                      text: strings.cancel,
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: strings.ok,
                      onPress: () => console.log('OK Pressed'),
                    },
                  ],
                );
              }

              this.setState({
                loading: false,
                Data: responseJson.data,
                IsEmpty: this.IsCartEmpty(responseJson.data.cart_items),
              });
            } else {
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
      console.log('FourthErr:' + false);
      this.setState({loading: true});
      alert(strings.entervaliddata);
    }
  }

  MyItems(Items) {
    try {
      if (Items.length) console.log(Items.length);
    } catch {
      return;
    }
    let MyItems = [];
    for (let i = 0; i < Items.length; i++) {
      let CartItem = Items[i];
      console.log('CartItem.cart_item_index:' + CartItem.cart_item_index);
      let CurrentItem = '';
      CurrentItem = {
        itemID: CartItem.model.id,
        item: CartItem,
        title: CartItem.model.title,
        course_field: {title_ar: ' '},
        cost: CartItem.model.cost,
        image:
          CartItem.model_type === 'Course'
            ? CartItem.model.image
            : CartItem.model.main_image,
        quantity: CartItem.quantity,
      };
      MyItems.push(
        <NewCoursesItem
          key={i}
          item={CurrentItem}
          IsVer={true}
          CartItem={true}
          RemoveThis={this.RemoveThis}
          RemoveObj={{Key: i, CartIndex: CartItem.cart_item_index}}
          navigation={this.props.navigation}
        />,
      );
    }
    return MyItems;
  }

  Items(DataItems) {
    return (
      <View
        style={{
          marginTop: hp('1%'),
          alignSelf: 'center',
          width: wp('100%'),
          height: hp('46%'),
        }}>
        <NewCoursesScroll
          Title={strings.cart}
          Height={'43%'}
          SubTitle={' '}
          Items={this.MyItems(DataItems)}
          ViewAll={false}
          IsVer={true}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  ActionBTN() {
    console.log('ActionBTN');
  }

  /**/
  PayBTN(Data) {
    console.log('dataaa', Data.cart_totals);
    if (!this.IsCartEmpty(Data.cart_items))
      this.props.navigation.navigate('Payment', {
        CartId: Data.cart_id,
        Amount: Data.cart_totals.total,
      });
    else alert(strings.cartEmpty);
  }

  IsCartEmpty(CartItems) {
    try {
      if (CartItems.length > 0) return false;
      else return true;
    } catch {
      return true;
    }
  }

  render() {
    const {loading, ShowReloadBTN, Data, IsEmpty} = this.state;
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    if (loading)
      return (
        <View style={{flex: 1}}>
          <LoadingScreen Show={true} />
        </View>
      );

    if (ShowReloadBTN)
      return (
        <View style={{flex: 1}}>
          <ReloadScreen ShowReloadBTN={true} ReloadBTN={this.ReloadBTN} />
        </View>
      );
    return (
      <View style={{alignItems: 'center', flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
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
                  onPress={() => this.props.navigation.goBack()}>
                  <Icon
                    name={IsAr ? 'arrow-forward' : 'arrow-back'}
                    size={30}
                    color={'white'}
                  />
                </TouchableOpacity>
                <Text style={styles.MiddleTxt}>{strings.cart}</Text>
              </View>
            </View>
          </ImageBackground>
          {this.Items(Data.cart_items)}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              width: wp('90%'),
              height: hp('17%'),
              borderRadius: 8,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: wp('80%'),
                height: hp('12%'),
              }}>
              <View
                style={{
                  width: wp('80%'),
                  // height: hp('2.5%'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'black',
                    fontFamily: fonts.normal,
                  }}>
                  {strings.cost}
                </Text>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'grey',
                    fontFamily: fonts.normal,
                  }}>
                  {!IsEmpty && Data.cart_totals.subtotal}
                  {strings.SAR}
                </Text>
              </View>
              <View
                style={{
                  width: wp('80%'),
                  // height: hp('2.5%'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'black',
                    fontFamily: fonts.normal,
                  }}>
                  {strings.discountpercentage}
                </Text>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'grey',
                    fontFamily: fonts.normal,
                  }}>
                  {!IsEmpty &&
                    Data.cart_totals.total - Data.cart_totals.subtotal}
                </Text>
              </View>
              <View
                style={{
                  width: wp('80%'),
                  // height: hp('2.5%'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'black',
                    fontFamily: fonts.normal,
                  }}>
                  {strings.valueAdded}
                </Text>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'grey',
                    fontFamily: fonts.normal,
                  }}>
                  {!IsEmpty && Data.cart_totals.vat}
                </Text>
              </View>
              {/* <View
              style={{
                width: wp('80%'),
                height: hp('2.5%'),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: hp('2%'), color: 'black'}}>
                {strings.totalSum}
              </Text>
              <Text style={{fontSize: hp('2%'), color: 'grey'}}>
                {!IsEmpty && Data.cart_totals.total}
              </Text>
            </View> */}
            </View>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              backgroundColor: 'white',
              width: wp('100%'),
              height: hp('9%'),
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: hp('9%'),
              }}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  color: 'silver',
                  fontFamily: fonts.normal,
                }}>
                {strings.totalSum}
              </Text>
              <Text
                style={{
                  fontSize: hp('2.4%'),
                  fontWeight: 'bold',
                  color: '#4D75B8',
                  fontFamily: fonts.normal,
                }}>
                {!IsEmpty && Data.cart_totals.total}
                {strings.SAR}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: wp('50%'),
                height: hp('9%'),
                marginHorizontal: wp('3%'),
              }}>
              <TouchableOpacity
                style={styles.LoginBTNStyle}
                onPress={() => this.PayBTN(Data)}>
                <Text style={styles.NextTxt}>{strings.pay}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default MyCart;
const styles = StyleSheet.create({
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-7%'),
    bottom: hp('1%'),
    resizeMode: 'contain',
    width: wp('65%'),
    height: hp('25%'),
  },
  LoginBTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('50%'),
    height: hp('5%'),
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
  NextTxt: {fontSize: hp('2%'), color: 'white', fontFamily: fonts.normal},
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
