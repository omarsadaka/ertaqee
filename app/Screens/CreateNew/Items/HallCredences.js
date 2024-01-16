import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import strings from '../../strings';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import fonts from '../../../fonts';
import ModalPicker from '../../common/ModalPicker';

class HallCredences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accreditation: '',
      imageURI: '',
    };
  }
  componentDidMount() {}

  AccreditationPicker() {
    let AccreditationData = this.props.AccreditationData;
    try {
      if (AccreditationData.length === 0)
        return (
          <View style={styles.InputView}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
    } catch {
      return (
        <View style={styles.InputView}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }

    let PickerItems = [];
    // PickerItems.push(
    //   <Picker.Item key={-1} label={strings.accreditatioBody} value={null} />,
    // );
    // for (let i = 0; i < AccreditationData.length; i++)
    //   PickerItems.push(
    //     <Picker.Item
    //       key={i}
    //       label={AccreditationData[i].title}
    //       value={AccreditationData[i].id}
    //     />,
    //   );

    AccreditationData.forEach(element => {
      const obj = {
        name: element.title,
        id: element.id,
      };
      PickerItems.push(obj);
    });

    return (
      <View style={styles.pickerView}>
        <ModalPicker
          hasBorder={true}
          data={PickerItems}
          hint={strings.accreditatioBody + ' *'}
          onSelect={(index, value) => {
            this.setState({accreditation: value.id});
            this.props.onChange({
              ...this.props.data,
              credence_name: !value.id ? '' : AccreditationData[index].title,
            });
          }}
        />
      </View>
    );
  }

  PickPhoto() {
    if (Platform.OS === 'ios') this.openImagePicker();
    else this.requestCameraPermission();
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'رسالة تنبيه',
          message: 'التطبيق يحتاج الدخول للاستديو لاختيار الصور',
          buttonNegative: strings.no,
          buttonPositive: strings.yes,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.openImagePicker();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  openImagePicker = () => {
    console.log('Image picker function');
    const PICKER_OPTIONS = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 1,
      selectionLimit: 1,
    };
    ImagePicker.launchImageLibrary(PICKER_OPTIONS, response => {
      if (response.didCancel) {
      } else if (response.error) {
        alert(
          'ImagePicker Error: ' +
            '\t' +
            response.error +
            '\t' +
            JSON.stringify(response.error),
        );
      } else if (response.customButton) {
      } else {
        let source = {uri: response.assets[0].uri};
        if (source.uri.length > 5) {
          this.props.onChange({
            ...this.props.data,
            image: source,
          });
          console.log('Success Uploaded', response);
        }
      }
    });
  };

  render() {
    let {data, index} = this.props;
    let {multiline} = this.state;
    return (
      <View
        style={{
          // alignSelf: 'stretch',
          // paddingLeft: 30,
          // paddingRight: 10,
          width: wp('100%'),
        }}>
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
        {this.AccreditationPicker()}
        <View style={styles.InputView}>
          <TextInput
            // pointerEvents="none"
            multiline={multiline}
            // onBlur={() => this.setState({multiline: true})}
            // onFocus={() => this.setState({multiline: false})}
            onChangeText={text => {
              this.props.onChange({...data, credence_number: text});
            }}
            value={
              data.credence_number
                ? data.credence_number 
                : !data.length
                ? ''
                : '112338'
            }
            keyboardType='numeric'
            placeholder={`${strings.accreditationNo} *`}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <TouchableOpacity onPress={() => this.PickPhoto()}>
          <View style={styles.InputView}>
            <Text
              style={[
                styles.NextTxt,
                {color: '#7E7E7E', fontFamily: fonts.normal},
              ]}>
              {' '}
              {strings.accreditationCertificate}
            </Text>
          </View>
        </TouchableOpacity>

        {data.image ? (
          <View style={[styles.InputView, {height: hp(20)}]}>
            <Image
              source={data.image}
              style={{height: hp(20), width: wp('90%')}}
              resizeMode="stretch"
            />
          </View>
        ) : null}
      </View>
    );
  }
}

export default HallCredences;
const styles = StyleSheet.create({
  InputView: {
    borderColor: 'silver',
    marginVertical: hp('2%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    height: hp('7%'),
    marginHorizontal: wp('5%'),
  },
  InputStyleNewAccount: {
    // height: hp('7%'),
    fontSize: hp('2%'),
    width: wp('80%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: 'right',
    paddingHorizontal: 7,
  },
  pickerView: {
    marginTop: hp('2%'),
    height: hp('7%'),
    alignSelf: 'stretch',
    marginHorizontal: wp('5%'),
  },
});
