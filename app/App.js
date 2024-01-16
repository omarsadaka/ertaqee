import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppStack from './AppStack';
const App = () => {
  useEffect(() => {
    // Instabug.init({
    //   token: '8c460b15388dd13749abdc210b15d83f',
    //   invocationEvents: [
    //     InvocationEvent.shake,
    //     InvocationEvent.screenshot,
    //     InvocationEvent.floatingButton,
    //   ],
    // });
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};
export default App;
