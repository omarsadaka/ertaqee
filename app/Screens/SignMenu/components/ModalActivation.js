/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { I18nManager, Text, TouchableOpacity, View } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import strings from '../../strings';
class ModalActivation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      loading: false,
    };
  }

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
          marginBottom: 0,
        }}>
        <View
          style={{alignSelf: 'center', alignItems: 'center'}}
          center
          width={wp(90)}
          backgroundColor="white"
          borderRadius={20}
          touchableOpacity
          disabled
          onPress={() => {}}>
          <View
            style={{alignSelf: 'center', alignItems: 'center', marginTop: 20}}>
            <Text size={7} mt={4} color="#3D3D3D">
              {this.props.type === 'email'
                ? strings.enterActivationCode
                : strings.enterCodeSentPhone}
            </Text>
          </View>

          <View stretch height={hp(11)} center>
            <CodeInput
              // keyboardType="default"
              activeColor={'gray'}
              inactiveColor={'#959595'}
              placeholder={'_'}
              placeholderTextColor={'gray'}
              // eslint-disable-next-line react/no-string-refs
              ref="codeInputRef1"
              // secureTextEntry
              className={'border-box'}
              space={10}
              codeInputStyle={[
                I18nManager.isRTL ? {transform: [{scaleX: -1}]} : null,
                {
                  backgroundColor: '#F2F2F2',
                  marginHorizontal: 10,
                  borderWidth: 0,
                  borderRadius: 5,
                },
              ]}
              containerStyle={[
                I18nManager.isRTL ? {transform: [{scaleX: -1}]} : null,
                {
                  alignItems: 'flex-end',
                },
              ]}
              codeLength={4}
              size={wp(10)}
              inputPosition="left"
              onFulfill={code => {
                this.setState({code: code});
              }}
              onCodeChange={code => {
                this.setState({code: code});
              }}
            />
          </View>
          <AntDesign
            name={'closecircleo'}
            size={25}
            color={'gray'}
            m={6}
            style={{
              position: 'absolute',
              top: 15,
              right: I18nManager.isRTL ? 15 : undefined,
              left: !I18nManager.isRTL ? 15 : undefined,
            }}
            onPress={() => {
              this.props.changeState(false);
            }}
          />
          <View
            style={{alignSelf: 'stretch', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity
              onPress={() => {
                if (this.props.onDone) {
                  if (!this.state.code || this.state.code.length < 4) {
                    alert(strings.enterCodeCorrect);
                  } else {
                    this.props.onDone(this.state.code);
                  }
                }
              }}
              style={[
                {
                  backgroundColor: '#4D75B8',
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  paddingVertical: 10,
                },
              ]}>
              <Text style={{fontSize: hp('2.5%'), color: 'white'}}>
                {strings.confirm}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalActivation;
