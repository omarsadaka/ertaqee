/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../../UserProfile';
import fonts from '../../../fonts';
import { LoadingScreen } from '../../common';
import strings from '../../strings';
import HtmlContent from './HtmlContent';

class ModalViewTerms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
      loading: true,
      ShowReloadBTN: false,
    };
  }

  componentDidMount() {
    this.GetData();
  }

  GetData() {
    this.setState({Data: '', loading: true, ShowReloadBTN: false});
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/page/terms-and-conditions', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            if (responseJson.success)
              this.setState({
                loading: false,
                Data: responseJson.data,
                ShowReloadBTN: false,
              });
            else this.ShowReloadBTN();
          })
          .catch(error => {
            console.log('Thirderror:' + error);
            this.ShowReloadBTN();
          });
      });
    } catch (error) {
      console.log('FourthErr:' + error);
      this.ShowReloadBTN();
    }
  }

  render() {
    let MyState = this.state;
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    // if(MyState.loading)
    //   return(
    //     <View style={{flex:1}}>
    //       <LoadingScreen Show={true}/>
    //     </View>
    //   )
    let Data = this.state.Data;
    return (
      <Modal
        isVisible={this.props.visible}
        transparent
        onRequestClose={() => {
          this.props.changeState(false);
        }}
        useNativeDriver
        onBackdropPress={() => this.props.changeState(false)}
        onBackButtonPress={() => this.props.changeState(false)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: wp(90),
            height: '97%',
            alignItems: 'center',
            padding: 10,
            borderRadius: 15,
          }}
          backgroundColor="white">
          <TouchableOpacity
            onPress={() => this.props.changeState(false)}
            style={{position: 'absolute', top: hp('2%'), right: 10}}>
            <Text style={{fontFamily: fonts.bold, fontSize: 18}}> X </Text>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              marginVertical: hp('2%'),
              fontFamily: fonts.normal,
            }}>
            {' '}
            {strings.termsAndCond}
          </Text>
          {MyState.loading ? (
            <LoadingScreen Show={true} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} >
              <HtmlContent content={IsAr ? Data.content_ar : Data.content_en} />
            </ScrollView>
          )}
        </View>
      </Modal>
    );
  }
}

export default ModalViewTerms;
