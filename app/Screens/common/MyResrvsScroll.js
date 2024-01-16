import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import strings from '../strings';
import NewCoursesItem from './Items/NewCoursesItem';
import fonts from '../../fonts';
import { AirbnbRating } from 'react-native-ratings';

const ScreenHeight = Dimensions.get('window').height;

class MyResrvsScroll extends Component {
  constructor(props) {
    super(props);
    this.ShowThisItemDetails = this.ShowThisItemDetails.bind(this);
    this.state = {
      page: 1,
      data: [],
      isRefreshing: false,
      CurrentItemObj: null,
      ShowItemDetails: false,
      ShowRateDetails: false,
      message: null,
      rate: 0,
      loading: false
    };
  }

  componentDidMount() {
    if (this.props.API) this.loaddata();
  }

  loaddata = () => {
    console.log(
      'UserProfile.getInstance().clientObj.token:' +
        UserProfile.getInstance().clientObj.token,
    );
    const {data, page} = this.state;
    console.log('this.props.API:' + this.props.API);
    let PaginiationMark = '?';
    let APILink =
      this.props.API +
      PaginiationMark +
      'page=' +
      this.state.page +
      '&token=' +
      UserProfile.getInstance().clientObj.token;
    console.log('APILink:' + APILink);
    fetch(APILink, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token
      },
    })
      .then(res => res.json())
      .then(res => {
        console.log(
          '🚀 ~ file: MyResrvsScroll.js:63 ~ MyResrvsScroll ~ res:',
          res,
        );
        if (res?.data?.reservations?.length) {
          const arr = [];
          res.data.reservations.forEach(element => {
            if (element.order.status != 'decline') {
              arr.push(element);
            }
          });
          this.setState({
            data: page === 1 ? arr : [...data, ...arr],
            isRefreshing: false,
          });
        }
      })
      .catch(err => {
        console.log(
          '🚀 ~ file: MyResrvsScroll.js:78 ~ MyResrvsScroll ~ err:',
          err,
        );
      });
  };

  handleRefresh = () => {};

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.loaddata();
      },
    );
  };

  NavNewCourses() {
    console.log('NavNewCourses');
    return;
  }

  ShowThisItemDetails(ItemOrderID) {
    console.log('ItemOrderID:' + ItemOrderID);
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/profile/' +
          ItemOrderID +
          '/reservation_item_details' +
          '?token=' +
          UserProfile.getInstance().clientObj.token,
        {
          method: 'GET',
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
            console.log('responseJson:' + JSON.stringify(responseJson));
            this.setState({
              CurrentItemObj: responseJson.data,
              ShowItemDetails: true,
            });
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

  CancelBTN(orderitemID) {
    console.log(
      'https://www.demo.ertaqee.com/api/v1/reservation/cancel/' + orderitemID,
    );
    console.log('token',UserProfile.getInstance().clientObj.token)
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/reservation/cancel/' + orderitemID,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token
          },
        },
      ).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('responseJson: cancel' + JSON.stringify(responseJson));
            if (responseJson.success) {
              alert(strings.successProcess);
              this.setState({page: 1, data: []});
              this.loaddata();
            } else {
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

   ratingCompleted (rating) {
    console.log('Rating is: ' + rating);
    this.setState({rate: rating})
  };

  RateBTN(courseID,type) {
    console.log('omar item', type)
    console.log('token',UserProfile.getInstance().clientObj.token)
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    if(!this.state.rate&&!this.state.message){
      alert(strings.allFeildsRequeired)
      return
    }
    const MyFormData = new FormData();
    MyFormData.append('rating', this.state.rate);
    MyFormData.append('content',this.state.message);
    let api= `https://www.demo.ertaqee.com/api/v1/course/${courseID}/review`
    if(userRole=='Trainer' || userRole=='Center'|| userRole=='Company'){
      if(type=='App\\Models\\Hall') api = `https://www.demo.ertaqee.com/api/v1/halls/${courseID}/review`
      else api= `https://www.demo.ertaqee.com/api/v1/course/${courseID}/review`
    }
    this.setState({loading: true})
    try {
      fetch(
        api,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token
          },
          body: MyFormData
        },
      ).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('responseJson: rate' + JSON.stringify(responseJson));
            this.setState({loading: false})
            if (responseJson.success) {
              alert(strings.successProcess);
              this.setState({ShowRateDetails: false});
              this.loaddata();
            } else {
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
    }
  }
  LoadingTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text  style={{
      alignSelf: 'center',
      fontSize: wp('4%'),
      color: 'white',
      fontFamily: fonts.normal
    }}>{strings.send}</Text>;
  }

  NewCoursesItem(item, order, price) {
    let Model = item.model;
    let CurrentItem = {
      id: item.item_id,
      title: Model.title,
      course_field: ' ',
      cost: price,
      image: Model.model_type === 'Course' ? Model.image : Model.main_image,
      student_number: item.related_models.length,
      quantity: order.quantity,
    };
    let IsCanceled = order.status == 'canceled';
    return (
      <View style={styles.container}>
        <NewCoursesItem
          item={CurrentItem}
          IsVer={true}
          CartItem={true}
          HideRemove={true}
          ShowThisItemDetails={this.ShowThisItemDetails}
          navigation={this.props.navigation}
        />
        <View style={styles.AttachedArea}>
          <TouchableOpacity
            activeOpacity={IsCanceled ? 1 : 0}
            onPress={() => !IsCanceled && this.CancelBTN(order.id)}
            style={[
              styles.cancelBTN,
              {backgroundColor: IsCanceled ? 'silver' : '#6290C5'},
            ]}>
            <Text style={styles.cancelTxt}>
              {' '}
              {IsCanceled ? strings.canceled : strings.cancel}{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  NewItems(item) {
    console.log(
      '🚀 ~ file: MyResrvsScroll.js:220 ~ MyResrvsScroll ~ NewItems ~ item:',
      item.order.id,
    );
    let order_items = item.order_items;
    console.log(
      '🚀 ~ file: MyResrvsScroll.js:221 ~ MyResrvsScroll ~ NewItems ~ order_items:',
      order_items,
    );
    let ReturedItems = [];
    for (let i = 0; i < order_items.length; i++)
      ReturedItems.push(
        this.NewCoursesItem(
          order_items[i],
          item.order.items[i],
          item.order.subtotal,
        ),
      );

    return ReturedItems;
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
    const {order_item, model} = Item;
    console.log('order_item?.created_at', order_item);
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
            height: hp('91%'),
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
            source={{
              uri:
                model.model_type === 'Course' ? model.image : model.main_image,
            }}
          />
          {this.BillItem(strings.name, model.title)}
          {this.BillItem(strings.cost, model.cost)}
          {this.BillItem(strings.type, model.model_type)}
          {this.BillItem(strings.quantity, order_item.quantity)}
          {order_item?.created_at
            ? this.BillItem(
                strings.date,
                order_item.created_at.substring(0, 10),
              )
            : null}
          {this.BillItem(
            strings.includes,
            order_item.order_includes_me ? strings.yes : strings.no,
          )}
          {this.BillItem(
            strings.fav,
            order_item.is_favorited ? strings.yes : strings.no,
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
          <TouchableOpacity
            onPress={() => {
              this.setState({ShowItemDetails: false,ShowRateDetails: true })
            }}
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
              {strings.rate}{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  RateDetailsWindow(Item) {
    const {order_item} = Item;
    return (
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          alignSelf:'center',
          width: wp('90%'),
          height: hp('50%'),
          borderRadius:10,
          backgroundColor:'grey',
          justifyContent:'center'
        }}>
       <AirbnbRating
              type="custom"
              count={5}
              size={20}
              showRating={false}
              defaultRating={order_item.rate ? order_item.rate.rate : 0}
              tintColor={'white'}
              onFinishRating={()=> this.ratingCompleted()}
              selectedColor="#FF9F57"
              unSelectedColor="#B5B5B5"
              starImage={require('../../res/star.png')}
            />

       <Text style={styles.label}>{strings.message}</Text>
            <TextInput
              multiline
              onChangeText={text => this.setState({message: text})}
              placeholder={strings.message + ' *'}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount, {height: hp('20%')}]}
            />
            <View style={{width:'90%',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity
              style={styles.LoginBTNStyle}
              onPress={() => {this.RateBTN(order_item.cartable_id, order_item.cartable_type)}}>
              {this.LoadingTxt()}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.LoginBTNStyle}
              onPress={() => {this.setState({ShowRateDetails: false})}}>
              <Text  style={{
                alignSelf: 'center',
                fontSize: wp('4%'),
                color: 'white',
                fontFamily: fonts.normal
                }}>{strings.cancel}</Text>
            </TouchableOpacity>
            </View>
            
      </View>
    );
  }

  render() {
    const {data, isRefreshing, ShowItemDetails, CurrentItemObj, ShowRateDetails} = this.state;
    return (
      <View style={[styles.promotionsbox, {height: hp('90%')}]}>
        {this.props.API && data && (
          <FlatList
            style={[
              styles.promotionsbox,
              {alignSelf: 'center', width: wp('95%')},
            ]}
            contentContainerStyle={{paddingBottom: hp('20%')}}
            data={data}
            renderItem={({item}) => this.NewItems(item)}
            keyExtractor={i => i.id}
            refreshing={isRefreshing}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={()=>{
              return(
                <Text style={styles.noDataTxt}>
                {strings.noDataToShow}
              </Text>
              )
            }}
          />
        )}
        {ShowItemDetails && this.ItemDetailsWindow(CurrentItemObj)}
        {ShowRateDetails && this.RateDetailsWindow(CurrentItemObj)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cancelTxt: {color: 'white', fontWeight: 'bold', fontSize: wp('4%')},
  noDataTxt: {color: 'Black',fontFamily: fonts.normal , fontSize: wp('4%'), textAlign:'center'},
  AttachedArea: {
    margin: wp('1%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
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
  container: {
    height: hp('33%'),
    backgroundColor: '#FFF',
    elevation: 2,
    borderRadius: 8,
    marginVertical: 5,
  },
  label: {
    width:'93%',
    fontFamily: fonts.normal,
    fontSize: hp('1.8%'),
    marginBottom: -hp('1.6%'),
    textAlign: 'left',
    marginTop: hp('1.5%'),
    color: 'black',
  },
  InputStyleNewAccount: {
    width:'93%',
    backgroundColor: 'white',
    elevation: 2,
    shadowOpacity: 0.1,
    marginTop: hp('2%'),
    height: hp('7%'),
    fontSize: hp('1.8%'),
    color: '#39A1F7',
    paddingHorizontal: 8,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: fonts.normal,
  },
  LoginBTNStyle: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('37%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('0.7%'),
  },
});

export { MyResrvsScroll };

