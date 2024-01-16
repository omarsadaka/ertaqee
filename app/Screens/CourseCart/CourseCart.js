import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { RadioButton } from '../common';
import strings from '../strings';
// let UserObj = UserProfile.getInstance().clientObj.user;
class CourseCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
      loading: false,
      user: [],
      includes_me: true,
      course_id: '',
      ShowAddUser: false,
      Currentname: '',
      secondname: '',
      famillyname: '',
      Currentemail: '',
      Currentmobile: '',
      Trainees: [],
      selectedUser: [],
      userObj: UserProfile.getInstance().clientObj.user,
      trainees: [],
    };
  }

  componentWillMount() {
    let ParamsData = this.props.route.params;
    this.setState({course_id: ParamsData.course_id});
    this.getAllTrainees();
  }

  getAllTrainees1 = async () => {
    // this.setState({loading: true});
    let arr = [];
    let ids = [];
    let UserObj = UserProfile.getInstance().clientObj.user;
    const obj = {
      Key: UserObj.id,
      name: UserObj.username,
      email: UserObj.email,
      mobile: UserObj.mobile,
    };
    arr.push(obj);
    this.setState({
      user: arr,
    });
    arr.map((item, index) => {
      ids.push(index);
    });
    this.setState({
      selectedUser: ids,
    });

    // await fetch(
    //   `https://www.demo.ertaqee.com/api/v1/trainees/all?token=${
    //     UserProfile.getInstance().clientObj.token
    //   }`,
    //   {
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // )
    //   .then((res) => res.json())
    //   .then((parsedRes) => {
    //     console.log(parsedRes);
    //     let arr = [];
    //     if (Array.isArray(parsedRes.data)) {
    //       parsedRes.data.map((item, index) => {
    //         arr.push(index);
    //       });
    //     }
    //     this.setState({
    //       loading: false,
    //       Trainees: parsedRes.data,
    //       user: parsedRes.data,
    //       selectedUser: arr,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.setState({loading: false});
    //   });
  };
  getAllTrainees = async () => {
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
        const data = [];
        var arr = parsedRes.data;
        let Currentusers = this.state.user;
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            name: arr[index].name,
            email: arr[index].email,
            mobile: arr[index].mobile,
          };
          Currentusers.push(obj);
        }
        this.setState({user: Currentusers});
      })
      .catch(err => {
        console.log(err);
      });
  };

  RemoveThis(Key) {
    console.log('RemoveThis:' + Key);
    let CurrentUsers = this.state.selectedUser.slice();
    if (CurrentUsers.indexOf(Key) !== -1) {
      CurrentUsers.splice(CurrentUsers.indexOf(Key), 1);
    } else {
      CurrentUsers.push(Key);
    }
    this.setState({selectedUser: CurrentUsers});
  }

  selectedAll() {
    let CurrentUsers = this.state.selectedUser.slice();
    if (CurrentUsers.length === this.state.user.length) {
      this.setState({
        selectedUser: [],
        includes_me: false,
      });
    } else {
      let arr = [];
      this.state.user.map((item, index) => {
        arr.push(index);
      });
      this.setState({selectedUser: arr, includes_me: true});
    }
  }

  userItem(Key, name, email, mobile, isMe) {
    return (
      <View
        key={Key}
        style={{
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          marginTop: hp('2%'),
          width: wp('90%'),
          height: hp('11%'),
          borderWidth: 1,
          borderColor: isMe ? 'red' : '#f5f5f5',
        }}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <View
              style={{
                marginTop: hp('2%'),
                justifyContent: 'center',
                width: wp('75%'),
                height: hp('3%'),
              }}>
              <Text style={{textAlign: 'left', fontSize: hp('1.8%')}}>
                {' '}
                {name}{' '}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp('1%'),
                alignItems: 'center',
                width: wp('75%'),
                height: hp('3%'),
              }}>
              <Icon name="phone" size={18} color={'#7d7d7d'} />
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: hp('1.5%'),
                  color: 'silver',
                }}>
                {' '}
                {mobile}{' '}
              </Text>
              <Icon name="email" size={18} color={'#7d7d7d'} />
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: hp('1.5%'),
                  color: 'silver',
                }}>
                {' '}
                {email}{' '}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: hp('2%'),
              justifyContent: 'center',
              width: wp('10%'),
              height: hp('7%'),
            }}>
            {isMe ? (
              this.state.includes_me ? (
                <TouchableOpacity onPress={() => this.RemoveThis(Key)}>
                  <RadioButton
                    selected={
                      isMe
                        ? this.state.includes_me
                        : this.state.selectedUser.includes(Key)
                    }
                    color={'#39A1F7'}
                  />
                </TouchableOpacity>
              ) : null
            ) : (
              <TouchableOpacity onPress={() => this.RemoveThis(Key)}>
                <RadioButton
                  selected={
                    isMe
                      ? this.state.includes_me
                      : this.state.selectedUser.includes(Key)
                  }
                  color={'#39A1F7'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  MyItems() {
    const {user} = this.state;
    let Items = [];
    let arr = [];
    for (let i = 0; i < user.length; i++) {
      Items.push(
        this.userItem(i, user[i].name, user[i].email, user[i].mobile, false),
      );
      arr.push(i);
    }
    Items.push(
      <TouchableOpacity
        onPress={() => this.Adduser()}
        style={{marginTop: hp('2%'), alignItems: 'center', height: hp('15%')}}>
        <Text
          style={{
            color: '#93D4F0',
            textAlign: 'center',
            fontSize: hp('1.8%'),
            fontFamily: fonts.bold,
          }}>
          {' '}
          {strings.addNewStudent}{' '}
        </Text>
      </TouchableOpacity>,
    );
    Items.push(<View style={{alignItems: 'center', height: hp('20%')}} />);
    return Items;
  }

  Items() {
    return (
      <View
        style={{
          marginTop: hp('1%'),
          alignSelf: 'center',
          alignItems: 'center',
          width: wp('90%'),
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.MyItems()}
        </ScrollView>
      </View>
    );
  }

  Adduser() {
    this.setState({ShowAddUser: true});
  }

  AdduserData() {
    const {Currentname, Currentemail, Currentmobile, user} = this.state;
    let Currentusers = user;
    if (Currentname && Currentmobile && Currentemail) {
      let userObj = {
        name: Currentname,
        email: Currentemail,
        mobile: Currentmobile,
      };
      Currentusers.push(userObj);
      this.setState({
        user: Currentusers,
        ShowAddUser: false,
        Currentname: '',
        Currentemail: '',
        Currentmobile: '',
      });
    } else {
      // alert(strings.entervaliddata)
      Alert.alert(strings.alert, strings.entervaliddata, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
    }
  }

  AddUserForm() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: wp('100%'),
          height: hp('100%'),
        }}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            opacity: 0.3,
            width: wp('100%'),
            height: hp('100%'),
          }}
        />
        <View
          style={{
            alignItems: 'center',
            marginTop: hp('30%'),
            width: wp('100%'),
            backgroundColor: 'white',
            height: hp('70%'),
          }}>
          <Text
            style={{
              color: '#515155',
              marginTop: hp('3%'),
              width: wp('80%'),
              textAlign: 'left',
              fontSize: hp('2%'),
              fontFamily: fonts.bold,
            }}>
            {' '}
            {strings.addNewStudent}{' '}
          </Text>
          <View style={styles.InputView1}>
            <TextInput
              onChangeText={text => this.setState({Currentname: text})}
              placeholder={strings.first_name}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
          <View style={styles.InputView1}>
            <TextInput
              onChangeText={text => this.setState({secondname: text})}
              placeholder={strings.second_name}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
          <View style={styles.InputView1}>
            <TextInput
              onChangeText={text => this.setState({famillyname: text})}
              placeholder={strings.family_name}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
          <View style={styles.InputView1}>
            <TextInput
              onChangeText={text => {}}
              placeholder={strings.id_number}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>

          <View style={styles.InputView1}>
            <TextInput
              onChangeText={text => this.setState({Currentmobile: text})}
              placeholder={strings.phoneNumber}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
          <View style={styles.InputView1}>
            <TextInput
              onChangeText={text => this.setState({Currentemail: text})}
              placeholder={strings.email}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.LoginBTNStyle,
              {height: hp('7%'), width: wp('80%'), marginTop: hp('3%')},
            ]}
            onPress={() => this.AdduserData()}>
            <Text style={styles.NextTxt}>{strings.add}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  AddToBasket() {
    let State = this.state;
    if (this.state.loading) return;
    this.setState({loading: true});
    const MyFormData = new FormData();
    MyFormData.append('course_id', State.course_id);
    MyFormData.append('includes_me', State.includes_me ? 1 : 0);
    MyFormData.append('token', UserProfile.getInstance().clientObj.token);
    let users = [];
    State.selectedUser.forEach(item => {
      users.push(State.user[item]);
    });
    try {
      if (users.length > 0) {
        MyFormData.append('user', '' + JSON.stringify(users));
      } else {
        MyFormData.append('user', '');
      }
    } catch {
      console.log('No User');
      MyFormData.append('user', '');
    }
    console.log('Upload user ', {MyFormData, users});
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/add_course_to_cart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
        },
        body: MyFormData,
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            this.setState({loading: false});
            console.log('Data:' + JSON.stringify(responseJson));
            if (responseJson.success) {
              // this.props.navigation.goBack();
              this.props.navigation.navigate('Home');
              // alert(strings.successProcess);
              Alert.alert(strings.alert, strings.successProcess, [
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: strings.ok, onPress: () => console.log('OK Pressed')},
              ]);

              return;
            } else if (responseJson.errors) {
              if (responseJson.errors[0] === 'Item already exist in cart.') {
                Alert.alert(strings.alert, strings.already_exsist, [
                  {
                    text: strings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: strings.ok, onPress: () => console.log('OK Pressed')},
                ]);
              } else {
                Alert.alert(strings.alert, responseJson.errors[0], [
                  {
                    text: strings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: strings.ok, onPress: () => console.log('OK Pressed')},
                ]);
              }
            }
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            this.setState({loading: false});
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
    }
  }

  LoginTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.confirm}</Text>;
  }

  render() {
    const {ShowAddUser, userObj} = this.state;
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <SafeAreaView>
        <ScrollView style={{backgroundColor: '#FFFFFF'}}>
          <View
            style={{
              width: wp('100%'),
              height: hp('100%'),
              alignItems: 'center',
            }}>
            <Image
              style={styles.BackGroundLogo}
              source={require('../../res/backgroundlogo.png')}
            />
            <ImageBackground
              source={require('../../res/topbar.png')}
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
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp('95%'),
                  }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <Icon
                      name={IsAr ? 'arrow-forward' : 'arrow-back'}
                      size={30}
                      color={'white'}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: hp('2%'),
                      fontFamily: fonts.normal,
                    }}>
                    {' '}
                    {strings.numberOfIndividuals}{' '}
                  </Text>
                  <TouchableOpacity onPress={() => this.Adduser()}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: hp('1.8%'),
                        fontFamily: fonts.bold,
                      }}>
                      {' '}
                      {strings.add}{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>

            <View
              style={[styles.InputView, {marginTop: hp('2%'), borderWidth: 0}]}>
              <Text style={styles.restoreByPhone}>
                {' '}
                {strings.addMeToCourse}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({includes_me: true})}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton
                  selected={this.state.includes_me}
                  color={'#39A1F7'}
                />
                <Text style={styles.restoreByPhone}> {strings.yes}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({includes_me: false})}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton
                  selected={!this.state.includes_me}
                  color={'#39A1F7'}
                />
                <Text style={styles.restoreByPhone}> {strings.no}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[styles.InputView, {marginTop: hp('1%'), borderWidth: 0}]}>
              <Text style={styles.restoreByPhone}> {strings.selectedAll} </Text>
              <TouchableOpacity
                onPress={() => {
                  this.selectedAll();
                }}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton
                  selected={
                    this.state.user.length === this.state.selectedUser.length
                  }
                  color={'#39A1F7'}
                />
              </TouchableOpacity>
            </View>
            {this.userItem(
              userObj.id,
              userObj.username,
              userObj.email,
              userObj.mobile,
              true,
            )}
            {this.Items()}
            <View
              style={{
                position: 'absolute',
                bottom: hp('3%'),
                flexDirection: 'row',
                backgroundColor: 'white',
                width: wp('100%'),
                height: hp('9%'),
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: wp('100%'),
                  height: hp('9%'),
                }}>
                <TouchableOpacity
                  style={styles.LoginBTNStyle}
                  onPress={() => this.AddToBasket()}>
                  {this.LoginTxt()}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {ShowAddUser && this.AddUserForm()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default CourseCart;
const styles = StyleSheet.create({
  RestoreByPhoneOrEmail: {
    width: wp('20%'),
    height: hp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  restoreByPhone: {
    fontFamily: fonts.normal,
  },
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
    width: wp('70%'),
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
  NextTxt: {fontSize: hp('2.2%'), color: 'white', fontFamily: fonts.normal},
  InputStyle: {
    borderColor: 'silver',
    margin: 2,
    borderColor: 'silver',
    borderWidth: wp('0.1%'),
    borderRadius: wp('1%'),
    width: wp('90%'),
    marginTop: hp('2%'),
    height: hp('8%'),
    fontSize: hp('1.8%'),
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
  title: {fontSize: hp('1.8%'), color: 'white'},
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
  InputView1: {
    borderColor: '#ebebeb',
    marginTop: hp('1%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('80%'),
    height: hp('7%'),
  },
  InputStyleNewAccount: {
    width: wp('85%'),
    height: hp('7%'),
    fontSize: hp('1.8%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: fonts.normal,
    paddingHorizontal: 4,
  },
});
