import React, { Component } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import List from '../../res/list.svg';
import Seminar from '../../res/seminar.svg';
import Teacher from '../../res/teacher.svg';
import strings from '../strings';

class BottomMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offsetY: new Animated.Value(0),
    };
  }

  ShowOrHide(UpOrDown) {
    if (UpOrDown)
      Animated.timing(this.state.offsetY, {
        toValue: hp('-20%'),
        duration: 500,
        useNativeDriver: false,
      }).start();
    else
      Animated.timing(this.state.offsetY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
  }

  NavToThis(NavMenu, SubData, Title) {
    if (NavMenu == 'NewCourses')
      this.props.navigation.navigate('NewCourses', {
        Title: strings.addedCourses,
        IsMiddleTitle: strings.courses,
        ShowFloatingBTN: false,
        ShowBottomMenu: true,
        Filter: false,
      });
    else if (NavMenu == 'TrainingCenters')
      this.props.navigation.navigate('TrainingCenters', {
        Title: Title,
        SubTitle: SubData,
        NavTitle: 'halls',
      });
    else this.props.navigation.navigate(NavMenu);
  }

  NavToServices() {
    // this.props.navigation.navigate('MoreOptions');
    this.props.navigation.navigate('ContactUs', {
      title: 'bbbbbbb',
      IsAsk: true,
    });
    return; //T,
  }

  render() {
    let IsHallProvider = UserProfile.getInstance().IsHallProvider();
    if (IsHallProvider) return <View />;

    const {ScrollingDir} = this.props;

    if (ScrollingDir) this.ShowOrHide(false);
    else this.ShowOrHide(true);

    return (
      <Animated.View style={[styles.footer, {bottom: this.state.offsetY}]}>
        {/* <TouchableOpacity onPress={()=>this.NavToThis('Home')} style={styles.homeContainer}>
        <Image source={require('../../res/homebtn.png')} style={styles.homeBtn}/>
      </TouchableOpacity> */}

        <ImageBackground
          source={require('../../res/footer.png')}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0,
            width: wp('100%'),
            height: hp('10%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => this.NavToThis('NewCourses')}
            style={styles.footertab}>
            <Seminar style={styles.imgtab} />
            <Text style={styles.tabtxt}>{strings.courses}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.NavToServices()}
            style={styles.footertab}>
            <Icon
              name="person"
              size={22}
              style={[styles.imgtab, {height: hp('2.25%')}]}
              color={'#5B739F'}
            />
            <Text style={styles.tabtxt}>{strings.consultants}</Text>
          </TouchableOpacity>
          <View style={{height: hp('8.5%'), width: wp('20%')}} />

          <TouchableOpacity
            onPress={() =>
              this.NavToThis('TrainingCenters', strings.halls, strings.halls)
            }
            style={styles.footertab}>
            <Teacher style={styles.imgtab} />
            <Text style={styles.tabtxt}>{strings.halls}</Text>
          </TouchableOpacity>

          {/* {this.SideItem(
          strings.trainers,
          require('../../res/brain.png'),
          'MoreOptions',
          'ContactUs',
        )} */}

          <TouchableOpacity
            onPress={() => this.NavToThis('Reservations')}
            style={styles.footertab}>
            <List style={styles.imgtab} />
            <Text style={styles.tabtxt}>{strings.reservations}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.NavToThis('Home')}
            style={styles.homeContainer}>
            <Image
              source={require('../../res/homebtn.png')}
              style={styles.homeBtn}
            />
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  tabtxt: {
    fontSize: hp('1.4%'),
    color: '#4D75B8',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  imgtab: {
    width: wp('20%'),
    resizeMode: 'contain',
    height: hp('3%'),
    tintColor: '#4D75B8',
  },
  footertab: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('8.5%'),
    width: wp('20%'),
  },
  footer: {
    width: wp('100%'),
    alignItems: 'center',
    position: 'absolute',
    height: hp('16%'),
    // marginBottom: hp('3%'),
  },
  homeBtn: {width: wp('18%'), resizeMode: 'contain', height: hp('10%')},
  homeContainer: {
    width: wp('18%'),
    height: hp('10%'),
    position: 'absolute',
    bottom: hp('4.5%'),
  },
});

export { BottomMenu };

