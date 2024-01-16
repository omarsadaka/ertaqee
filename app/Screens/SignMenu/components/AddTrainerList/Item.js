import React, { useState } from 'react';
import {TouchableOpacity, Text, I18nManager, StyleSheet} from 'react-native';
import {CheckBox} from 'react-native-elements';

const Item = ({id, full_name, onPress,photo}) => {
  const [checked, setChecked] = useState(false);
  return (
    <TouchableOpacity style={styles.container}
    onPress={()=>{
        setChecked(!checked)
        onPress(id, checked, full_name,photo)
      }}>
      <CheckBox
        title=''
        iconRight
        iconType='feather'
        checkedIcon='disc'
        uncheckedIcon='circle'
        checkedColor= {'orange'}
        checked={checked}/>
        <Text style={styles.title}>{full_name}</Text>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: '#39A1F7',
    marginVertical:2,
    marginHorizontal: 7,
    borderRadius: 7
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '200',flex:1,
    textAlign: I18nManager.isRTL?'left':'right',
    marginHorizontal: 10
  },
  
});

export default Item;
