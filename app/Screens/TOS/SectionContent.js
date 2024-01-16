import React from 'react';
import { useWindowDimensions } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

const SectionContent = ({content = '<p></p>', rtl}) => {
  const {width} = useWindowDimensions();
  return (
    <AutoHeightWebView
      overScrollMode="never"
      removeClippedSubviews={true}
      style={{width: width - 40}}
      // customScript={`document.body.style.background = 'lightyellow';`}
      customStyle={`
          * {
          max-width: 98%;
          }
        `}
      onSizeUpdated={size => console.log(size.height)}
      // files={[
      //   {
      //     href: 'cssfileaddress',
      //     type: 'text/css',
      //     rel: 'stylesheet',
      //   },
      // ]}
      source={{
        html: `<div style='text-align: ${rtl ? 'right' : 'left'};direction: ${
          rtl ? 'rtl' : 'ltr'
        };'>${content}</div>`,
      }}
      scalesPageToFit={false}
      bounces={false}
      scrollEnabled={false}
      viewportContent={'width=device-width, user-scalable=no'}
      /*
      other react-native-webview props
      */
      javaScriptEnabled
      // scrollEnabledWithZoomedin={true}
      automaticallyAdjustContentInsets={false}
    />
  );
};
export default SectionContent;
