import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import strings from '../../Screens/strings';
import {Colors, Dimensions} from '../../theme';

const TraineeItem = ({onPress, onDelete, onEdit, id ,name,code,mobile,email}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>
      <View>
        <Text style={[styles.text, {fontWeight: 'bold'}]}>{name}</Text>
        <Text style={styles.text}>{code}</Text>
        <Text style={styles.text}>{email}</Text>
        <Text style={styles.text}>{mobile}</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          right: 10,
          top: Dimensions.DEVICE_HEIGHT * 0.02,
          flexDirection: 'row',
          width: Dimensions.DEVICE_WIDTH * 0.14,
          justifyContent: 'space-around',
        }}>
        <Icon
          onPress={onEdit}
          size={Dimensions.DEVICE_HEIGHT * 0.035}
          name="square-edit-outline"
          type="material-community"
          color="#567483"
        />
        <Icon
          onPress={()=>{
            Alert.alert(
              strings.app,
              strings.confirm_delete,
              [
                {
                  text: strings.cancel,
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: strings.ok, onPress: () => onDelete() }
              ]
            );
          }}
          size={Dimensions.DEVICE_HEIGHT * 0.035}
          name="delete"
          color={Colors.red}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.DEVICE_WIDTH * 0.92,
    borderRadius: Dimensions.DEVICE_WIDTH * 0.02,
    paddingVertical: Dimensions.DEVICE_HEIGHT * 0.02,
    flexDirection: 'row',
    paddingHorizontal: Dimensions.DEVICE_WIDTH * 0.02,
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginTop: Dimensions.DEVICE_HEIGHT * 0.015,
    // overflow: 'hidden'
  },
  text: {
    textAlign: 'left',
    fontSize: Dimensions.DEVICE_HEIGHT * 0.022,
    opacity: 0.8,
    marginVertical: Dimensions.DEVICE_HEIGHT * 0.003,
  },
});

export default TraineeItem;
