import { CommonActions } from '@react-navigation/native';
import React, { Component } from 'react';
import { View } from 'react-native';
import FCMToken from '../../FCMToken';
import UserProfile from '../../UserProfile';
import { SignIn, SignUp } from './components';

class SignMenu extends Component {
  constructor(props) {
    super(props);
    this.SwitchScreen = this.SwitchScreen.bind(this);
    this.SetUserToken = this.SetUserToken.bind(this);
    this.state = {
      IsLoginScreen: true,
    };
  }

  componentWillMount() {
    try {
      let ParamsData = this.props.route.params;
      if (ParamsData.IsUpdate) this.setState({IsLoginScreen: false});
    } catch {}
  }

  SwitchScreen() {
    this.setState({IsLoginScreen: !this.state.IsLoginScreen});
  }

  SetUserToken() {
    console.log('SetUserToken');
    const MyFormData = new FormData();
    let UserProfileData = UserProfile.getInstance().clientObj;
    MyFormData.append('user_id', UserProfileData.id);
    MyFormData.append('device_token', UserProfileData.FCMToken);
    MyFormData.append('platform', 'Android');

    try {
      fetch('https://www.demo.ertaqee.com/api/v1/insert_device_token', {
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
            console.log('responseJson:' + JSON.stringify(responseJson));
            this.GoHome();
          })
          .catch(error => {
            console.log('Thirderr:' + error);
          });
      });
    } catch (error) {
      console.log('FourthErr');
    }
  }

  GoHome() {
    // this.props.navigation.navigate('Home')
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'Introduction'}],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.MainView()}
        <FCMToken />
      </View>
    );
  }

  MainView = () => {
    if (this.state.IsLoginScreen === true)
      return (
        <SignIn
          SwitchScreen={this.SwitchScreen}
          SetUserToken={this.SetUserToken}
          navigation={this.props.navigation}
        />
      );
    return (
      <SignUp
        SwitchScreen={this.SwitchScreen}
        SetUserToken={this.SetUserToken}
        navigation={this.props.navigation}
      />
    );
  };
}

export default SignMenu;
