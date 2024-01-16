import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

const HtmlContent = ({content = '<p></p>', contentWidth}) => {
  const {width} = useWindowDimensions();
  const [webViewHeight, setWebViewHeight] = useState(0);

  return (
    <AutoHeightWebView
      style={{width: width - 80}}
      // customScript={`document.body.style.background = 'lightyellow';`}
      customStyle={`
        * {
        max-width: 100%;
        }
      `}
      onSizeUpdated={(size) => console.log(size.height)}
      // files={[
      //   {
      //     href: 'cssfileaddress',
      //     type: 'text/css',
      //     rel: 'stylesheet',
      //   },
      // ]}
      source={{
        html: `<div style='text-align: right;direction: rtl;'>${content}</div>`,
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

    // <WebView
    //   source={{
    //     html: `<div style='text-align: right;direction: rtl;'>'${content}'</div>`,
    //   }}
    //   scalesPageToFit={false}
    //   javaScriptEnabled
    //   style={{
    //     width: width - 40,
    //     height: content.length * 0.7,
    //     // backgroundColor: 'red',
    //     // textAlign: 'right',
    //     // justifyContent: 'flex-end',
    //     // alignItems: 'flex-end',
    //     // fontWeight: 'bold',
    //     // transform: [{scaleX: -1}],
    //   }}
    //   automaticallyAdjustContentInsets={false}
    // />

    // <RenderHtml
    //   source={{html: content || '<p></p>'}}
    //   contentWidth={width}
    //   containerStyle={{width: contentWidth ?? '90%'}}
    //   enableExperimentalMarginCollapsing={true}
    //   WebView={WebView}
    //   originWhitelist={['*']}
    // />
  );
};
export default HtmlContent;
