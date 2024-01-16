/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {View} from 'react-native';
import { Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import strings from '../../strings';
import {TouchableOpacity} from 'react-native';

class ModalTakePhoto extends Component {
  state = {};

  render() {
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
            alignItems: 'center',
            padding: 10,
            borderRadius: 15,
          }}
          backgroundColor="white">
          <Text color="black">{strings.chooseImage}</Text>
          <View
            row
            spaceBetween
            stretch
            mt={5}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'stretch',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.onDone('launchCamera');
              }}
              style={{
                width: wp(35),
                paddingVertical: 5,
                color: 'white',
                backgroundColor: 'black',
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontSize: hp('2%')}}>
                {strings.camera}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.onDone('launchImageLibrary');
              }}
              style={{
                width: wp(35),
                paddingVertical: 5,
                color: 'white',
                backgroundColor: 'black',
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical:5,
              }}>
              <Text style={{color: 'white', fontSize: hp('2%')}}>
                {strings.library}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalTakePhoto;
