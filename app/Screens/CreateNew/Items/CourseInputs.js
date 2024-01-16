import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import UserProfile from '../../../UserProfile';
import fonts from '../../../fonts';
import { RadioButton } from '../../common';
import ModalPicker from '../../common/ModalPicker';
import strings from '../../strings';
import Date1 from './Date';
import HallCredences from './HallCredences';

class CourseInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title_en: '',
      selectedLang: [],
      language: [],
      // languages_ids
      loadingFieldsData: false,
      FieldsData: [],
      course_field_id: '',
      loadingTrainingProgramData: false,
      TrainingProgramData: [],
      training_program_id: '',
      number_of_hours: '',
      days_per_week: '',
      individuals_type: '',
      cost: '',
      totalHours: 0,
      totalDays: 0,
      selectedDate: [
        {
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
        },
      ],
      // date,
      offer_cost: '',
      offer_orders_count: '',
      early_cancellation_date: '',
      early_cancellation_time: '',
      late_cancellation_ratio: '',
      image: '',
      AccreditationData: [],
      HallCredences: [
        {
          credence_name: '',
          credence_number: '',
          image: '',
        },
      ],
      // credence,
      loadingAllHall: false,
      AllHall: [],
      hall_id: '',
      hall_title: '',
      loadingAllTrainer: false,
      AllTrainer: [],
      trainer_id: '',
      trainer_name: '',
      target_group: '',
      seats_number: '',
      level: 'junior',
      details_en: '',
      tags: '',
      status: 1,
      evaluate_students: 1,
      certify_students: 1,
      remote: 1,
      remote_url: '',
      FeaturesData: [],
      selectedFeatures: [],
      // features,
      CourseObj: null,
      country: '',
      city: '',
      imageURI: '',
      course_field_name: '',
      training_program_name: '',
    };
  }

  componentDidMount() {
    this.GetAccreditationData();
    this.GetFieldsData();
    this.GetAllHall();
    this.GetFeaturesData();
    this.GetLanguageData();
    this.GetAllTrainer();
    if (this.props.CourseObj)
      this.setStateBasedOnPropsObj(this.props.CourseObj);
    console.log('this.props.CourseObj', this.props.CourseObj);
  }

  setStateBasedOnPropsObj(CourseObj) {
    console.log('CourseObj ', {CourseObj, id: CourseObj.course_field.id});
    this.setState({
      title_en: CourseObj.title ? CourseObj.title : '',
      course_field_id:
        CourseObj.course_field && CourseObj.course_field.id
          ? parseInt(CourseObj.course_field.id)
          : '',
      course_field_name:
        CourseObj.course_field && CourseObj.course_field.title
          ? CourseObj.course_field.title
          : '',
      training_program_id:
        CourseObj.training_program && CourseObj.training_program.id
          ? parseInt(CourseObj.training_program.id)
          : '',
      training_program_name:
        CourseObj.training_program && CourseObj.training_program.title
          ? CourseObj.training_program.title
          : '',
      number_of_hours: CourseObj.number_of_hours
        ? CourseObj.number_of_hours
        : '',
      days_per_week: CourseObj.days_per_week ? CourseObj.days_per_week : '',
      individuals_type:
        CourseObj.individuals_type === 'Men & Women'
          ? 'mix'
          : CourseObj.individuals_type,
      cost: CourseObj.cost ? CourseObj.cost : '',
      offer_cost: CourseObj.offer_cost ? CourseObj.offer_cost : '',
      offer_orders_count: CourseObj.offer_orders_count
        ? CourseObj.offer_orders_count
        : '',
      early_cancellation_date: CourseObj.early_cancellation_date
        ? CourseObj.early_cancellation_date
        : '',
      early_cancellation_time: CourseObj.early_cancellation_time
        ? CourseObj.early_cancellation_time
        : '',
      late_cancellation_ratio: CourseObj.late_cancellation_ratio
        ? CourseObj.late_cancellation_ratio
        : '',
      image: CourseObj.image ? {uri: CourseObj.image} : '',
      imageURI: CourseObj.image ? {uri: CourseObj.image} : '',
      hall_id:
        CourseObj.hall && CourseObj.hall.id ? parseInt(CourseObj.hall.id) : '',
      hall_title: CourseObj.hall_title ? CourseObj.hall_title : '',
      trainer_id:
        CourseObj.trainer && CourseObj.trainer.id
          ? parseInt(CourseObj.trainer.id)
          : '',
      trainer_name: CourseObj.trainer_name ? CourseObj.trainer_name : '',
      target_group: CourseObj.target_group ? CourseObj.target_group : '',
      seats_number: CourseObj.seats_number ? CourseObj.seats_number : '',
      level: CourseObj.level ? CourseObj.level : '',
      details_en: CourseObj.details ? CourseObj.details : '',
      tags: CourseObj.tags ? CourseObj.tags : '',
      status: CourseObj.status ? 1 : 0,
      evaluate_students: CourseObj.evaluate_students ? 1 : 0,
      certify_students: CourseObj.certify_students ? 1 : 0,
      remote: CourseObj.remote ? 1 : 0,
      remote_url: CourseObj.remote_url ? CourseObj.remote_url : '',
      CourseObj: CourseObj,
      selectedDate: CourseObj.date,
    });
    if (CourseObj.credences && CourseObj.credences.length !== 0) {
      let arr = [];
      CourseObj.credences.map(item => {
        arr.push({...item, image: {uri: item.image}});
      });
      this.setState({HallCredences: arr});
    }
    this.setState({
      totalDays: CourseObj.days_per_week,
      totalHours: CourseObj.number_of_hours,
    });
  }

  GetLanguageData() {
    fetch('https://www.demo.ertaqee.com/api/v1/languages', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('languages ', responseJson);
        let arr = [];
        if (
          this.props.CourseObj &&
          this.props.CourseObj.languages_ids &&
          this.props.CourseObj.languages_ids.length !== 0
        ) {
          responseJson.data.map(item => {
            if (
              this.props.CourseObj.languages_ids.indexOf(item.id + '') !== -1
            ) {
              arr.push({id: item.id, select: true});
            } else {
              arr.push({id: item.id, select: false});
            }
          });
        } else {
          responseJson.data.map(item => {
            arr.push({id: item.id, select: false});
          });
        }
        // arr.push({id: -1, select: false});
        this.setState({
          selectedLang: arr,
          language: [
            ...responseJson.data,
            // {name_ar: 'آخري', name_en: 'another', id: -1},
          ],
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetFeaturesData() {
    fetch('https://www.demo.ertaqee.com/api/v1/courses_features', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('getF ', responseJson);
        let arr = [];
        if (
          this.props.CourseObj &&
          this.props.CourseObj.features &&
          this.props.CourseObj.features.length !== 0
        ) {
          responseJson.data.items.map(item => {
            if (this.props.CourseObj.features.indexOf(item.id + '') !== -1) {
              arr.push({id: item.id, select: true});
            } else {
              arr.push({id: item.id, select: false});
            }
          });
        } else {
          responseJson.data.items.map(item => {
            arr.push({id: item.id, select: false});
          });
        }
        // arr.push({id: -1, select: false});
        this.setState({
          selectedFeatures: arr,
          FeaturesData: [
            ...responseJson.data.items,
            // {name_ar: 'آخري', name_en: 'another', id: -1},
          ],
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetAllTrainer() {
    this.setState({loadingAllTrainer: true});
    fetch(
      'https://www.demo.ertaqee.com/api/v1/related_trainers/' +
        `${UserProfile.getInstance().clientObj.user.id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Accept-Language': UserProfile.getInstance().Lang,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('GetAllTrainer ', responseJson);
        this.setState({
          AllTrainer: responseJson.data,
          loadingAllTrainer: false,
        });
      })
      .catch(error => {
        this.setState({loadingAllTrainer: false});
        console.log('123123error:' + error);
      });
  }

  GetAllHall() {
    this.setState({loadingAllHall: true});
    fetch(
      'https://www.demo.ertaqee.com/api/v1/reserved_halls/' +
        `${UserProfile.getInstance().clientObj.user.id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Accept-Language': UserProfile.getInstance().Lang,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('centers ', responseJson);
        this.setState({
          AllHall: responseJson.data.halls,
          loadingAllHall: false,
        });
      })
      .catch(error => {
        this.setState({loadingAllHall: false});
        console.log('123123error:' + error);
      });
  }

  GetFieldsData() {
    this.setState({loadingFieldsData: true});
    fetch('https://www.demo.ertaqee.com/api/v1/courses_fields', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('FieldsData ', responseJson);
        this.setState({
          FieldsData: responseJson.data,
          loadingFieldsData: false,
        });
        if (
          Array.isArray(responseJson.data) &&
          responseJson.data.length !== 0 &&
          !this.props.CourseObj
        ) {
          this.setState({course_field_id: responseJson.data[0].id});
          this.GetTrainingProgramData(responseJson.data[0].id);
        } else if (
          this.props.CourseObj &&
          this.props.CourseObj.course_field &&
          this.props.CourseObj.course_field.id
        ) {
          this.GetTrainingProgramData(this.props.CourseObj.course_field.id);
        }
      })
      .catch(error => {
        this.setState({loadingFieldsData: false});
        console.log('123123error:' + error);
      });
  }
  GetTrainingProgramData(id) {
    this.setState({loadingTrainingProgramData: true});
    fetch(
      'https://www.demo.ertaqee.com/api/v1/training_programs/' +
        `${id ? id : this.state.course_field_id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Accept-Language': UserProfile.getInstance().Lang,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('TrainingProgram ', responseJson);
        this.setState({
          TrainingProgramData: responseJson.data,
          loadingTrainingProgramData: false,
        });
      })
      .catch(error => {
        this.setState({loadingTrainingProgramData: false});
        console.log('123123error23:' + error);
      });
  }
  HallsPicker() {
    let loadingAllHall = this.state.loadingAllHall;
    try {
      if (loadingAllHall)
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
    let AllHall = this.state.AllHall;
    if (AllHall.length !== 0) {
      let PickerItems = [];
      console.log('AllHall omar', AllHall);
      const arrayOfObj = Object.entries(AllHall).map(e => ({
        id: e[0],
        title: e[1],
      }));

      console.log('AllHall omarq', arrayOfObj);
      // PickerItems.push(
      //   <Picker.Item key={-1} label={`${strings.hall}`} value={null} />,
      // );
      // for (let i = 0; i < AllHall.length; i++)
      //   PickerItems.push(
      //     <Picker.Item
      //       key={i}
      //       label={AllHall[i].title}
      //       value={AllHall[i].id}
      //     />,
      //   );
      arrayOfObj?.forEach(element => {
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
            hint={strings.hall}
            onSelect={(index, value) => {
              this.setState({hall_id: value.id});
            }}
          />
        </View>
      );
    }
    return null;
  }

  TrainerPicker() {
    let loadingAllTrainer = this.state.loadingAllTrainer;
    try {
      if (loadingAllTrainer)
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
    let AllTrainer = this.state.AllTrainer;
    if (AllTrainer.length !== 0) {
      let PickerItems = [];

      AllTrainer.forEach(element => {
        const obj = {
          name: element.full_name,
          id: element.id,
        };
        PickerItems.push(obj);
      });

      return (
        <View style={styles.pickerView}>
          <ModalPicker
            hasBorder={true}
            data={PickerItems}
            hint={strings.Trainer}
            onSelect={(index, value) => {
              this.setState({trainer_id: value.id});
            }}
          />
        </View>
      );
    }
    return null;
  }

  FieldsPicker() {
    let loadingFieldsData = this.state.loadingFieldsData;
    try {
      if (loadingFieldsData)
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
    let FieldsData = this.state.FieldsData;
    let PickerItems = [];

    FieldsData.forEach(element => {
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
          hint={
            this.state.course_field_name
              ? this.state.course_field_name
              : strings.ChooseArea
          }
          onSelect={(index, value) => {
            this.setState({
              course_field_id: value.id,
              TrainingProgramData: [],
            });
            this.GetTrainingProgramData(value.id);
          }}
        />
      </View>
    );
  }

  ProgramPicker() {
    let loadingTrainingProgramData = this.state.loadingTrainingProgramData;
    try {
      if (loadingTrainingProgramData)
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
    let TrainingProgramData = this.state.TrainingProgramData;
    let PickerItems = [];

    TrainingProgramData.forEach(element => {
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
          hint={
            this.state.training_program_name
              ? this.state.training_program_name
              : strings.ChooseProgram + ' *'
          }
          onSelect={(index, value) => {
            this.setState({
              training_program_id: value.id,
            });
          }}
        />
      </View>
    );
  }

  CategoryPicker() {
    let PickerItems = [];

    PickerItems.push({
      name: strings.men,
      id: 'men',
    });
    PickerItems.push({
      name: strings.Ladies,
      id: 'women',
    });
    PickerItems.push({
      name: strings.menAndLadies,
      id: 'mix',
    });

    return (
      <View style={styles.pickerView}>
        <ModalPicker
          hasBorder={true}
          data={PickerItems}
          hint={
            this.state.individuals_type
              ? this.state.individuals_type === 'mix'
                ? strings.menAndLadies
                : this.state.individuals_type === 'men'
                ? strings.men
                : this.state.individuals_type === 'women'
                ? strings.Ladies
                : ''
              : strings.Category + ' *'
          }
          onSelect={(index, value) => {
            this.setState({
              individuals_type: value.id,
            });
          }}
        />
      </View>
    );
  }

  GetAccreditationData() {
    fetch('https://www.demo.ertaqee.com/api/v1/courses_credences', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({AccreditationData: responseJson.data});
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  LoginTxt() {
    if (this.props.loading)
      return <ActivityIndicator size="large" color="white" />;
    return (
      <Text style={styles.NextTxt}>
        {this.state.CourseObj && !this.props.Repeat
          ? strings.update
          : strings.signup}
      </Text>
    );
  }

  UploadImages() {
    console.log('UploadImages');
  }

  PickLocation() {
    console.log('PickLocation');
  }

  PickLocation() {
    this.props.PickLoc();
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
          title: strings.alert,
          message: strings.appNeedPhotoPermission,
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

  openImagePicker = img => {
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
          console.log('Success Uploaded', response);
          this.setState({
            imageURI: source,
            image: {
              ...response.assets[0],
              name: response.assets[0].fileName
                ? response.assets[0].fileName
                : 'image',
              type: response.assets[0].type
                ? response.assets[0].type
                : 'image/png',
            },
          });
        }
      }
    });
  };

  handleDatePicked = (event, date) => {
    this.setState({
      isDatePickerVisible: false,
      early_cancellation_date: moment(date).format('YYYY-MM-DD'),
    });
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  DatePickerWindow() {
    if (!this.state.isDatePickerVisible) return;
    var date = new Date();

    return (
      <DateTimePicker
        onChange={this.handleDatePicked}
        minimumDate={date}
        value={date}
      />
    );
  }

  TimePickerWindow() {
    if (!this.state.isTimePickerVisible) return;
    return (
      <DateTimePicker
        onChange={this.handleTimePicked}
        mode="time"
        is24Hour={true}
        value={new Date()}
      />
    );
  }

  handleTimePicked = (event, PickedTime) => {
    this.setState({
      isTimePickerVisible: false,
      early_cancellation_time: moment(PickedTime).format('HH:mm'),
    });
  };

  hideTimePicker = () => {
    this.setState({isTimePickerVisible: false});
  };

  IsThereAnyInputEmpty() {
    let {
      title_en,
      course_field_id,
      number_of_hours,
      days_per_week,
      cost,
      early_cancellation_date,
      early_cancellation_time,
      late_cancellation_ratio,
      seats_number,
      HallCredences,
      selectedLang,
      individuals_type,
      selectedFeatures,
      hall_title,
      training_program_id,
      details_en,
      target_group,
      totalDays,
      totalHours,
    } = this.state;
    console.log(
      '🚀 ~ file: CourseInputs.js:811 ~ CourseInputs ~ IsThereAnyInputEmpty ',
      '\ncourse_field_id => ' + course_field_id,
      '\nnumber_of_hours => ' + totalHours,
      '\ndays_per_week => ' + totalDays,
      '\ncost => ' + cost,
      '\nearly_cancellation_date => ' + early_cancellation_date,
      '\nearly_cancellation_time => ' + early_cancellation_time,
      '\nlate_cancellation_ratio => ' + late_cancellation_ratio,
      '\nseats_number => ' + seats_number,
      '\nHallCredences => ' + HallCredences,
      '\nselectedLang => ' + selectedLang,
      '\nindividuals_type => ' + individuals_type,
      '\nselectedFeatures => ' + selectedFeatures,
      '\nhall_title => ' + hall_title,
      '\ntraining_program_id => ' + training_program_id,
      '\ndetails_en => ' + details_en,
      '\ntarget_group => ' + target_group,
    );
    try {
      return (
        title_en.length === 0 ||
        selectedLang.length === 0 ||
        course_field_id.length === 0 ||
        individuals_type.length === 0 ||
        totalDays.length === 0 ||
        totalHours.length === 0 ||
        selectedFeatures.length === 0 ||
        early_cancellation_date.length === 0 ||
        early_cancellation_time.length === 0 ||
        late_cancellation_ratio.length === 0 ||
        cost.length === 0 ||
        hall_title.length === 0 ||
        target_group.length === 0 ||
        training_program_id.length === 0 ||
        details_en.length === 0 ||
        HallCredences.length === 0 ||
        seats_number.length === 0
      );
    } catch {
      return true;
    }
  }
  onSubmit() {
    if (this.IsThereAnyInputEmpty()) {
      alert('الحقول * مطلوبة');
      return;
    }
    let {
      title_en,
      selectedLang,
      // languages_ids
      course_field_id,
      training_program_id,
      individuals_type,
      cost,
      selectedDate,
      // date,
      offer_cost,
      offer_orders_count,
      early_cancellation_date,
      early_cancellation_time,
      late_cancellation_ratio,
      image,
      HallCredences,
      // credence,
      hall_id,
      hall_title,
      trainer_id,
      trainer_name,
      target_group,
      seats_number,
      level,
      details_en,
      tags,
      status,
      evaluate_students,
      certify_students,
      remote,
      remote_url,
      selectedFeatures,
      // features,
      totalDays,
      totalHours,
      days_per_week
    } = this.state;

    let data = {
      title_en,
      course_field_id,
      number_of_hours: moment.utc(totalHours).format('HH:mm'),
      days_per_week: days_per_week,
      cost,
      early_cancellation_date,
      early_cancellation_time,
      late_cancellation_ratio,
    };
    if (selectedLang && selectedLang.length !== 0) {
      let i = 0;
      selectedLang.map(item => {
        if (item.select) {
          data[`languages_ids[${i}]`] = item.id;
          i++;
        }
      });
    }
    if (training_program_id) {
      data.training_program_id = training_program_id;
    }
    if (individuals_type) {
      data.individuals_type = individuals_type;
    }
    if (selectedDate && selectedDate.length !== 0) {
      let arr = [];
      selectedDate.map((item, index) => {
        arr.push({
          start_date: moment(item.fromDate).format('YYYY-MM-DD'),
          end_date: moment(item.toDate).format('YYYY-MM-DD'),
          start_time: moment(item.fromTime).format('HH:mm'),
          end_time: moment(item.toTime).format('HH:mm'),
        });
      });
      arr.length !== 0 ? (data.date = JSON.stringify(arr)) : null;
    }
    if (offer_cost) {
      data.offer_cost = offer_cost;
    }
    if (offer_orders_count) {
      data.offer_orders_count = offer_orders_count;
    }
    if (image && image.type) {
      data.image = image;
    }
    if (HallCredences && HallCredences.length !== 0) {
      HallCredences.map((item, index) => {
        if (item.credence_name && item.credence_number && item.image) {
          if (item.credence_name) {
            data[`credence[${index}][credence_name]`] = item.credence_name;
          }
          if (item.credence_number) {
            data[`credence[${index}][credence_number]`] = item.credence_number;
          }
          if (item.image && item.image.type) {
            data[`credence[${index}][image]`] = item.image;
          }
        }
      });
    }
    if (hall_id) {
      data.hall_id = hall_id;
    }
    if (hall_title) {
      data.hall_title = hall_title;
    }
    if (trainer_id) {
      data.trainer_id = trainer_id;
    }
    if (trainer_name) {
      data.trainer_name = trainer_name;
    }
    if (target_group) {
      data.target_group = target_group;
    }
    if (seats_number) {
      data.seats_number = seats_number;
    }
    if (level) {
      data.level = level;
    }
    if (details_en) {
      data.details_en = details_en;
      data.details_ar = details_en;
    }
    if (tags) {
      data.tags = tags;
    }
    data.status = status ? 1 : 0;
    data.evaluate_students = evaluate_students ? 1 : 0;
    data.certify_students = certify_students ? 1 : 0;
    data.remote = remote ? 1 : '0';
    if (remote_url) {
      data.remote_url = remote_url;
    }
    if (selectedFeatures && selectedFeatures.length !== 0) {
      let i = 0;
      selectedFeatures.map(item => {
        if (item.select) {
          data[`features[${i}]`] = item.id;
          i++;
        }
      });
    }

    console.log(
      '🚀 ~ file: CourseInputs.js:1021 ~ CourseInputs ~ onSubmit ~ data:',
      data,
    );

    // CurrentIdex: 0,
    // HallObj: null,
    this.props.CreateNewPost(data, 1);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          marginHorizontal: 15,
          width: wp('95%'),
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.username.focus()}>
          <View style={styles.InputView}>
            <TextInput
              ref={input => (this.username = input)}
              onChangeText={text => this.setState({title_en: text})}
              value={this.state.title_en}
              placeholder={`${strings.CourseTitle} *`}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            marginTop: hp('2.5%'),
            marginHorizontal: 15,
            width: wp('90%'),
          }}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              color: '#7E7E7E',
              marginHorizontal: 5,
            }}>
            {`${strings.Languages} *`}
          </Text>
        </View>

        <View
          style={{
            alignSelf: 'center',
            flexWrap: 'wrap',
            width: wp('90%'),
            flexDirection: 'row',
            marginVertical: 10,
          }}>
          {this.state.language.map((item, index) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  let arr = this.state.selectedLang.slice();
                  arr[index].select = !arr[index].select;
                  this.setState({selectedLang: arr});
                }}>
                <View style={{flexDirection: 'row', margin: 5}}>
                  {this.state.selectedLang[index].select ? (
                    <AntDesign name="checksquare" color={'#39A1F7'} size={18} />
                  ) : (
                    <Feather name="square" color={'#7E7E7E'} size={18} />
                  )}
                  <Text
                    style={[
                      styles.NextTxt,
                      {
                        color: this.state.selectedLang[index].select
                          ? '#39A1F7'
                          : '#7E7E7E',
                        marginLeft: 5,
                      },
                    ]}>
                    {I18nManager ? item.title_ar : item.title_en}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        {this.FieldsPicker()}

        {this.ProgramPicker()}

        {this.CategoryPicker()}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.password.focus()}>
          <View style={styles.InputView}>
            <TextInput
              ref={input => (this.password = input)}
              onChangeText={text => this.setState({cost: text})}
              value={this.state.cost + ''}
              placeholder={`${strings.cost1} *`}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <View style={{marginTop: hp('2%'), jus: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: hp('2%'),
                color: '#7E7E7E',
                marginHorizontal: 5,
              }}>
              {`${strings.DateTime}`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                let arr = this.state.selectedDate.slice();
                arr.push({
                  start_date: '',
                  end_date: '',
                  start_time: '',
                  end_time: '',
                });
                this.setState({selectedDate: arr});
              }}>
              <AntDesign name="pluscircle" size={20} color="#39A1F7" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 30}}
              onPress={() => {
                let hours0 = 0;
                let days0 = 0;

                const arr = this.state.selectedDate.slice();

                arr.forEach((item, index) => {
                  console.log(
                    '🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ file: CourseInputs.js:1206 ~ CourseInputs ~ arr.forEach ~ index:',
                    index,
                  );
                  const startDate = moment(item.fromDate);
                  const endDate = moment(item.toDate);
                  const days = parseInt(endDate.diff(startDate, 'days')) + 1;
                  const startTime = moment(item.fromTime, 'HH:mm:ss');
                  console.log(
                    '🚀 ~ file: CourseInputs.js:1191 ~ CourseInputs ~ arr.forEach ~ startTime:',
                    startTime,
                  );
                  const endTime = moment(item.toTime, 'HH:mm:ss');
                  console.log(
                    '🚀 ~ file: CourseInputs.js:1193 ~ CourseInputs ~ arr.forEach ~ endTime:',
                    endTime,
                  );
                  const hours = Math.abs(parseInt(endTime.diff(startTime)));
                  console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~   hours:', hours);
                  days0 = days0 + days;
                  hours0 = hours0 + hours * days;
                });
                this.setState({
                  totalDays: days0,
                  totalHours: hours0,
                });
              }}>
              <Text
                style={{color: '#39A1F7', fontSize: 16, fontWeight: 'bold'}}>
                {`${strings.save} ${strings.DateTime}`}
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.selectedDate.map((item, index) => {
            // console.log('🚀 ~ file: item:', item);
            return (
              <Date1
                key={index}
                data={item}
                previousStartDate={this.state.previousStartDate}
                index={index}
                onChange={item1 => {
                  console.log(
                    '🚀 ~ file:  item1: len =================================',
                    item1,
                  );
                  let arr = this.state.selectedDate.slice();
                  if (item1.changedInput === 'fromDate') {
                    // if (item1.toDate) {
                    //   delete item1.toDate;
                    // }
                    arr[index] = item1;
                  }
                  if (item1.changedInput === 'fromTime') {
                    // if (item1.toTime) {
                    //   delete item1.toTime;
                    // }
                    arr[index] = item1;
                  }
                  if (item1.changedInput === 'toDate') {
                    arr[index] = item1;
                  }
                  if (item1.changedInput === 'toTime') {
                    arr[index] = item1;
                  }

                  if (
                    item1.fromDate &&
                    item1.toDate &&
                    item1.fromTime &&
                    item1.toTime
                  ) {
                    // this.setState({
                    //   totalDays: 0,
                    //   days_per_week: 0,
                    //   totalHours: 0,
                    //   number_of_hours: 0,
                    // });
                    // const startDate = moment(item1.fromDate);
                    // const endDate = moment(item1.toDate);
                    // const days = parseInt(endDate.diff(startDate, 'days')) + 1;
                    // const startTime = moment(item1.fromTime, 'HH:mm:ss a');
                    // const endTime = moment(item1.toTime, 'HH:mm:ss a');
                    // const hours = parseInt(endTime.diff(startTime));
                    // console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~   hours:', hours);
                    // this.setState({
                    //   totalDays: days + this.state.totalDays,
                    //   days_per_week: days + this.state.totalDays,
                    //   totalHours: hours * days + this.state.totalHours,
                    //   number_of_hours: moment
                    //     .utc(hours + this.state.totalHours)
                    //     .format('HH:mm'),
                    // });
                  }
                  const date = new Date(item1.toDate ?? item1.fromDate);

                  date.setDate(date.getDate() + 1);
                  this.setState({
                    selectedDate: arr,
                    previousStartDate: date,
                  });
                }}
                onDelete={() => {
                  let arr = this.state.selectedDate.slice();
                  let item1 = arr[index];
                  const startDate = moment(item1.fromDate);
                  const endDate = moment(item1.toDate);
                  const days = parseInt(endDate.diff(startDate, 'days')) + 1;
                  const startTime = moment(item1.fromTime, 'HH:mm:ss a');
                  const endTime = moment(item1.toTime, 'HH:mm:ss a');
                  const hours = parseInt(endTime.diff(startTime));
                  console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~   hours:', hours);

                  this.setState({
                    totalDays: this.state.totalDays - days,
                    totalHours: this.state.totalHours - hours * days,
                  });

                  arr.splice(index, 1);

                  if (index === 0 && arr.length === 0) {
                    arr.push({
                      start_date: '',
                      end_date: '',
                      start_time: '',
                      end_time: '',
                    });
                  }
                  this.setState({selectedDate: arr});
                }}
              />
            );
          })}
        </View>

        <Text
          style={{
            fontSize: hp('2%'),
            color: '#7E7E7E',
            marginTop: hp('2%'),
            marginLeft: 15,
            alignSelf: 'flex-start',
          }}>
          {`${strings.TheNumberHours}`}
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.number_of_hours.focus()}>
          <View style={styles.InputView}>
            <TextInput
              ref={input => (this.number_of_hours = input)}
              onChangeText={text => this.setState({number_of_hours: text})}
              value={
                this.state.number_of_hours
                  ? this.state.number_of_hours
                  : this.state.totalHours > 0
                  ? moment.utc(this.state.totalHours).format('HH:mm') + ''
                  : ''
              }
              // editable={false}
              placeholder={`${strings.TheNumberHours} *`}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: hp('2%'),
            color: '#7E7E7E',
            marginTop: hp('2%'),
            marginLeft: 15,
            alignSelf: 'flex-start',
          }}>
          {`${strings.TheNumberDays}`}
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.first_name.focus()}>
          <View style={styles.InputView}>
            <TextInput
              ref={input => (this.first_name = input)}
              onChangeText={text => this.setState({days_per_week: text})}
              value={this.state.days_per_week > 0 ? this.state.days_per_week + '' : ''}
              // editable={false}
              placeholder={`${strings.TheNumberDays} *`}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.password_confirmation1.focus()}>
          <View style={styles.InputView}>
            <TextInput
              ref={input => (this.password_confirmation1 = input)}
              onChangeText={text => this.setState({offer_cost: text})}
              placeholder={`${strings.discountDay}`}
              placeholderTextColor={'gray'}
              value={this.state.offer_cost + ''}
              keyboardType="numeric"
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.password_confirmation2.focus()}>
          <View style={styles.InputView}>
            <TextInput
              ref={input => (this.password_confirmation2 = input)}
              onChangeText={text => this.setState({offer_orders_count: text})}
              placeholder={`${strings.numberDaysDiscount}`}
              placeholderTextColor={'gray'}
              value={this.state.offer_orders_count + ''}
              keyboardType="numeric"
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.setState({
              isDatePickerVisible: true,
            });
          }}>
          <View style={styles.InputView}>
            <Text
              style={{
                fontSize: hp('2%'),
                color: '#7E7E7E',
                marginHorizontal: 10,
              }}>
              {this.state.early_cancellation_date
                ? this.state.early_cancellation_date
                : `${strings.EarlyCancellationDate} *`}
            </Text>
          </View>
        </TouchableOpacity>
        {this.DatePickerWindow()}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.setState({
              isTimePickerVisible: true,
            });
          }}>
          <View style={styles.InputView}>
            <Text
              style={{
                fontSize: hp('2%'),
                color: '#7E7E7E',
                marginHorizontal: 10,
              }}>
              {this.state.early_cancellation_time
                ? this.state.early_cancellation_time
                : `${strings.EarlyCancellationTime} *`}
            </Text>
          </View>
        </TouchableOpacity>
        {this.TimePickerWindow()}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text =>
                this.setState({late_cancellation_ratio: text})
              }
              placeholder={`${strings.DeductionForLateCancellation} *`}
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={this.state.late_cancellation_ratio + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.PickPhoto()}>
          <View style={styles.InputView}>
            <Text
              style={[
                styles.restoreByPhone,
                {marginHorizontal: 10, fontFamily: fonts.normal},
              ]}>
              {`${strings.AttachTheCourseAnnouncement} *`}
            </Text>
          </View>
        </TouchableOpacity>
        {this.state.image ? (
          <View style={[styles.InputView, {height: hp(20)}]}>
            <Image
              source={this.state.imageURI}
              style={{height: hp(20), width: wp('90%')}}
              resizeMode="stretch"
            />
          </View>
        ) : null}

        <View style={{marginTop: hp('2%'), alignSelf: 'flex-start'}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: hp('2%'),
                color: '#7E7E7E',
                marginHorizontal: 5,
              }}>
              {`${strings.CourseCredits}`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                let arr = this.state.HallCredences.slice();
                arr.push({
                  credence_name: '',
                  credence_number: '',
                  image: '',
                });
                this.setState({HallCredences: arr});
              }}>
              <AntDesign name="pluscircle" size={20} color="#39A1F7" />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.HallCredences.map((item, index) => {
          return (
            <HallCredences
              data={item}
              index={index}
              AccreditationData={this.state.AccreditationData}
              onChange={item1 => {
                console.log('item1 item1 item1', item1);
                let arr = this.state.HallCredences.slice();
                arr[index] = item1;
                this.setState({HallCredences: arr});
              }}
              onDelete={() => {
                let arr = this.state.HallCredences.slice();
                arr.splice(index, 1);
                this.setState({HallCredences: arr});
              }}
            />
          );
        })}

        {this.HallsPicker()}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.username.focus()}>
          <View style={styles.InputView}>
            <TextInput
              ref={input => (this.username = input)}
              onChangeText={text => this.setState({hall_title: text})}
              value={this.state.hall_title}
              placeholder={`${strings.HallName} *`}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        {this.TrainerPicker()}

        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({trainer_name: text})}
              value={this.state.trainer_name}
              placeholder={`${strings.TrainerName}`}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({target_group: text})}
              value={this.state.target_group}
              placeholder={strings.TargetGroup + ' *'}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({seats_number: text})}
              value={this.state.seats_number + ''}
              placeholder={strings.NumberAvailable + ' *'}
              keyboardType="numeric"
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <View
          style={[
            styles.InputView,
            {
              justifyContent: 'space-between',
              backgroundColor: '#F2F2F2',
              borderWidth: 0,
            },
          ]}>
          <View>
            <Text>{strings.theLevel} </Text>
          </View>
          <View style={{flexDirection: 'row', width: wp('60%')}}>
            <TouchableOpacity
              onPress={() => this.setState({level: 'junior'})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={this.state.level === 'junior'}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.junior} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({level: 'average'})}
              style={[styles.RestoreByPhoneOrEmail, {marginHorizontal: 10}]}>
              <RadioButton
                selected={this.state.level === 'average'}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.Average}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({level: 'advanced'})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={this.state.level === 'advanced'}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.advanced}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({details_en: text})}
              placeholder={strings.DescriptionDetails + ' *'}
              placeholderTextColor={'gray'}
              value={this.state.details_en + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({tags: text})}
              placeholder={strings.keywords}
              placeholderTextColor={'gray'}
              value={this.state.tags + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        {/* /// */}

        <View
          style={[
            styles.InputView,
            {
              justifyContent: 'space-between',
              backgroundColor: '#F2F2F2',
              borderWidth: 0,
            },
          ]}>
          <View>
            <Text>{strings.status} </Text>
          </View>
          <View style={{flexDirection: 'row', width: wp('60%')}}>
            <TouchableOpacity
              onPress={() => this.setState({status: 1})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={this.state.status == 1}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.available} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({status: 0})}
              style={[styles.RestoreByPhoneOrEmail, {marginHorizontal: 10}]}>
              <RadioButton
                selected={this.state.status == 0}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.notAvailable}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.InputView,
            {
              justifyContent: 'space-between',
              backgroundColor: '#F2F2F2',
              borderWidth: 0,
            },
          ]}>
          <View>
            <Text>{strings.studentEvalute} </Text>
          </View>
          <View style={{flexDirection: 'row', width: wp('50%')}}>
            <TouchableOpacity
              onPress={() => this.setState({evaluate_students: true})}
              style={[styles.RestoreByPhoneOrEmail]}>
              <RadioButton
                selected={this.state.evaluate_students}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.yes} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({evaluate_students: false})}
              style={[styles.RestoreByPhoneOrEmail, {marginHorizontal: 10}]}>
              <RadioButton
                selected={!this.state.evaluate_students}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.no}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.InputView,
            {
              justifyContent: 'space-between',
              backgroundColor: '#F2F2F2',
              borderWidth: 0,
            },
          ]}>
          <View>
            <Text>{strings.thereIsCertificate} </Text>
          </View>
          <View style={{flexDirection: 'row', width: wp('50%')}}>
            <TouchableOpacity
              onPress={() => this.setState({certify_students: true})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={this.state.certify_students}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.yes} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({certify_students: false})}
              style={[styles.RestoreByPhoneOrEmail, {marginHorizontal: 10}]}>
              <RadioButton
                selected={!this.state.certify_students}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.no}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.InputView,
            {
              justifyContent: 'space-between',
              backgroundColor: '#F2F2F2',
              borderWidth: 0,
            },
          ]}>
          <View>
            <Text>{strings.remoteCourse} </Text>
          </View>
          <View style={{flexDirection: 'row', width: wp('50%')}}>
            <TouchableOpacity
              onPress={() => this.setState({remote: 1})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={this.state.remote == 1}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.yes} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({remote: 0})}
              style={[styles.RestoreByPhoneOrEmail, {marginHorizontal: 10}]}>
              <RadioButton
                selected={this.state.remote == 0}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.no}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({remote_url: text})}
              value={this.state.remote_url}
              placeholder={strings.courseLink}
              placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginTop: hp('2.5%'),
            marginHorizontal: 15,
            width: wp('90%'),
          }}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              color: '#7E7E7E',
              marginHorizontal: 5,
              textAlign: 'left',
            }}>
            {`${strings.CourseFeatures} *`}
          </Text>
        </View>

        {this.state.FeaturesData && this.state.FeaturesData.length !== 0 ? (
          <View
            style={{
              alignSelf: 'center',
              flexWrap: 'wrap',
              width: wp('90%'),
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            {this.state.FeaturesData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let arr = this.state.selectedFeatures.slice();
                    arr[index].select = !arr[index].select;
                    this.setState({selectedFeatures: arr});
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 5,
                      alignItems: 'center',
                    }}>
                    {this.state.selectedFeatures[index].select ? (
                      <AntDesign
                        name="checksquare"
                        color={'#39A1F7'}
                        size={18}
                      />
                    ) : (
                      <Feather name="square" color={'#7E7E7E'} size={18} />
                    )}
                    <Text
                      style={[
                        styles.NextTxt,
                        {
                          color: this.state.selectedFeatures[index].select
                            ? '#39A1F7'
                            : '#7E7E7E',
                          marginLeft: 5,
                        },
                      ]}>
                      {I18nManager ? item.name_ar : item.name_en}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            this.onSubmit();
          }}
          style={[styles.LoginBTNStyle, {backgroundColor: '#4D75B8'}]}>
          <Text style={styles.NextTxt}>{this.LoginTxt()}</Text>
        </TouchableOpacity>

        {/* {this.DatePickerWindow()}
        {this.TimePickerWindow()} */}
      </View>
    );
  }
}

export { CourseInputs };
const styles = StyleSheet.create({
  restoreByPhone: {fontSize: hp('2%'), color: '#483F8C'},
  RestoreByPhoneOrEmail: {height: hp('4%'), flexDirection: 'row'},
  NextTxt: {fontSize: hp('2.5%'), color: 'white'},
  LoginBTNStyle: {
    marginTop: hp('3%'),
    marginBottom: hp('5%'),
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
  pickerView: {
    marginTop: hp('2%'),
    height: hp('7%'),
    alignSelf: 'stretch',
    marginHorizontal: wp('2.5%'),
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
    width: wp('85%'),
    height: hp('7%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 5,
  },
});
