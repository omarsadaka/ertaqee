import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import { FavList } from '../../components/favourite';
import { MyResrvsScroll } from '../common';
import strings from '../strings';
class MyResvs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      ShowItemDetails: false,
      CurrentItemObj: {},
    };
  }

  componentDidMount() {
    this.getHallOrders();
  }
  ShowReloadBTN() {
    alert(strings.somthingWentWrong);
    this.setState({ShowReloadBTN: true, loading: false});
  }

  ReloadBTN() {
    console.log('ReloadBTN');
    this.GetData();
  }

  async getHallOrders() {
    console.log(UserProfile.getInstance().clientObj.token);
    await fetch(
      `https://www.demo.ertaqee.com/api/v1/profile/my_halls_orders` +
        '?token=' +
        UserProfile.getInstance().clientObj.token,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(parsedRes => {
        console.log('hallOrders', parsedRes.data);
        var arr = parsedRes?.data?.orders;
        const data = [];
        for (let index = 0; index < arr?.length; index++) {
          const obj = {
            id: arr[index].model.id,
            title: arr[index].model.title,
            quantity: arr[index].quantity,
            // course_field: arr[index].course_field?.title,
            cost: arr[index].model.cost,
            // number_of_attendees: arr[index].number_of_attendees,
            image: arr[index].model.image
              ? arr[index].model.image
              : arr[index].model.main_image,
            is_favorited: arr[index].model.is_favorited,
          };
          data.push(obj);
        }
        this.setState({orders: data});
      })
      .catch(err => {
        console.log('getHallOrders err', err);
      });
  }

  Items() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    console.log("🚀 ~ file: MyResvs.js:82 ~ MyResvs ~ Items ~ userRole:", userRole)
    return (
      <View
        style={{
          marginTop: hp('1%'),
          alignSelf: 'center',
          width: wp('100%'),
          flex:1,
        }}>
        {userRole === 'Halls Provider' ? (
          <View style={{alignSelf: 'center', width: wp('100%')}}>
            <FavList
              loadData={() => this.getHallOrders()}
              onPress={item => {
                this.setState({CurrentItemObj: item, ShowItemDetails: true});
              }}
              items={this.state.orders}
            />
          </View>
        ) : (
          <View
            style={{alignSelf: 'center', width: wp('100%'), }}>
            <MyResrvsScroll
              API={'https://www.demo.ertaqee.com/api/v1/profile/reservations'}
              navigation={this.props.navigation}
            />
          </View>
        )}
      </View>
    );
  }

  BillItem(Name, Value) {
    return (
      <View style={[styles.BillBTNStyle, {flexDirection: 'row'}]}>
        <View
          style={[
            styles.BillBTNStyle,
            {marginTop: 0, backgroundColor: '#f0f0f0', width: wp('42.5%')},
          ]}>
          <Text style={{textAlign: 'left', fontSize: wp('4%')}}> {Name} </Text>
        </View>
        <View
          style={[
            styles.BillBTNStyle,
            {marginTop: 0, backgroundColor: '#e3e3e3', width: wp('42.5%')},
          ]}>
          <Text style={{textAlign: 'left', fontSize: wp('4%')}}> {Value} </Text>
        </View>
      </View>
    );
  }
  ItemDetailsWindow(Item) {
    // const { model } = Item;
    return (
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          width: wp('100%'),
          height: hp('100%'),
        }}>
        <View
          style={{
            position: 'absolute',
            width: wp('100%'),
            marginTop: hp('-20%'),
            height: hp('100%'),
            backgroundColor: 'black',
            opacity: 0.5,
          }}
        />
        <View
          style={{
            backgroundColor: 'white',
            width: wp('90%'),
            marginTop: hp('-20%'),
            height: hp('90%'),
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: wp('5%'),
              marginTop: hp('5%'),
            }}>
            {' '}
            {strings.reservation} {strings.details}{' '}
          </Text>
          <Image
            style={{
              resizeMode: 'contain',
              width: wp('90%'),
              marginTop: hp('2%'),
              height: hp('20%'),
            }}
            source={{uri: Item.image}}
          />
          {this.BillItem(strings.name, Item.title)}
          {this.BillItem(strings.cost, Item.cost)}
          {this.BillItem(strings.type, Item.model_type)}
          {this.BillItem(strings.quantity, Item.quantity)}
          {/* {this.BillItem(strings.date, Item.created_at.substring(0, 10))} */}
          {this.BillItem(
            strings.includes,
            Item.order_includes_me ? strings.yes : strings.no,
          )}
          {this.BillItem(
            strings.fav,
            Item.is_favorited ? strings.yes : strings.no,
          )}
          <TouchableOpacity
            onPress={() => this.setState({ShowItemDetails: false})}
            style={[
              styles.BillBTNStyle,
              {
                justifyContent: 'center',
                height: hp('6%'),
                backgroundColor: '#598ABB',
              },
            ]}>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: wp('5%'),
                color: 'white',
              }}>
              {' '}
              {strings.back}{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{alignItems: 'center', width: wp('100%'), height: hp('100%'),}}>
        <Image
          style={styles.BackGroundLogo}
          source={require('../../res/backgroundlogo.png')}
        />
        {this.Items()}
        {this.state.ShowItemDetails &&
          this.ItemDetailsWindow(this.state.CurrentItemObj)}
      </View>
    );
  }
}

export { MyResvs };
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
  MiddleTxt: {color: 'white', fontSize: wp('5%'), marginLeft: wp('35%')},
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

  cancelTxt: {color: 'white', fontWeight: 'bold', fontSize: wp('5%')},
  AttachedArea: {
    margin: wp('2%'),
    marginTop: hp('-1%'),
    width: wp('90%'),
    backgroundColor: 'white',
    height: hp('5%'),
  },
  cancelBTN: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('4%'),
    marginTop: hp('-0.75%'),
    width: wp('60%'),
    height: hp('5%'),
  },
  BillBTNStyle: {
    justifyContent: 'center',
    marginTop: hp('2%'),
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    width: wp('85%'),
    height: hp('5%'),
  },
  contentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promotionsbox: {
    marginTop: hp('1'),
    width: wp('100%'),
  },
  promotionsboxHor: {
    marginTop: hp('1'),
    height: hp('30%'),
    width: wp('97.5%'),
    alignSelf: 'flex-end',
  },
});
