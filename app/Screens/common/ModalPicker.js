import React, { useEffect, useState } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { Icon, colors } from 'react-native-elements';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SelectDropdown from 'react-native-select-dropdown';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';

const ModalPicker = props => {
  const {data, data1, hint, defaultColor, onSelect, hasBorder = true} = props;
  const [color, setColor] = useState(defaultColor);
  const [options, setOptions] = useState(data);
  const rtl = UserProfile.getInstance().Lang === 'ar';

  useEffect(() => {
    setOptions(data);
  }, [data]);

  return (
    <View
      style={
        {
          // flex: 1,
          // marginHorizontal: '5%',
        }
      }

      // style={[
      //   styles.spinner,
      //   {
      //     backgroundColor: '#fff',
      //     borderWidth: hasBorder ? 1 : 0,
      //     marginTop: hasBorder ? 7 : 0,
      //   },
      // ]}
    >
      <SelectDropdown
        data={options}
        onSelect={(selectedItem, index) => {
          onSelect(index, selectedItem);
        }}
        defaultButtonText={hint}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem.name;
        }}
        rowTextForSelection={(item, index) => {
          return item.name;
        }}
        buttonStyle={{
          backgroundColor: '#fff',
          borderRadius: hasBorder ? 10 : 0,
          // marginTop: 10,
          borderWidth: hasBorder ? 1 : 0,
          width: '100%',
          // flex: 1,
          alignSelf: 'center',
          borderColor: 'silver',
        }}
        buttonTextStyle={{
          textAlign: rtl ? 'right' : 'left',
          fontFamily: fonts.normal,
          flex: 0,
          fontSize: 16,
          color: 'grey',
        }}
        renderDropdownIcon={isOpened => {
          return (
            <Icon
              name={isOpened ? 'chevron-up' : 'chevron-down'}
              color={'#444'}
              type="feather"
              size={20}
              marginRight={5}
            />
          );
        }}
        // dropdownIconPosition={rtl ? 'left' : 'right'}
        dropdownStyle={{
          backgroundColor: 'white',
          borderRadius: 15,
          marginTop: 8,
        }}
        // dropdownOverlayColor={'transparent'}
        rowStyle={
          {
            // borderBottomWidth: 0,
          }
        }
        selectedRowStyle={{
          backgroundColor: colors.primary,
        }}
        rowTextStyle={{
          fontFamily: fonts.normal,
        }}
      />
      {/* <ModalDropdown
        options={options}
        style={{flex: 1, marginHorizontal: '3%'}}
        textStyle={[styles.spiner_text, {color: 'gray'}]}
        // defaultIndex={}
        defaultValue={hint}
        dropdownStyle={styles.dropdown_style}
        dropdownTextStyle={styles.label_style}
        dropdownTextHighlightStyle={styles.label_style}
        adjustFrame={() => {
          return {
            width: '100%',
            height: '50%',
            position: 'absolute',
            bottom: 0,
          };
        }}
        renderRow={(option, index, isSelected) => {
          console.log(
            '🚀 ~ file: ModalPicker.js:38 ~ ModalPicker ~ option:',
            option,
          );
          let IsAr = UserProfile.getInstance().Lang === 'ar';
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: Platform.OS == 'android' ? '#fff' : null,
              }}>
              <Text style={styles.spiner_label}>{option.name}</Text>
              {isSelected ? (
                <Icon
                  style={{margin: 12}}
                  name="check"
                  size={24}
                  color="#49A0E3"
                />
              ) : null}
            </View>
          );
        }}
        renderButtonText={rowData => rowData.name} // ba3d ma t5tar
        onSelect={(index, value) => {
          onSelect(index, value);
          setColor('#000');
        }}
      />
      <Icon name="chevron-down" type="feather" size={15} color={'grey'} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  label_style: {
    fontSize: 20,
    fontWeight: '200',
    height: hp('5%'),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: fonts.normal,
  },
  spiner_text: {
    fontSize: 17,
    fontWeight: '200',
    // color: '#000',
    textAlign: I18nManager.isRTL ? 'left' : 'right',
    fontFamily: fonts.normal,
  },
  spinner: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    height: '100%',
    borderRadius: 10,
    paddingHorizontal: 5,
    borderColor: 'silver',
  },
  dropdown_style: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 2,
    paddingBottom: 4,
    overflow: 'hidden',
  },
  spiner_label: {
    margin: '3%',
    fontSize: 16,
    paddingHorizontal: 5,
    fontFamily: fonts.normal,
    color: 'black',
    backgroundColor: 'red',
  },
});
export default ModalPicker;
