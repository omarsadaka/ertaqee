import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import UserProfile from '../../UserProfile';
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentScrollIndex: 0,
      loading: true,
      WelcomeShowed: true,
    };
  }

  componentWillMount() {
    //  UserProfile.getInstance().RemoveUserObj();//T,
    // this.IsWelcomeShowed();
    this.RetriveUserCreds();
  }

  async IsWelcomeShowed() {
    await AsyncStorage.getItem('WelcomeShowed', (err, result) => {
      if (result != null) {
        console.log('WelcomeShowed');
        this.setState({WelcomeShowed: true, loading: true});
      } else {
        this.setState({WelcomeShowed: false, loading: false});
      }
    });
  }

  async RetriveUserCreds() {
    await AsyncStorage.getItem('UserCreds')
      .then(json => {
        if (json && json.length > 5) {
          // alert('Here');
          // console.log('json omar', json)
          UserProfile.getInstance().UserCreds = JSON.parse(json);
          this.ToSignMenu();
        } else {
          // alert('else');
          if (this.state.WelcomeShowed) this.LetsStartBTN();
          else this.setState({loading: false});
        }
      })
      .catch(err => {
        console.log('err:' + err);
        if (this.state.WelcomeShowed) this.LetsStartBTN();
        else this.setState({loading: false});
      });
  }

  async LetsStartBTN() {
    // console.log('LetsStartBTN');
    await AsyncStorage.setItem('WelcomeShowed', 'true');
    this.ToSignMenu();
  }

  ToSignMenu() {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'SignMenu'}],
    });
    console.log('resetAction', resetAction);
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate('SignMenu')
  }

  render() {
    return <View />;
  }
}
export default Welcome;
