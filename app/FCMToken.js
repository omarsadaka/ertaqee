import messaging from '@react-native-firebase/messaging';
import React, { Component } from 'react';
import { View } from 'react-native';
import UserProfile from './UserProfile';

export default class FCMToken extends Component {
  async componentDidMount() {
    try {
      if (UserProfile.getInstance().FCMToken.length < 5) this.checkPermission();
      // else
      //   console.log('here:'+UserProfile.getInstance().FCMToken);
    } catch {
      this.checkPermission();
    }
  }

  //1
  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //2
  async requestPermission() {
    try {
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  //3
  async getToken() {
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log('fcmToken:' + fcmToken);
      UserProfile.getInstance().FCMToken = fcmToken;
    }
  }

  render() {
    return <View />;
  }
}
