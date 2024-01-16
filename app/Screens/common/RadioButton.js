import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
const ScreenWidth = Dimensions.get('window').width;

function RadioButton(props) {
  return (
    <View style={[styles.MainView, {borderColor: props.color}, props.style]}>
      {props.selected ? (
        <View style={[styles.SelectedView, {backgroundColor: props.color}]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  MainView: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SelectedView: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});

export { RadioButton };

