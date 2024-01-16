import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import UserProfile from '../../UserProfile';
import { Colors, Dimensions } from '../../theme';
import strings from '../strings';
import fonts from '../../fonts';

const Introduction = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [intro1, setIntro1] = useState(null);
  const [intro2, setIntro2] = useState(null);
  const [intro3, setIntro3] = useState(null);
  const [text, setText] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/home/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log('responseJson intro:', responseJson);
            if (responseJson.success) {
              setLoading(false);
              setData(responseJson.data.ads);
              if (responseJson.data.ads.length == 0) {
                navigation.navigate('Home');
              }
            }
          })
          .catch(error => {
            setLoading(false);
            console.log('Thirderror:' + error);
          });
      });
    } catch (error) {
      setLoading(false);
      console.log('FourthErr:' + error);
    }
  };

  return (
    <View style={styles.container}>
      {/* {loading? <Progress.Bar 
       style={{marginTop:Dimensions.DEVICE_HEIGHT*0.03}}
       progress={0.6} width={Dimensions.DEVICE_WIDTH*0.7} borderWidth={0.5} 
       color={Colors.darkOrage} animated={true} indeterminate={true}/> : null} */}

      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        onIndexChanged={indx => {
          setIndex(indx);
        }}
        index={index}
        dot={
          <View
            style={{
              backgroundColor: Colors.textSubtitle,
              width: 10,
              height: 10,
              borderRadius: 5,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: Dimensions.DEVICE_HEIGHT * 0.04,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: Colors.lightOrage,
              width: 10,
              height: 10,
              borderRadius: 5,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: Dimensions.DEVICE_HEIGHT * 0.04,
            }}
          />
        }>
        {data.map((item, index) => {
          return (
            <View style={styles.slide} key={index}>
              <Text style={styles.title}>
                {UserProfile.getInstance().Lang == 'ar'
                  ? item.title_ar
                  : item.title_en}
              </Text>
              <Image
                source={{uri: item.img}}
                resizeMode="contain"
                style={styles.logo}
              />
              <TouchableOpacity
                style={styles.skip_view}
                onPress={() => navigation.navigate('Home')}>
                <Icon
                  size={Dimensions.DEVICE_HEIGHT * 0.035}
                  name="arrow-right"
                  type="feather"
                  color={Colors.black}
                />
                <Text style={styles.skip}>{strings.skip}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    alignItems: 'center',
  },
  logo: {
    width: Dimensions.DEVICE_WIDTH,
    height: Dimensions.DEVICE_HEIGHT,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  wrapper: {},
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grayLight,
    flex:1,
  },
  title: {
    color: Colors.black,
    fontSize: Dimensions.DEVICE_HEIGHT * 0.035,
    fontWeight: 'bold',
    // position: 'absolute',
    top: Dimensions.DEVICE_HEIGHT * 0.002,
  },
  skip: {
    color: Colors.black,
    fontSize: Dimensions.DEVICE_HEIGHT * 0.03,
    fontWeight: '200',
    marginHorizontal: Dimensions.DEVICE_WIDTH * 0.03,
    fontFamily: fonts.normal
  },
  skip_view: {
    flexDirection:
      UserProfile.getInstance().Lang == 'ar' ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: Dimensions.DEVICE_HEIGHT * 0.08,
    left: Dimensions.DEVICE_WIDTH * 0.03,
  },
});

export default Introduction;
