import React, { Component } from 'react';
import { StyleSheet,ActivityIndicator,TouchableOpacity,ToastAndroid,ImageBackground,ScrollView,View,Dimensions,Alert,Image,I18nManager,TextInput,BackHandler,StatusBar } from 'react-native';

class LoadingScreen extends Component {


    render() {
      if(this.props.Show===true)
      return (
        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      )
       return(<View/>)
    }
  }

export {LoadingScreen};
