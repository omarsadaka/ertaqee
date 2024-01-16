import { AppRegistry, LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';
import App from './app/App';

LogBox.ignoreAllLogs(true);

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask(
//   'RNFirebaseBackgroundMessage',
//   () => bgMessaging,
// );
