import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import LocalizedStrings from 'react-native-localization';
import ar from './ar';
import en from './en';

let strings = new LocalizedStrings({
  en,
  ar,
});

if (I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  AsyncStorage.getItem('lang').then((lang) => {
    strings.setLanguage('ar');
  });
} else {
  I18nManager.allowRTL(false);
  strings.setLanguage('en');
}

export default strings;
