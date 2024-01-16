import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';

import { Colors } from '../../theme';
import SectionContent from '../TOS/SectionContent';
import { AddReview, BestcoachesScroll, NewCoursesScroll } from '../common';
import NewCoursesItem from '../common/Items/NewCoursesItem';
import TrainingCentersScrollItem from '../common/Items/TrainingCentersScrollItem';
import strings from '../strings';

class CoachDetails extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.HideReview = this.HideReview.bind(this);
    this.state = {
      Data: '',
      loading: true,
      Reviews: [],
      ShowReview: false,
      status: null,
    };
  }

  componentDidMount() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    this.GetData();
    if (userRole != 'Guest') {
      this.checkStatus();
    }
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
      fetch('https://www.demo.ertaqee.com/api/v1/trainers/' + ParamsData.ItemID, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('responseJsonOmar:' + JSON.stringify(responseJson));
            if (responseJson.success) {
              this.setState({loading: false, Data: responseJson.data});
              this.GetReviewsData(responseJson.data.id);
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
      console.log('FourthErr:' + error);
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  checkStatus() {
    let ParamsData = this.props.route.params;
    console.log('ParamsData.ItemID:' + ParamsData.ItemID);
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/add_trainer_status/' +
          ParamsData.ItemID +
          '?token=' +
          UserProfile.getInstance().clientObj.token,
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
            console.log('checkStatus:' + JSON.stringify(responseJson));
            if (responseJson.success) {
              this.setState({status: responseJson.data.status});
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
      console.log('FourthErr:' + error);
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  async add_trainer_request() {
    let ParamsData = this.props.route.params;
    try {
      fetch(
        'https://www.demo.ertaqee.com/api/v1/add_trainer_request/' +
          ParamsData.ItemID +
          '?token=' +
          UserProfile.getInstance().clientObj.token,
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
            console.log('add_trainer_request:' + JSON.stringify(responseJson));
            if (responseJson.success) {
              if (responseJson.data.status == 1) {
                alert(strings.request_send);
                this.GetData();
              }
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
      console.log('FourthErr:' + error);
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  GetReviewsData(TrainersIID) {
    console.log('TrainersIID:' + TrainersIID);
    try {
      fetch(
        'http://www.ertaqee.com/api/v1/trainers/' + TrainersIID + '/reviews',
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
            if (responseJson.success)
              this.setState({Reviews: responseJson.data.reviews});
          })
          .catch(error => {
            console.log('Thirderr:' + error);
          });
      });
    } catch (error) {
      console.log('FourthErr:' + error);
    }
  }

  Header(Title) {
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
            width: wp('100%'),
            height: hp('10%'),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: wp('25%'),
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
              width: wp('50%'),
            }}>
            <Text
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: hp('2.5%'),
                color: 'white',
                fontFamily: fonts.normal,
              }}>
              {Title}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              width: wp('25%'),
            }}></View>
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

  Stars(StarsNo, NoOfReviews) {
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
        <Text style={{fontSize: hp('1.75%'), color: 'silver'}}>
          ({NoOfReviews}){' '}
        </Text>
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
          height: hp('4.5%'),
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

  CheckItem() {
    return (
      <View style={{width: wp('70%'), flexDirection: 'row'}}>
        <Icon name="check" size={30} color={'silver'} />
        <Text style={{fontSize: wp('4%'), color: 'grey'}}>
          {' '}
          لورم اوبسم هو النص الدمية القياسي
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
      </View>
    );
  }

  CertsItems = () => {
    let Items = [];
    for (let i = 0; i < 0; i++)
      Items.push(
        <BestcoachesItem
          key={i}
          Title={' '}
          SubTitle={' '}
          Img={require('../../res/cert.png')}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  Certs(Title) {
    return (
      <View
        style={{marginTop: hp('-2%'), width: wp('100%'), height: hp('25%')}}>
        <Text
          style={{
            alignSelf: 'flex-start',
            fontSize: wp('5%'),
            marginTop: hp('3%'),
          }}>
          {' '}
          {Title}
        </Text>
        <BestcoachesScroll
          Items={this.CertsItems()}
          Title={' '}
          ViewAll={' '}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  UserNameAndIMG(Data) {
    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: hp('2%'),
          flexDirection: 'row',
        }}>
        <Image
          style={{height: hp('25%'), width: wp('40%'), borderRadius: 15}}
          source={{uri: Data.photo}}
          resizeMode="contain"
        />
        <View style={{width: wp('2%')}} />
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp('2.5%'),
              color: '#4D75B8',
              fontWeight: 'bold',
            }}>
            {Data.full_name}
          </Text>
          {Data.job_title && (
            <Text
              style={{
                textAlign: 'center',
                fontSize: hp('1.5%'),
                color: 'silver',
              }}>
              {' '}
              {Data.job_title}
            </Text>
          )}
          <View
            style={{
              marginTop: 10,
              alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {Data.socials.snapchat ? (
              <IconFontAwesome5
                name="snapchat-square"
                color="gray"
                size={30}
                onPress={() => {
                  Linking.openURL(Data.socials.snapchat);
                }}
              />
            ) : null}
            <View style={{width: wp('2%')}} />
            {Data.socials.twitter ? (
              <IconFontAwesome5
                name="twitter-square"
                color="gray"
                size={30}
                onPress={() => {
                  Linking.openURL(Data.socials.twitter);
                }}
              />
            ) : null}
            <View style={{width: wp('2%')}} />

            {Data.socials.facebook ? (
              <IconFontAwesome
                name="facebook-square"
                color="gray"
                size={30}
                onPress={() => {
                  Linking.openURL(Data.socials.facebook);
                }}
              />
            ) : null}
            <View style={{width: wp('2%')}} />
            {Data.socials.instagram ? (
              <IconFontAwesome5
                name="instagram-square"
                color="gray"
                size={30}
                onPress={() => {
                  Linking.openURL(Data.socials.instagram);
                }}
              />
            ) : null}
            <View style={{width: wp('2%')}} />
            {Data.socials.youtube ? (
              <IconFontAwesome
                name="youtube-square"
                color="gray"
                size={30}
                onPress={() => {
                  Linking.openURL(Data.socials.youtube);
                }}
              />
            ) : null}
            <View style={{width: wp('2%')}} />
            {Data.socials.linkedin ? (
              <IconFontAwesome
                name="linkedin-square"
                color="gray"
                size={30}
                onPress={() => {
                  Linking.openURL(Data.socials.linkedin);
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  NewCoursesItems(Courses) {
    let Items = [];
    for (const element of Courses)
      Items.push(
        <NewCoursesItem
          item={element}
          IsVer={true}
          IsFav={false}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  }

  NewCourses(Courses) {
    if (Courses?.length < 1) {
      return (
        <View
          style={{
            height: hp('5%'),
            justifyContent: 'space-between',
            width: wp('90%'),
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: wp('6%'),
              fontWeight: 'bold',
              marginVertical: 5,
            }}>
            {strings.newCourses}
          </Text>
          <Text style={{fontSize: wp('3.5%'), textAlign: 'left'}}>
            {strings.none}
          </Text>
        </View>
      );
    }
    return (
      <View style={{marginTop: hp('1%'), width: wp('100%'), height: hp('30%')}}>
        <NewCoursesScroll
          Items={this.NewCoursesItems(Courses)}
          Title={strings.newCourses}
          SubTitle={' '}
          ViewAllNav={false}
          IsMiddleTitle={false}
          ShowFloatingBTN={false}
          ShowBottomMenu={true}
          IsVer={false}
          Filter={false}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  RateItem(Rate, Title, Body) {
    return (
      <View
        style={{marginTop: hp('2%'), alignSelf: 'center', width: wp('90%')}}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: wp('2%'),
              backgroundColor: '#8BD1EF',
              height: hp('5%'),
              width: wp('10%'),
            }}>
            <Text style={{fontSize: wp('4%'), color: 'white'}}>{Rate}</Text>
          </View>
          <Text style={{textAlign: 'left', fontSize: wp('4%'), color: 'black'}}>
            {' '}
            {Title}{' '}
          </Text>
        </View>
        <Text
          style={{textAlign: 'left', fontSize: wp('3.5%'), color: 'silver'}}>
          {' '}
          {Body}{' '}
        </Text>
      </View>
    );
  }

  renderEducationItem = (item, index) => {
    return (
      <View
        key={item.id + index}
        style={{
          flex: 1,
          alignSelf: 'stretch',
          alignItems: 'stretch',
          marginVertical: wp('2%'),
          marginHorizontal: wp('4%'),
        }}>
        {this.renderItem(strings.Enterprise, item.facility)}
        {this.renderItem(strings.Place, item.location)}
        {this.renderItem(strings.Degree, item.degree)}
        {this.renderItem(
          strings.from,
          `${item.from_month} - ${item.from_year}`,
        )}
        {this.renderItem(
          strings.to,
          `${item.to_month} - ${item.to_year}`,
          true,
        )}
      </View>
    );
  };

  renderItem = (key, value, isLast = false) => {
    return (
      <View
        key={key + value}
        style={{
          flex: 1,
          borderWidth: 2,
          borderBottomWidth: isLast ? 1 : 0,
          borderColor: 'gray',
          flexDirection: 'row',
        }}>
        <View style={{flex: 2}}>
          <Text style={styles.education}>{key}</Text>
        </View>
        <View style={{width: 2, backgroundColor: 'gray'}} />
        <View style={{flex: 3}}>
          <Text style={styles.education}>{value}</Text>
        </View>
      </View>
    );
  };

  renderLanguageItem = (item, index) => {
    return (
      <View
        key={item.id + index}
        style={{
          flex: 1,
          alignSelf: 'stretch',
          alignItems: 'stretch',
          marginVertical: wp('2%'),
          marginHorizontal: wp('4%'),
        }}>
        {this.languageItem(item.title)}
      </View>
    );
  };

  languageItem = (value, isLast = true) => {
    return (
      <View
        key={value}
        style={{
          flex: 1,
          borderWidth: 2,
          borderBottomWidth: isLast ? 1 : 0,
          borderColor: 'gray',
          flexDirection: 'row',
        }}>
        <View style={{flex: 3}}>
          <Text style={styles.education}>{value}</Text>
        </View>
      </View>
    );
  };

  renderCenterItem = (item, index) => {
    return (
      <TrainingCentersScrollItem
        key={item.id + index}
        HallOrCenter={false}
        item={item}
        Title={this.props.Title}
        navigation={this.props.navigation}
      />
    );
  };

  renderTitle = (title, none) => {
    return (
      <>
        <Text
          style={{
            color: 'black',
            fontSize: wp('6%'),
            fontWeight: 'bold',
            marginVertical: 5,
            marginHorizontal: 20,
          }}>
          {title}
        </Text>
        {none ? (
          <Text
            style={{
              fontSize: wp('3.5%'),
              textAlign: 'left',
              marginVertical: 5,
              marginHorizontal: 25,
            }}>
            {strings.none}
          </Text>
        ) : null}
      </>
    );
  };
  render() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    let IsAr = UserProfile.getInstance().Lang === 'ar';

    if (this.state.loading)
      return (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );
    let Data = this.state.Data;
    let Reviews = this.state.Reviews;
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
        {this.Header(Data.full_name)}
        <ScrollView
          removeClippedSubviews={true}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          // style={{flex: 1}}
          showsHorizontalScrollIndicator={false}>
          {this.UserNameAndIMG(Data)}
          <View style={{height: hp('1.5%')}} />
          {this.Item('person', strings.name, Data.full_name, '90%')}
          {this.Item('location-city', strings.city, Data.city, '90%')}
          {this.Item('location-city', strings.country, Data.country, '90%')}
          {/* {this.Item('email',strings.email ,Data.email,'90%')} */}

          {this.renderTitle(strings.InfoAboutMe, !Data.brief)}
          <SectionContent content={`${Data.brief || ''}`} rtl={IsAr} />
          {/* {this.Item('location-on', strings.worksFor, Data.workplace, '90%')} */}

          {this.renderTitle(
            strings.worksFor,
            Data.belonging_to_centers.length === 0,
          )}

          {Data.belonging_to_centers.length > 0
            ? Data.belonging_to_centers.map((item, index) => {
                return this.renderCenterItem(item, index);
              })
            : null}

          {/* <TrainingCentersScroll
            data={Data.belonging_to_centers}
            HallOrCenter={false}
            Title={''}
            SubTitle={''}
            navigation={this.props.navigation}
          /> */}

          {this.renderTitle(strings.education, Data.educations.length === 0)}

          {Data.educations.length > 0
            ? Data.educations.map((item, index) => {
                return this.renderEducationItem(item, index);
              })
            : null}
          {/* <FlatList
            style={{marginHorizontal: 5}}
            data={Data.educations}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return this.renderEducationItem(item, index);
            }}
          /> */}

          {this.renderTitle(strings.experience, Data.experiences.length === 0)}

          {Data.experiences.length > 0
            ? Data.experiences.map((item, index) => {
                return this.renderEducationItem(item, index);
              })
            : null}
          {/* <FlatList
            style={{marginHorizontal: 5}}
            data={Data.experiences}
            keyExtractor={(item, index) => item.id + index.toString()}
            renderItem={({item, index}) => {
              return this.renderEducationItem(item, index);
            }}
          /> */}

          {this.renderTitle(strings.Languages, Data.languages.length === 0)}

          {Data.languages.length > 0
            ? Data.languages.map((item, index) => {
                return this.renderLanguageItem(item, index);
              })
            : null}

          {this.renderTitle(strings.skills, Data.skills.length === 0)}

          {Data.skills.length > 0
            ? Data.skills.map((item, index) => {
                return this.renderLanguageItem(item, index);
              })
            : null}

          {userRole === 'Center' && this.state.status == null && (
            <TouchableOpacity
              style={styles.spcifiybtn}
              onPress={() => this.add_trainer_request()}>
              <Text style={{color: 'white', fontSize: wp('4%')}}>
                {strings.send_request}
              </Text>
            </TouchableOpacity>
          )}
          {this.NewCourses(Data.courses)}

          <View style={{height: hp('20%')}} />
          <AddReview
            APILink={
              'http://www.ertaqee.com/api/v1/user/' +
              this.state.Data.id +
              '/review'
            }
            Show={this.state.ShowReview}
            HideReview={this.HideReview}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default CoachDetails;
const styles = StyleSheet.create({
  DescTxt: {
    textAlign: 'left',
    marginTop: hp('2%'),
    fontSize: wp('3%'),
    color: 'grey',
  },
  SocialIcon: {
    margin: 3,
    tintColor: '#8D95A6',
    resizeMode: 'contain',
    width: wp('7%'),
    height: hp('2.25%'),
  },
  LoginBTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('60%'),
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
  BackArrow1: {
    tintColor: 'black',
    resizeMode: 'contain',
    width: wp('4%'),
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
  education: {
    padding: 5,
    fontSize: 20,
    color: Colors.black,
  },
});
