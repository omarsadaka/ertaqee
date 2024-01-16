import React, { Component } from 'react';
import {
  Alert,
  Image,
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
// import Share from "react-native-share";
import UserProfile from '../../../UserProfile';
import fonts from '../../../fonts';
import strings from '../../strings';

class NewCoursesItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
    };
  }

  componentWillMount() {
    // alert(UserProfile.getInstance().clientObj.user.role[0])
    try {
      this.setState({Data: this.props.item});
    } catch (e) {}
  }

  AddToFav() {
    let Data = this.state.Data;
    Data.is_favorited = !Data.is_favorited;
    this.setState({Data: Data});
    let FavUrl =
      'https://www.demo.ertaqee.com/api/v1/courses/' +
      Data.id +
      '/favorite?user_id=' +
      UserProfile.getInstance().clientObj.user.id;
    console.log('FavUrl:' + FavUrl);
    try {
      fetch(FavUrl, {
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

  Share(Title, IMG) {
    console.log('IMG:' + IMG);
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

  CallThis(ID) {
    if (this.props.HideRemove) this.props.ShowThisItemDetails(ID);
  }

  render() {
    const {Data} = this.state;
    let userType = UserProfile.getInstance().clientObj.user.role[0];
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.CartItem) {
            this.CallThis(Data.id);
          } else {
            if (!this.props.IsFav || this.props.item) {
              this.props.navigation.navigate('CourseDetails', {
                CourseID: this.props.item.id,
                IsFav: Data.is_favorited,
              });
            }
          }
          //    Data&&this.props.CartItem?this.CallThis(Data.id): this.props.navigation.navigate('CourseDetails',{
          //   CourseID:Data.id,
          //   IsFav: Data.is_favorited
          // })
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          margin: wp('2%'),
          width: wp('90%'),
          height: hp(!this.props.CartItem ? '29%' : '24%'),
          borderRadius: 8,
          elevation: 2,
        }}>
        {this.props.ShowOverLay && (
          <View
            style={{
              position: 'absolute',
              width: wp('90%'),
              height: hp('23%'),
              backgroundColor: 'black',
              opacity: 0.075,
            }}
          />
        )}

        <View style={{width: wp('62%'), height: hp('20%')}}>
          <Text
            style={{
              textAlign: 'left',
              color: 'silver',
              fontSize: wp('4%'),
              marginTop: hp('3%'),
              marginLeft: wp('2%'),
              fontFamily: fonts.normal,
            }}>
            {Data && Data.title}{' '}
          </Text>
          {Data && Data.quantity ? (
            <Text
              style={{
                textAlign: 'left',
                color: 'silver',
                fontSize: wp('4%'),
                marginTop: hp('1%'),
                marginLeft: wp('2%'),
                fontFamily: fonts.normal,
              }}>
              {strings.student_num} {Data.quantity}{' '}
            </Text>
          ) : null}
          {/* <Text style={{textAlign:'left',color:'black',fontSize:wp('4.5%'),marginLeft:wp('2%'),fontFamily: fonts.normal}}>{Data&&Data.student_number? strings.student_num +' '+ Data.student_number:''} </Text> */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                textAlign: 'left',
                color: '#4D75B8',
                // width: wp('20%'),
                fontSize: wp('4%'),
                marginHorizontal: wp('2%'),
                fontFamily: fonts.normal,
              }}>
              {Data && Data.cost}
              {strings.SAR}{' '}
            </Text>
            {this.props.HideRemove ? (
              <View />
            ) : this.props.CartItem ? (
              <View style={{width: '100%'}}>
                <View
                  style={{
                    width: wp('35%'),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(strings.app, strings.confirm_delete, [
                        {
                          text: strings.cancel,
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: strings.ok,
                          onPress: () =>
                            this.props.RemoveThis(this.props.RemoveObj),
                        },
                      ]);
                    }}>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: wp('4%'),
                        fontFamily: fonts.normal,
                      }}>
                      {strings.remove}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('EditCart', {
                        Item: Data.item,
                        includes_me: Data.item.includes_me,
                      });
                    }}>
                    <Text
                      style={{
                        color: 'blue',
                        fontSize: wp('4%'),
                        fontFamily: fonts.normal,
                      }}>
                      {strings.edit}
                    </Text>
                  </TouchableOpacity>
                </View>
                {Data && Data.item.old_total > 0 ? (
                  <View
                    style={{
                      width: wp('50%'),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '1%',
                    }}>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: '#4D75B8',
                        fontSize: wp('4%'),
                        textDecorationLine: 'line-through',
                        fontFamily: fonts.normal,
                      }}>
                      {Data && Data.item.old_total} {strings.SAR}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: '#4D75B8',
                        fontSize: wp('4%'),
                        fontFamily: fonts.normal,
                      }}>
                      {Data.item.quantity * Data.item.model.offer_cost}{' '}
                      {strings.SAR}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <Text
                style={{
                  color: '#4D75B8',
                  fontSize: wp('4%'),
                  fontFamily: fonts.normal,
                }}>
                {' '}
                {Data && Data.start_date}{' '}
              </Text>
            )}
          </View>

          {Data.number_of_attendees >= 0 ? (
            <Text
              style={{
                color: '#4D75B8',
                fontSize: wp('4%'),
                marginBottom: 5,
                fontFamily: fonts.normal,
              }}>
              {' '}
              {strings.number_of_attendees} {Data && Data.number_of_attendees}{' '}
            </Text>
          ) : null}

          {(userType == 'User' || userType == 'Company' )&& Data.is_availabel? (
            <View>
              {!this.props.CartItem && !this.props.IsFav && (
                <View
                  style={
                    this.props.OutlineBTN
                      ? styles.spcifiybtnOutLine
                      : styles.spcifiybtn
                  }>
                  <Text
                    style={{
                      color: this.props.OutlineBTN ? '#4D75B8' : 'white',
                      fontSize: wp('4%'),
                      fontFamily: fonts.normal,
                    }}>
                    {this.props.COA ? this.props.COA : strings.bookingNow}
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </View>

        <View
          style={{alignItems: 'center', width: wp('28%'), height: hp('23%')}}>
          {Data && Data.image != null ? (
            <Image
              style={{
                resizeMode: 'contain',
                width: wp('23%'),
                marginTop: hp('1%'),
                height: hp('11%'),
              }}
              source={{uri: Data.image}}
            />
          ) : (
            <Image
              style={{
                resizeMode: 'contain',
                width: wp('23%'),
                height: hp('13%'),
              }}
              source={{uri: Data.image ? Data.image : Data.main_image}}
            />
          )}

          {!this.props.CartItem && (
            <View
              style={{
                justifyContent: 'space-between',
                marginTop: hp('4%'),
                flexDirection: 'row',
                width: wp('15%'),
                height: hp('4%'),
              }}>
              {/* omar edit */}
              {this.props.IsFav ? (
                <TouchableOpacity onPress={() => this.AddToFav()}>
                  {
                    <Icon
                      name={
                        Data && Data.is_favorited
                          ? 'bookmark'
                          : 'bookmark-border'
                      }
                      color={Data && Data.is_favorited ? 'gold' : 'black'}
                      style={styles.BackArrow}
                    />
                  }
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() =>
                  this.share(
                    Data.title,
                    Data.image ? Data.image : Data.main_image,
                  )
                }>
                <Icon name={'share'} color={'black'} style={styles.BackArrow} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export default NewCoursesItem;

const styles = StyleSheet.create({
  BackArrow: {
    margin: wp('1%'),
    tintColor: 'black',
    width: wp('7%'),
    height: hp('3.5%'),
  },
  BackArrow1: {
    tintColor: 'black',
    resizeMode: 'contain',
    width: wp('5%'),
    height: hp('3.5%'),
  },
  spcifiybtn: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0%'),
    backgroundColor: '#4D75B8',
    width: wp('52%'),
    height: hp('5.5%'),
  },
  spcifiybtnOutLine: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.5%'),
    borderColor: '#4D75B8',
    backgroundColor: 'transparent',
    width: wp('52%'),
    height: hp('5.5%'),
  },
});
