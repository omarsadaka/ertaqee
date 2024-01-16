import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { TextInput } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import UserProfile from '../../../../UserProfile';
import fonts from '../../../../fonts';
import { RadioButton } from '../../../common';
import ModalPicker from '../../../common/ModalPicker';
import strings from '../../../strings';
import AcceptTerms from '../AcceptTerms';
import ModalViewTerms from '../ModalViewTerms';
import Experience from './Experience';
import Education from './Education';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
class EndUserInputs extends Component {
  InputsObj = {};

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      first_name: '',
      sec_name: '',
      family_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      gender: 'male',
      country_id: '',
      city_id: '',
      workplace: '',
      employer: '',
      employeeLevel: '',
      id_number: '',
      CountriesData: [],
      CitiesData: [],
      role_id: '2',
      UpdateObj: null,
      multiline: true,
      checked: false,
      countryName: '',
      cityName: '',
      showEye: false,
      showEyeConfirm: false,
      showTerms: false,
      skills:[],
      languages:[],
      education: [],
      experience: [],
      Degrees: [],
    };
  }

  componentDidMount() {
    this.InputsObj['role_id'] = '2';
    try {
      let RoleId = UserProfile.getInstance().clientObj.user.role_id[0];
      if (RoleId)
        this.SetStateBasedOnPropsObj(UserProfile.getInstance().clientObj.user);
    } catch (Error) {}
    this.SetCountriesData(UserProfile.getInstance().clientObj.user?.country_id);
    this.GetSkillsData()
    this.GetLanguagesData()
    this.GetDegreeData()
  }

  SetStateBasedOnPropsObj(UserObj) {
    this.InputsObj['UpdateObj'] = UserObj;
    this.setState({
      UpdateObj: UserObj,
      countryName: UserObj.country,
      cityName: UserObj.city,
    });
    this.InputsObj['user_id'] = UserObj.id;
    this.InputsObj['username'] = UserObj.username;
    this.InputsObj['first_name'] = UserObj.first_name;
    this.InputsObj['sec_name'] = UserObj.sec_name;
    this.InputsObj['family_name'] = UserObj.last_name;
    this.InputsObj['email'] = UserObj.email ? UserObj.email : '';
    // this.InputsObj['password'] = UserProfile.getInstance().UserCreds.password;
    // this.InputsObj[
    //   'password_confirmation'
    // ] = UserProfile.getInstance().UserCreds.password;
    this.InputsObj['phone'] = UserObj.phone
      ? UserObj.phone
      : UserObj.mobile
      ? UserObj.mobile
      : '';
    this.InputsObj['gender'] = UserObj.gender;
    this.setState({gender: UserObj.gender ? UserObj.gender : 'male'});
    this.InputsObj['workplace'] = UserObj.workplace;
    this.InputsObj['employer'] = UserObj.employer;
    this.InputsObj['id_number'] = UserObj.id_number;
    this.setState({
      country_id: UserObj.country_id,
      city_id: UserObj.city_id,
      username: UserObj.username,
      first_name: UserObj.first_name,
      sec_name: UserObj.sec_name,
      family_name: UserObj.last_name,
      email: UserObj.email,
      phone: UserObj.phone ? UserObj.phone : UserObj.mobile,
      id_number: UserObj.id_number,
    });
    if (UserObj.educations) {
      if (UserObj.educations.length === 0) {
        this.setState({
          education: [
            {
              from: '',
              to: '',
              achievements: '',
              location: '',
              facility: '',
              degree: '',
            },
          ],
        });
      } else {
        this.setState({education: UserObj.educations});
      }
    } else {
      this.setState({
        education: [
          {
            from: '',
            to: '',
            achievements: '',
            location: '',
            facility: '',
            degree: '',
          },
        ],
      });
    }
    if (UserObj.experiences) {
      if (UserObj.experiences.length === 0) {
        this.setState({
          experience: [
            {
              from: '',
              to: '',
              achievements: '',
              job_title: '',
              location: '',
              facility: '',
            },
          ],
        });
      } else {
        this.setState({experience: UserObj.experiences});
      }
    } else {
      this.setState({
        experience: [
          {
            from: '',
            to: '',
            achievements: '',
            job_title: '',
            location: '',
            facility: '',
          },
        ],
      });
    }
  }

  SetCountriesData(countryId) {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    const data = [];
    var arr = this.props.CountriesData;
    console.log('arr get countries', JSON.stringify(arr));
    for (let index = 0; index < arr.length; index++) {
      const obj = {
        id: arr[index].id,
        name: IsAr ? arr[index].title_ar : arr[index].title_en,
      };
      data.push(obj);
    }
    this.setState({
      CountriesData: data,
      // country_id: this.props.CountriesData[0].id,
    });
    // this.InputsObj['country_id'] = this.props.CountriesData[0].id;
    this.GetCitiesData(countryId ?? arr[0].id);
  }

  GetCitiesData(Country) {
    // this.setState({CitiesData: []});
    fetch('https://www.demo.ertaqee.com/api/v1/cities/' + Country, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        const data = [];
        var arr = responseJson.data;
        if (arr.length > 0) {
          console.log('Here arr' + JSON.stringify(arr));
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              id: arr[index].id,
              name: arr[index].title,
            };
            data.push(obj);
          }
          this.setState({
            CitiesData: data,
            // city_id: responseJson?.data[0]?.id,
          });
          // this.InputsObj['city_id'] = responseJson?.data[0]?.id;
        } else {
          Alert.alert('', strings.noCities, [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: strings.ok, onPress: () => console.log('OK Pressed')},
          ]);
        }
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

 GetSkillsData() {
    // this.setState({CitiesData: []});
    fetch('https://www.demo.ertaqee.com/api/v1/skills', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        const data = [];
        var arr = responseJson.data;
        if (arr.length > 0) {
          console.log('GetSkillsData' + JSON.stringify(arr));
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              id: arr[index].id,
              name: UserProfile.getInstance().Lang=='ar'? arr[index].title_ar: arr[index].title_en,
            };
            data.push(obj);
          }
          this.setState({
            skills: data,
          });
        } 
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetLanguagesData() {
    // this.setState({CitiesData: []});
    fetch('https://www.demo.ertaqee.com/api/v1/languages', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        const data = [];
        var arr = responseJson.data;
        if (arr.length > 0) {
          console.log('GetLanguagesData' + JSON.stringify(arr));
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              id: arr[index].id,
              name: UserProfile.getInstance().Lang=='ar'? arr[index].title_ar: arr[index].title_en,
            };
            data.push(obj);
          }
          this.setState({
            languages: data,
          });
        } 
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }


  GetDegreeData() {
    this.setState({Degrees: []});
    fetch('https://www.demo.ertaqee.com/api/v1/degrees', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.data.length > 0) {
          this.setState({
            Degrees: responseJson.data,
          });
        } else {
          Alert.alert('', strings.noDegrees, [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: strings.ok, onPress: () => console.log('OK Pressed')},
          ]);
        }
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }
  LoginTxt() {
    if (this.props.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.done}</Text>;
  }

  IsThereAnyInputEmpty(Data) {
    if (this.state.UpdateObj) {
      try {
        return (
          Data.username.length === 0 ||
          Data.first_name.length === 0 ||
          Data.family_name.length === 0 ||
          Data.email.length === 0 ||
          Data.phone.length === 0
          // Data.country_id.length === 0 ||
          // Data.city_id.length === 0
        );
      } catch {
        return true;
      }
    } else {
      try {
        return (
          Data.username.length === 0 ||
          Data.first_name.length === 0 ||
          Data.family_name.length === 0 ||
          Data.password.length === 0 ||
          Data.password_confirmation.length === 0 ||
          Data.email.length === 0 ||
          Data.phone.length === 0
          // Data.country_id.length === 0 ||
          // Data.city_id.length === 0
        );
      } catch {
        return true;
      }
    }
  }

  onSubmit(Data) {
    console.log('omarrrrrr', Data);
    console.log('omarrrrrr', Data.password);
    console.log('omarrrrrr', Data.password_confirmation);
    if (this.IsThereAnyInputEmpty(Data)) {
      Alert.alert('', strings.feildsWithStarRequierd, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }
    if (!this.state.checked) {
      Alert.alert(strings.termsAndCond, strings.accept_terms, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }
    delete Data.UpdateObj;
    this.props.SignUpPost(Data);
  }

  render() {
    const {UpdateObj, multiline} = this.state;
    const {InputsObj} = this;
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
          width: wp('90%'),
        }}>
        <Text style={styles.label}>{strings.userName}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({username: text});
              InputsObj['username'] = text;
            }}
            placeholder={strings.userName + ' *'}
            value={this.state.username}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.first_name}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({first_name: text});
              InputsObj['first_name'] = text;
            }}
            placeholder={strings.first_name + ' *'}
            value={this.state.first_name}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.second_name}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({sec_name: text});
              InputsObj['sec_name'] = text;
            }}
            placeholder={strings.second_name}
            value={this.state.sec_name}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.family_name}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({family_name: text});
              InputsObj['family_name'] = text;
            }}
            placeholder={strings.family_name + ' *'}
            value={this.state.family_name}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        {!UpdateObj && (
          <>
            <Text style={styles.label}>{strings.password}</Text>
            <View style={styles.InputView}>
              <TextInput
                onChangeText={text => (InputsObj['password'] = text)}
                placeholder={' * ' + strings.password}
                placeholderTextColor={'gray'}
                style={[styles.InputStyleNewAccount]}
                secureTextEntry={!this.state.showEye}
              />
              <Icon
                name={this.state.showEye ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEye ? 'gray' : '#39A1F7'}
                style={{marginHorizontal: 10}}
                onPress={() => {
                  this.setState({showEye: !this.state.showEye});
                }}
              />
            </View>
          </>
        )}
        {!UpdateObj && (
          <>
            <Text style={styles.label}>{strings.passwordConfirmation}</Text>
            <View style={styles.InputView}>
              <TextInput
                onChangeText={text =>
                  (InputsObj['password_confirmation'] = text)
                }
                placeholder={' * ' + strings.passwordConfirmation}
                placeholderTextColor={'gray'}
                style={[styles.InputStyleNewAccount]}
                secureTextEntry={!this.state.showEyeConfirm}
              />
              <Icon
                name={this.state.showEyeConfirm ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEyeConfirm ? 'gray' : '#39A1F7'}
                style={{marginHorizontal: 10}}
                onPress={() => {
                  this.setState({showEyeConfirm: !this.state.showEyeConfirm});
                }}
              />
            </View>
          </>
        )}
        <Text style={styles.label}>{strings.email}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            keyboardType="email-address"
            onChangeText={text => {
              this.setState({email: text});
              InputsObj['email'] = text;
            }}
            placeholder={strings.email + ' *'}
            value={this.state.email}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.phoneNumber}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            keyboardType="phone-pad"
            onChangeText={text => {
              this.setState({phone: text});
              InputsObj['phone'] = text;
            }}
            placeholder={' * ' + strings.phoneNumber}
            value={this.state.phone}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={styles.label}>{strings.id_number}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={text => {
              this.setState({id_number: text});
              InputsObj['id_number'] = text;
            }}
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.id_number
                : strings.id_number
            }
            value={this.state.id_number}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={styles.label}>{strings.gender}</Text>
        <View style={[styles.InputView, {borderWidth: 0}]}>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'male'})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton
              selected={this.state.gender == 'male'}
              color={'#39A1F7'}
            />
            <Text style={styles.restoreByPhone}> {strings.male}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({gender: 'female'})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton
              selected={this.state.gender == 'female'}
              color={'#39A1F7'}
            />
            <Text style={styles.restoreByPhone}> {strings.female}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'bestnottodisclose'})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton
              selected={this.state.gender == 'bestnottodisclose'}
              color={'#39A1F7'}
            />
            <Text style={styles.restoreByPhone}>
              {' '}
              {strings.bestnottodisclose}
            </Text>
          </TouchableOpacity>
        </View>

        {/* {this.CountriesPicker()}
        {this.CitiesPicker()} */}
        <Text style={[styles.label]}>{strings.country}</Text>
        <View
          style={{
            height: wp('14%'),
            alignSelf: 'stretch',
          }}>
          <ModalPicker
            hasBorder={true}
            data={this.state.CountriesData}
            hint={
              this.state.countryName
                ? this.state.countryName
                : strings.choose_country
            }
            defaultColor={'silver'}
            onSelect={(index, value) => {
              InputsObj['country_id'] = value.id;
              this.setState({country_id: value.id, ...this.state});
              this.setState({cityName: ''});
              this.setState({CitiesData: ''});
              this.GetCitiesData(value.id);
            }}
          />
        </View>
        <Text style={[styles.label, {marginBottom: -hp('2.5%'), marginTop: 6}]}>
          {strings.city}
        </Text>
        {this.state.CitiesData ? (
          <View
            style={{
              height: wp('14%'),
              marginTop: hp('2%'),
              alignSelf: 'stretch',
            }}>
            <ModalPicker
              hasBorder={true}
              data={this.state.CitiesData}
              hint={
                this.state.cityName ? this.state.cityName : strings.choose_city
              }
              defaultColor={'silver'}
              onSelect={(index, value) => {
                InputsObj['city_id'] = value.id;
                this.setState({city_id: value.id});
              }}
            />
          </View>
        ) : null}
      {UpdateObj&&
        <>
       <Text style={styles.label}>{strings.workplace}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={(text) => (InputsObj['workplace'] = text)}
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.workplace
                : strings.workplace + ' *'
            }
                placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        </>
        }
        {UpdateObj&&
        <>
        <Text style={styles.label}>{strings.JobTitle}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={(text) => (InputsObj['employer'] = text)}
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.employer
                : strings.JobTitle + ' *'
            }
                placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        </>
       }
       {UpdateObj&&
        <>
        <Text style={styles.label}>{strings.employeeLevel}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={(text) => (InputsObj['employeeLevel'] = text)}
                placeholderTextColor={'gray'}
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.employeeLevel
                : strings.employeeLevel + ' *'
            }
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        </>
       }
       {UpdateObj&&
        <>
        <Text style={[styles.label]}>{strings.skills}</Text>
        <View
          style={{
            height: wp('14%'),
            alignSelf: 'stretch',
          }}>
          <ModalPicker
            hasBorder={true}
            data={this.state.skills}
            hint={
               strings.skills
            }
            defaultColor={'silver'}
            onSelect={(index, value) => {
              let array=[]
              array.push(value.id)
              InputsObj['skills_ids[]'] = value.id;
            }}
          />
        </View>
        </>
       }
       {UpdateObj&&
        <>
        <Text style={[styles.label, {marginBottom: -hp('2.5%'), marginTop: 6}]}>
          {strings.Languages}
        </Text>
          <View
            style={{
              height: wp('14%'),
              marginTop: hp('2%'),
              alignSelf: 'stretch',
            }}>
            <ModalPicker
              hasBorder={true}
              data={this.state.languages}
              hint={
                strings.Languages
              }
              defaultColor={'silver'}
              onSelect={(index, value) => {
                let array=[]
                array.push(value.id)
                InputsObj['languages_ids[]'] = value.id;
              }}
            />
          </View>
          </>
        }
 {UpdateObj&&
      
          <View style={{width:'100%', marginTop: hp('3%')}}>
            <View style={{width:'100%', flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  color: '#7E7E7E',
                  marginHorizontal: 5,
                  fontFamily: fonts.normal
                }}>
                {`${strings.education}*`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  let arr = this.state.education.slice();
                  arr.push({
                    from: '',
                    to: '',
                    achievements: '',
                    location: '',
                    facility: '',
                    degree: '',
                  });
                  this.setState({education: arr});
                }}>
                <AntDesign name="pluscircle" size={20} color="red" />
              </TouchableOpacity>
            </View>
            
            {this.state.education.map((item, index) => {
              return (
                <Education
                  data={item}
                  index={index}
                  Degrees={this.state.Degrees}
                  onChange={(item1) => {
                    let arr = this.state.education.slice();
                    arr[index] = item1;
                    this.setState({education: arr});
                  }}
                  onDelete={() => {
                    let arr = this.state.education.slice();
                    arr.splice(index, 1);
                    this.setState({education: arr});
                  }}
                />
              );
            })}
          </View>
         }


{UpdateObj&&
          <View style={{marginTop: hp('3%')}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  color: '#7E7E7E',
                  marginHorizontal: 5,
                  marginRight: wp('3%'),
                  fontFamily: fonts.normal
                }}>
                {`${strings.experience}*`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  let arr = this.state.experience.slice();
                  arr.push({
                    from: '',
                    to: '',
                    achievements: '',
                    job_title: '',
                    location: '',
                    facility: '',
                  });
                  this.setState({experience: arr});
                }}>
                <AntDesign name="pluscircle" size={20} color="red" />
              </TouchableOpacity>
            </View>

            {this.state.experience.map((item, index) => {
              return (
                <Experience
                  data={item}
                  index={index}
                  onChange={(item1) => {
                    let arr = this.state.experience.slice();
                    arr[index] = item1;
                    this.setState({experience: arr});
                  }}
                  onDelete={() => {
                    let arr = this.state.experience.slice();
                    arr.splice(index, 1);
                    this.setState({experience: arr});
                  }}
                />
              );
            })}
          </View>
           }
          {UpdateObj&&
          <TouchableOpacity
            onPress={() => {
              this.setState({
                find_collaboration_center:
                  this.state.find_collaboration_center === 1 ? 0 : 1,
              });
            }}>
            <View
              style={{
                marginTop: hp('2%'),
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('90%'),
                height: hp('7%'),
              }}>
              {this.state.find_collaboration_center === 1 ? (
                <AntDesign name="checksquare" color="#39A1F7" size={hp('3%')} />
              ) : (
                <Feather name="square" color="#7E7E7E" size={hp('3%')} />
              )}
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  color: '#7E7E7E',
                  marginHorizontal: 5,
                  fontFamily: fonts.normal
                }}>
                {strings.LookingCooperation}
              </Text>
            </View>
          </TouchableOpacity>
        }


        <AcceptTerms
          checked={this.state.checked}
          onChange={() => {
            if (this.state.checked) {
              this.setState({checked: false});
            } else {
              this.setState({checked: true});
            }
          }}
          onTermsClicked={() => {
            this.setState({showTerms: true});
          }}
        />


      

        <TouchableOpacity
          onPress={() => {
            this.onSubmit({...InputsObj, gender: this.state.gender});
            // this.props.SignUpPost(InputsObj)
          }}
          style={[styles.LoginBTNStyle, {backgroundColor: '#4D75B8'}]}>
          <Text style={styles.NextTxt}>{this.LoginTxt()}</Text>
        </TouchableOpacity>
        <ModalViewTerms
          visible={this.state.showTerms}
          changeState={() => this.setState({showTerms: false})}
        />
      </View>
    );
  }
}

export { EndUserInputs };
const styles = StyleSheet.create({
  RestoreByPhoneOrEmail: {
    //  width: wp('20%'),
    height: hp('4%'),
    flexDirection: 'row',
    marginEnd: wp('2%'),
    alignItems: 'center',
  },
  restoreByPhone: {
    fontFamily: fonts.normal,
  },
  NextTxt: {fontSize: hp('2.5%'), color: 'white'},
  LoginBTNStyle: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#483F8C',
    borderRadius: wp('1%'),
  },
  ThirdMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('4%'),
    height: hp('8%'),
  },
  InputView: {
    borderColor: 'silver',
    // marginTop: hp('2%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
  },
  InputStyle: {
    textAlign: 'center',
    width: wp('17%'),
    height: hp('9%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
  },
  InputStyleNewAccount: {
    // width: wp('85%'),
    flex: 1,
    height: hp('7%'),
    fontSize: hp('1.8%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 10,
    fontFamily: fonts.normal,
  },
  label: {
    fontFamily: fonts.normal,
    fontSize: hp('1.8%'),
    marginBottom: hp('1%'),
    textAlign: 'left',
    marginTop: hp('1%'),
    alignSelf: 'flex-start',
  },
});
