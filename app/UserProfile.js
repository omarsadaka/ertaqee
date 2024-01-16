import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeAppLanguage } from './Screens/Helpers';
export default class UserProfile {
  static myInstance = null;

  UserCreds = '';
  Lat = '';
  Lon = ''; //T,Remove Token
  CartNo = 0;
  FCMToken = '';
  constructor() {
    this.UserCreds = {email: '', password: ''};
    this.UserType = 0;
    this.Lang = 'ar';
    this.clientObj = '';
    this.CartNo = 0;
    this.FCMToken = '';
  }

  RemoveUserObj() {
    this.UserCreds = {email: '', password: ''};
    AsyncStorage.removeItem('UserCreds');
  }

  async SaveUserObj() {
    await AsyncStorage.setItem('clientObj', JSON.stringify(this.clientObj))
      .then(() => {
        console.log('It was saved successfully');
      })
      .catch(() => {
        console.log('There was an error saving the product');
      });
  }

  async SaveUserCreds() {
    console.log(
      'JSON.stringify(this.UserCreds):' + JSON.stringify(this.UserCreds),
    );
    await AsyncStorage.setItem('UserCreds', JSON.stringify(this.UserCreds))
      .then(() => {
        console.log('It was saved successfully');
      })
      .catch(() => {
        console.log('There was an error saving the product');
      });
  }

  async RetriveUserCreds() {
    await AsyncStorage.getItem('lang').then((lang) => {
      this.Lang = lang;
    });
    await AsyncStorage.getItem('UserCreds').then((UserCreds) => {
      this.UserCreds = UserCreds;
    });
  }

  static getInstance() {
    if (UserProfile.myInstance === null) {
      UserProfile.myInstance = new UserProfile();
    }
    return this.myInstance;
  }

  getUserType() {
    return this.clientObj.user.role[0];
  }

  CanReserveCourse() {
    let UserType = this.getUserType();
    return UserType == 'User' || UserType == 'Company';
  }

  IsHallProvider() {
    let UserType = this.getUserType();
    return UserType == 'Halls Provider';
  }

  SetThisUserData(ThisUserType) {
    this.UserType = ThisUserType;
  }

  SetThisLangSelected(SelectedLangNo) {
    this.Lang = '' + SelectedLangNo;
    this.SaveLang(SelectedLangNo);
  }

  async SaveLang(SelectedLangNo) {
    try {
      await AsyncStorage.setItem('lang', '' + SelectedLangNo);
      console.log('SaveLan' + SelectedLangNo);
      changeAppLanguage(SelectedLangNo);
    } catch {}
  }
}
