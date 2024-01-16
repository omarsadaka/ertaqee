import React from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
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
import UserProfile from '../../../UserProfile';
import fonts from '../../../fonts';
import ModalPicker from '../../common/ModalPicker';
import strings from '../../strings';

class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: UserProfile.getInstance().clientObj.user.username,
      email: UserProfile.getInstance().clientObj.user.email,
      mobile: UserProfile.getInstance().clientObj.user.mobile,
      message: null,
      loading: false,
      TypesLoading: true,
      TypesData: [],
      SelectedType: -1,
    };
  }

  componentDidMount() {
    let IsAsk = this.props.route.params?.IsAsk;
    this.GetTypes(IsAsk);
  }

  GetTypes(ConsOrCont) {
    let ApiWordType = 'contact_types';
    if (ConsOrCont) ApiWordType = 'consultations_types';
    fetch('https://www.demo.ertaqee.com/api/v1/' + ApiWordType, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success)
          this.setState({
            TypesData: responseJson.data,
            // SelectedType: responseJson.data[0].id,
            TypesLoading: false,
          });
      })
      .catch(error => {
        this.setState({TypesLoading: false});
      });
  }

  PurposeofContact() {
    /*
IsAsk true => استشارات
IsAsk false => تواصل معنا
*/

    if (this.state.TypesLoading)
      return (
        <View style={styles.InputStyleNewAccount}>
          <View
            style={{
              height: hp('7%'),
              justifyContent: 'center',
              width: wp('10%'),
            }}>
            <ActivityIndicator size="small" color="black" />
          </View>
        </View>
      );

    let Types = this.state.TypesData;
    let PickerItems = [];
    // for(let i=0;i<Types.length;i++)
    //   PickerItems.push(<Picker.Item key={i} label={Types[i].title}
    //    value={Types[i].id} />)
    Types.forEach(element => {
      const obj = {
        name: element.title,
        id: element.id,
      };
      PickerItems.push(obj);
    });

    return (
      <ModalPicker
        hasBorder={false}
        data={PickerItems}
        hint={strings.type + ' *'}
        onSelect={(index, value) => {
          this.setState({SelectedType: value.id});
        }}
      />
    );
  }

  IsThereAnyInputEmpty(Data) {
    console.log(
      '🚀 ~ file: ContactUs.js:116 ~ ContactUs ~ IsThereAnyInputEmpty ~ Data:',
      Data,
    );
    try {
      return (
        Data.name.length === 0 ||
        Data.mobile.length === 0 ||
        Data.email.length === 0 ||
        Data.message.length === 0 ||
        this.state.SelectedType === -1
      );
    } catch {
      return true;
    }
  }

  PostReq() {
    let Data = this.state;
    if (this.IsThereAnyInputEmpty(Data)) {
      alert('الحقول * مطلوبة');
      return;
    }
    if (this.state.loading) return;
    this.setState({loading: true});

    const MyFormData = new FormData();
    MyFormData.append('name', Data.name);
    MyFormData.append('email', Data.email);
    MyFormData.append('mobile', Data.mobile);
    MyFormData.append('message', Data.message);
    MyFormData.append('type_id', this.state.SelectedType);
    MyFormData.append('lang', UserProfile.getInstance().Lang);

    console.log('MyFormData:' + JSON.stringify(MyFormData));

    let IsAsk = this.props.route.params?.IsAsk;
    console.log(
      '🚀 ~ file: ContactUs.js:176 ~ ContactUs ~ PostReq ~ IsAsk:',
      IsAsk,
    );
    let APILink = 'https://www.demo.ertaqee.com/api/v1/contact_us';
    if (IsAsk) APILink = 'https://www.demo.ertaqee.com/api/v1/consultation';
    try {
      fetch(APILink, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          // Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token
        },
        body: MyFormData,
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            this.setState({loading: false});
            console.log('Data:' + JSON.stringify(responseJson));
            this.setState({loading: false});
            if (responseJson.success) {
              // alert(strings.successProcess)
              Alert.alert(strings.alert, strings.successProcess, [
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: strings.ok,
                  onPress: () => this.props.navigation.goBack(),
                },
              ]);
            } else this.CheckError(responseJson);
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            this.setState({loading: false});
            // alert(strings.allFeildsRequeired);
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
      // alert(strings.allFeildsRequeired);
    }
  }

  CheckError(responseJson) {
    console.log('Here:' + JSON.stringify(responseJson));
    try {
      if (responseJson.errors.name) {
        // alert(responseJson.errors.name[0]);
        Alert.alert(strings.alert, responseJson.errors.name[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      } else if (responseJson.errors.email) {
        // alert(responseJson.errors.email[0]);
        Alert.alert(strings.alert, responseJson.errors.email[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      } else if (responseJson.errors.mobile) {
        // alert(responseJson.errors.mobile[0]);
        Alert.alert(strings.alert, responseJson.errors.mobile[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      } else if (responseJson.errors.message) {
        // alert(responseJson.errors.message[0]);
        Alert.alert(strings.alert, responseJson.errors.message[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      } else {
        // alert(strings.entervaliddata);
        Alert.alert(strings.alert, strings.entervaliddata, [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
    } catch {
      // alert(strings.allFeildsRequeired)
    }
  }

  LoadingTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.send}</Text>;
  }
  render() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={require('../../../res/topbar2.png')}
          style={styles.Header}>
          <Text style={styles.MiddleTxt}>
            {this.props.route.params?.IsAsk
              ? strings.askConsultation
              : strings.contactUs}
          </Text>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              width: wp('100%'),
              height: hp('10%'),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: wp('100%'),
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{marginLeft: wp('2%')}}>
                <Icon
                  name={IsAr ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <ScrollView style={{alignContent: 'center'}}>
          <View
            style={{
              margin: hp('2%'),
              flex: 1,
            }}>
            {/* <Text
              style={{
                fontSize: hp('2%'),
                width: wp('90%'),
                color: 'black',
                textAlign: 'left',
                fontFamily: fonts.normal,
                marginBottom: 7,
              }}>
              {this.props.route.params.title}
            </Text> */}

            <Text style={styles.label}>{strings.name}</Text>
            <TextInput
              defaultValue={UserProfile.getInstance().clientObj.user.username}
              onChangeText={text => this.setState({name: text})}
              placeholder={strings.name}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />

            <Text style={styles.label}>{strings.email}</Text>
            <TextInput
              defaultValue={UserProfile.getInstance().clientObj.user.email}
              onChangeText={text => this.setState({email: text})}
              placeholder={strings.email}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />

            <Text style={styles.label}>{strings.phoneNumber}</Text>
            <TextInput
              defaultValue={UserProfile.getInstance().clientObj.user.mobile}
              keyboardType={'numeric'}
              onChangeText={text => this.setState({mobile: text})}
              placeholder={strings.phoneNumber}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />

            <Text style={[styles.label, {marginBottom: 5}]}>
              {strings.type}
            </Text>
            {this.PurposeofContact()}

            <Text style={styles.label}>{strings.message}</Text>
            <TextInput
              multiline
              onChangeText={text => this.setState({message: text})}
              placeholder={strings.message + ' *'}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount, {height: hp('20%')}]}
            />
            <TouchableOpacity
              style={styles.LoginBTNStyle}
              onPress={() => this.PostReq()}>
              {this.LoadingTxt()}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export { ContactUs };
const styles = StyleSheet.create({
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackArrow: {
    position: 'absolute',
    top: hp('8%'),
    left: wp('25%'),
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
  },
  MiddleTxt: {
    width: wp('100%'),
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    right: wp('0%'),
    left: wp('0%'),
    color: 'white',
    fontSize: wp('5%'),
  },
  InputStyleNewAccount: {
    backgroundColor: 'white',
    elevation: 2,
    shadowOpacity: 0.1,
    marginTop: hp('2%'),
    // width: wp('90%'),
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
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('0.7%'),
  },
  NextTxt: {fontSize: hp('2%'), color: 'white', fontFamily: fonts.normal},
  label: {
    fontFamily: fonts.normal,
    fontSize: hp('1.8%'),
    marginBottom: -hp('1.6%'),
    textAlign: 'left',
    marginTop: hp('1.5%'),
    color: 'black',
  },
});
