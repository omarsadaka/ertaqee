import React, { Component } from 'react';
import {
  Alert,
  ImageBackground,
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
import UserProfile from '../../../UserProfile';
import strings from '../../strings';

class TrainingCentersScrollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: this.props.item,
    };
  }

  componentWillMount() {
    try {
      this.setState({Data: this.props.item});
    } catch (e) {}
  }

  AddToFav() {
    let Data = this.state.Data;
    Data.is_favorited = !Data.is_favorited;
    this.setState({Data: Data});
    let FavUrl =
      'https://www.demo.ertaqee.com/api/v1/halls/' +
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

  Share(Title) {
    const shareOptions = {
      title: 'مشاركة',
      message: 'قاعة ' + Title + ' مقدمة من تطبيق ارتقي',
      url: 'http://play.google.com/store/apps/details?id=com.fudex.ertaqee',
    };
    Share.open(shareOptions);
  }

  share = async Title => {
    const options = {
      message: `مشاركة ${`\n\n`} قاعة ${Title} مقدمة من تطبيق ارتقي ${`\n\n`} ${'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'}`,
    };
    const response = await Share.share(options);
  };

  StarsNoList = StarsNo => {
    let MyStarsNoList = [];
    for (let i = 0; i < StarsNo; i++)
      MyStarsNoList.push(
        <Icon key={i} name="star" size={17} color={'white'} />,
      );
    return MyStarsNoList;
  };

  Stars(StarsNo) {
    return (
      <View
        style={{
          marginTop: hp('0.75%'),
          marginLeft: wp('1%'),
          flexDirection: 'row',
          width: wp('25%'),
          height: hp('4%'),
        }}>
        {this.StarsNoList(StarsNo)}
      </View>
    );
  }

  render() {
    let Data = this.props.item;
    console.log("🚀 ~ file: TrainingCentersScrollItem.js:107 ~ TrainingCentersScrollItem ~ render ~ Data:", Data,Data.photo)
    let HallOrCenter = this.props.HallOrCenter;
    let userType = UserProfile.getInstance().clientObj.user.role[0];
    console.log('asd', userType);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate(
            HallOrCenter ? 'HallDetails' : 'CenterDetails',
            {ItemID: Data.id},
          );
        }}
        key={Data.id}
        style={{
          backgroundColor: 'white',
          margin: wp('2%'),
          // width: wp('90%'),
          height: hp('23%'),
          borderRadius: wp('3%'),
          overflow: 'hidden',
          marginHorizontal:wp('4%'),

        }}>
        <ImageBackground
          imageStyle={{borderRadius: wp('3%')}}
          resizeMode="contain"
          style={{flexDirection: 'row', width: wp('90%'), height: hp('23%')}}
          source={{uri: HallOrCenter ? Data.main_image : Data.photo}}>
          <View
            style={{
              position: 'absolute',
              width: wp('100%'),
              height: hp('23%'),
              backgroundColor: 'black',
              opacity: 0.2,
            }}
          />
          <View>
            <View
              style={{
                marginTop: hp('5%'),
                width: wp('68%'),
                height: hp('4.5%'),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontSize: wp('5%'),
                  marginLeft: wp('2%'),
                }}>
                {Data && HallOrCenter ? Data.title : Data.full_name}
              </Text>
              {this.Stars(5)}
            </View>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: wp('4%'),
                marginLeft: wp('2%'),
              }}>
              {Data && HallOrCenter
                ? Data.center && Data.center.center_trade_name
                : Data.center_trade_name}
            </Text>
            {/* omar edit */}

            {Data.individuals_count ? (
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: wp('2%'),
                }}>
                <Icon
                  name={'users'}
                  type={'feather'}
                  color={'white'}
                  style={styles.BackArrow}
                />
                <Text
                  style={{
                    textAlign: 'left',
                    color: 'white',
                    fontSize: wp('4%'),
                    marginLeft: wp('2%'),
                  }}>
                  {Data.individuals_count}
                </Text>
              </View>
            ) : null}

            {/* <Text style={{textAlign:'left',color:'white',fontSize:wp('4%'),marginLeft:wp('2%')}}>
                    {strings.hallNumber}{':'} {Data.hall_number}
                  </Text> */}

            {Data.cost ? (
              <Text
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontSize: wp('4.5%'),
                  marginLeft: wp('2%'),
                }}>
                {Data.cost} {strings.SAR}
              </Text>
            ) : null}
          </View>
          
          <View>
            <View
              style={{
                alignItems: 'center',
                width: wp('20%'),
                height: hp('23%'),
              }}>
              {HallOrCenter && (
                <View
                  style={{
                    justifyContent: 'space-between',
                    marginTop: hp('18%'),
                    flexDirection: 'row',
                    width: wp('16%'),
                    // height: hp('4%'),
                    paddingHorizontal: wp('1%'),
                  }}>
                  {userType == 'Halls Provider'|| userType == 'Center' ? null : (   // userType == 'Halls Provider'
                    <TouchableOpacity onPress={() => this.AddToFav()}>
                      <Icon
                        name={
                          Data && Data.is_favorited
                            ? 'bookmark'
                            : 'bookmark-border'
                        }
                        color={Data && Data.is_favorited ? 'gold' : 'white'}
                        style={styles.BackArrow}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => this.share(Data.title)}>
                    <Icon
                      name={'share'}
                      color={'white'}
                      style={styles.BackArrow}
                    />
                  </TouchableOpacity>
                </View>
               )} 
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export default TrainingCentersScrollItem;

const styles = StyleSheet.create({
  BackArrow: {
    tintColor: 'white',
    resizeMode: 'contain',
    width: wp('5%'),
    height: hp('3.5%'),
  },
  spcifiybtn: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
    backgroundColor: '#4D75B8',
    width: wp('52%'),
    height: hp('5.5%'),
  },
});
