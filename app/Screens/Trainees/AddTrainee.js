import React, { useState } from 'react';
import {
  Alert,
  I18nManager,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import { Header } from '../../components/common';
import fonts from '../../fonts';
import { Dimensions } from '../../theme';
import { RadioButton } from '../common';
import strings from '../strings';

const AddTrainee = ({navigation}) => {
  const editItem = navigation.getParam('item');
  const [firstName, setFirstName] = useState(
    editItem ? editItem.first_name : '',
  );
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [gender, setGender] = useState('male');

  const handelAddTrainee = async () => {
    await fetch(`https://www.demo.ertaqee.com/api/v1/trainee`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        sec_name: secondName,
        family_name: lastName,
        id_number: idNumber,
        email,
        mobile,
        gender,
        token: UserProfile.getInstance().clientObj.token,
      }),
    })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        if (parsedRes.message) {
          CheckError(parsedRes);
          if (parsedRes.success) {
            // navigation.goBack();
            navigation.push('Trainees');
          }
        } else if (parsedRes.errors) {
          if (parsedRes.errors.mobile) {
            alert(parsedRes.errors.mobile);
          }
          if (parsedRes.errors.email) {
            alert(parsedRes.errors.email);
          }
        }
      })
      .catch(err => {
        console.log(err);
        console.log(UserProfile.getInstance().clientObj.token);
      });
  };

  const CheckError = responseJson => {
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
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{flex: 1}}>
          <Header navigation={navigation} title={strings.add_trainee} />
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={styles.InputStyle}
            placeholder={strings.first_name}
            placeholderTextColor={'gray'}
          />
          <TextInput
            value={secondName}
            onChangeText={setSecondName}
            style={styles.InputStyle}
            placeholder={strings.second_name}
            placeholderTextColor={'gray'}
          />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={styles.InputStyle}
            placeholder={strings.family_name}
            placeholderTextColor={'gray'}
          />
          <TextInput
            value={idNumber}
            onChangeText={setIdNumber}
            style={styles.InputStyle}
            placeholder={strings.id_number}
            placeholderTextColor={'gray'}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.InputStyle}
            placeholder={strings.email}
            placeholderTextColor={'gray'}
          />
          <TextInput
            value={mobile}
            onChangeText={setMobile}
            style={styles.InputStyle}
            placeholder={strings.phoneNumber}
            placeholderTextColor={'gray'}
          />
          <View style={[styles.InputView, {borderWidth: 0}]}>
            <TouchableOpacity
              onPress={() => setGender('male')}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton selected={gender == 'male'} color={'#39A1F7'} />
              <Text style={styles.restoreByPhone}> {strings.male}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender('female')}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton selected={gender == 'female'} color={'#39A1F7'} />
              <Text style={styles.restoreByPhone}> {strings.female}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender('bestnottodisclose')}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={gender == 'bestnottodisclose'}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}>
                {' '}
                {strings.bestnottodisclose}
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            onPress={handelAddTrainee}
            title={strings.save}
            buttonStyle={{
              width: Dimensions.DEVICE_WIDTH * 0.8,
              height: Dimensions.DEVICE_HEIGHT * 0.07,
              alignSelf: 'center',
              marginTop: 10,
            }}
            titleStyle={{fontFamily: fonts.normal}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  InputStyle: {
    borderRadius: Dimensions.DEVICE_WIDTH * 0.02,
    borderWidth: Dimensions.DEVICE_WIDTH * 0.001,
    paddingStart: Dimensions.DEVICE_WIDTH * 0.05,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    width: Dimensions.DEVICE_WIDTH * 0.9,
    height: Dimensions.DEVICE_HEIGHT * 0.07,
    fontSize: Dimensions.DEVICE_HEIGHT * 0.02,
    // fontFamily: 'Roboto',
    color: '#39A1F7',
    alignSelf: 'center',
    marginTop: Dimensions.DEVICE_HEIGHT * 0.02,
    fontFamily: fonts.normal,
  },
  RestoreByPhoneOrEmail: {
    // width: wp('30%'),
    height: hp('4%'),
    flexDirection: 'row',
    marginEnd: wp('3%'),
    alignItems: 'center',
  },
  restoreByPhone: {fontFamily: fonts.normal},
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
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
});

export default AddTrainee;
