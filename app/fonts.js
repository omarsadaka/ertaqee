import { Platform } from "react-native";



// export default {
//   normal: 'din-next-lt-w23-regular',
//   bold: 'din-next-lt-w23-medium',
//   boldIsStyle: true,
// };

export default {
  normal:Platform.OS=='android'?'din-next-lt-w23-regular':  'Poppins-Regular',
  bold: Platform.OS=='android'?'din-next-lt-w23-medium': 'Poppins-Bold',
  boldIsStyle: true,
};
