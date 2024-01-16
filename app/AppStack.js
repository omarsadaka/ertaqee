import { createNativeStackNavigator } from '@react-navigation/native-stack';

import About from './Screens/About/About';
import Ads from './Screens/Ads/Ads';
import BuySub from './Screens/BuySub/BuySub';
import CenterDetails from './Screens/CenterDetails/CenterDetails';
import { ChangeLanguage } from './Screens/ChangeLanguage/ChangeLanguage';
import ChangePasswords from './Screens/ChangePasswords/ChangePasswords';
import Chat from './Screens/Chat/Chat';
import CoachDetails from './Screens/CoachDetails/CoachDetails';
import Coaches from './Screens/Coaches/Coaches';
import CourseCart from './Screens/CourseCart/CourseCart';
import CourseDetails from './Screens/CourseDetails/CourseDetails';
import CourseRequest from './Screens/CourseRequest/CourseRequest';
import CreateNew from './Screens/CreateNew/CreateNew';
import EditCart from './Screens/EditCart/EditCart';
import ForgetPasswords from './Screens/ForgetPasswords/ForgetPasswords';
import HallDetails from './Screens/HallDetails/HallDetails';
import Home from './Screens/Home/Home';
import Introduction from './Screens/Introduction/Introduction';
import JoinRequests from './Screens/JoinRequests/JoinRequests';
import Language from './Screens/Language/Language';
import MoreOptions from './Screens/MoreOptions/MoreOptions';
import { ContactUs } from './Screens/MoreOptions/components';
import Msgs from './Screens/Msgs/Msgs';
import MyCart from './Screens/MyCart/MyCart';
import NewCourses from './Screens/NewCourses/NewCourses';
import Payment from './Screens/Payment/Payment';
import PrivacyPolicy from './Screens/PrivacyPolicy/PrivacyPolicy';
import Profile from './Screens/Profile/Profile';
import Reservations from './Screens/Reservations/Reservations';
import SideMenu from './Screens/SideMenu/SideMenu';
import SignMenu from './Screens/SignMenu/SignMenu';
import Subs from './Screens/Subs/Subs';
import TOS from './Screens/TOS/TOS';
import Test from './Screens/Test/Test';
import { AddTrainee, EditTrainee, Trainees } from './Screens/Trainees';
import TrainingCenters from './Screens/TrainingCenters/TrainingCenters';
import Welcome from './Screens/Welcome/Welcome';

const AppStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Language" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignMenu" component={SignMenu} />
      <Stack.Screen name="ForgetPasswords" component={ForgetPasswords} />
      <Stack.Screen name="ChangePasswords" component={ChangePasswords} />
      <Stack.Screen name="NewCourses" component={NewCourses} />
      <Stack.Screen name="Coaches" component={Coaches} />
      <Stack.Screen name="TrainingCenters" component={TrainingCenters} />
      <Stack.Screen name="Reservations" component={Reservations} />
      <Stack.Screen name="MyCart" component={MyCart} />
      <Stack.Screen name="Test" component={Test} />
      <Stack.Screen name="Ads" component={Ads} />
      <Stack.Screen name="MoreOptions" component={MoreOptions} />
      <Stack.Screen name="Msgs" component={Msgs} />
      <Stack.Screen name="SideMenu" component={SideMenu} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="TOS" component={TOS} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="CourseDetails" component={CourseDetails} />
      <Stack.Screen name="CenterDetails" component={CenterDetails} />
      <Stack.Screen name="HallDetails" component={HallDetails} />
      <Stack.Screen name="CoachDetails" component={CoachDetails} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Subs" component={Subs} />
      <Stack.Screen name="BuySub" component={BuySub} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="CreateNew" component={CreateNew} />
      <Stack.Screen name="CourseRequest" component={CourseRequest} />
      <Stack.Screen name="JoinRequests" component={JoinRequests} />
      <Stack.Screen name="CourseCart" component={CourseCart} />
      <Stack.Screen name="Trainees" component={Trainees} />
      <Stack.Screen name="AddTrainee" component={AddTrainee} />
      <Stack.Screen name="EditTrainee" component={EditTrainee} />
      <Stack.Screen name="Introduction" component={Introduction} />
      <Stack.Screen name="EditCart" component={EditCart} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
};

export default AppStack;
