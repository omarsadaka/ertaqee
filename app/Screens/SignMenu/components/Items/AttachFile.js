import React, { Component } from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import strings from '../../../strings';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import fonts from '../../../../fonts';
import ModalTakePhoto from '../ModalTakePhoto';

class AttachFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiline: true,
      imageModalVisible: false,
    };
  }

  choicePicker = (func) => {
    let permission =
      Platform.OS === 'ios'
        ? func === 'launchImageLibrary'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    request(permission).then((result) => {
      // switch (result) {
      //   case RESULTS.GRANTED:
      ImagePicker[func](
        {mediaType: 'photo', quality: 0.6, maxWidth: 1024, maxHeight: 1024},
        (response1) => {
          if (!response1.didCancel) {
            let data = {
              uri: response1.assets[0].uri,
              type: response1.assets[0].type
                ? response1.assets[0].type
                : 'image/png',
              name: 'fileName',
            };

            this.props.onChange({...this.props.data, image: data});
          } else if (response1.didCancel) {
          } else {
          }
        },
      );
      //     break;
      //   default: {
      //     Platform.OS === 'ios'
      //       ? Linking.openURL('app-settings://Photos')
      //       : choicePicker(func);
      //   }
      // }
    });
  };

  render() {
    let {data, index} = this.props;
    let {multiline} = this.state;
    return (
      <View style={{alignSelf: 'stretch'}}>
        {index !== 0 ? (
          <TouchableOpacity
            onPress={() => {
              this.props.onDelete();
            }}>
            <AntDesign
              name="delete"
              size={20}
              color="red"
              style={{marginTop: hp('3%')}}
            />
          </TouchableOpacity>
        ) : null}
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={(text) => {
              this.props.onChange({...data, about: text});
            }}
            value={data.about}
            placeholder={`${strings.fileTitle}*`}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              imageModalVisible: true,
            });
          }}>
          {data.image ? (
            <View
              style={[
                styles.InputView,
                {paddingHorizontal: 10, height: hp(20)},
              ]}>
              <Image
                source={data.image}
                style={{alignSelf: 'stretch', flex: 1}}
                resizeMode="stretch"
              />
            </View>
          ) : (
            <View style={[styles.InputView, {paddingHorizontal: 10}]}>
              <Text
                style={{
                  color: '#7E7E7E',
                  fontSize: hp('1.8%'),
                }}>{`${strings.attachFile}*`}</Text>
            </View>
          )}
        </TouchableOpacity>
        <ModalTakePhoto
          visible={this.state.imageModalVisible}
          changeState={(value) => {
            this.setState({imageModalVisible: false});
          }}
          onDone={(func) => {
            this.setState({imageModalVisible: false});
            setTimeout(() => {
              this.choicePicker(func);
            }, 500);
          }}
        />
      </View>
    );
  }
}

export default AttachFile;
const styles = StyleSheet.create({
  InputView: {
    borderColor: 'silver',
    marginTop: hp('2%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
  },
  InputStyleNewAccount: {
    width: wp('85%'),
    height: hp('7%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});
