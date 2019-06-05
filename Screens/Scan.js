import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
// import { RNCamera } from 'react-native-camera';
import ScanbotSDK from 'react-native-scanbot-sdk';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// let licenseKey =
//   "oS+qWvWge+ebPhz39TcreeiEEGEc/7" +
//   "XXjFFgpbuRRTpMcFnxdTgYLTGQvE3O" +
//   "NB2X4DtWy6rC52taWYu5Kl4dRoVCSm" +
//   "VgZNXc4NOFlxo4IcgqXfVTQ8sQB1St" +
//   "eRcU7nkaLpLdD4EXUAUO7/7A80ITCU" +
//   "6SjquhqgI7HAf4O/bGEcEzSq3YoqTz" +
//   "gtg273qb7tMmBVQm+PRL+99Y6xru5J" +
//   "SnK84rfIA7tT8lsvZqOmxKFbeygB+d" +
//   "gwwiq+kkyTA8sLThY3X4HRDJoyHIga" +
//   "Y8f56Lvv09HAHjxUgxPcIGgKBqphEP" +
//   "9Yo6CpJ9nuA0Xa7aSg8oC7XQJdulRs" +
//   "37fYWN+hJ71w==\nU2NhbmJvdFNESw" +
//   "pjb20uc25hcHRyb24KMTU2MDAzODM5" +
//   "OQo1OTAKMw==\n";

// type Props = {};
export default class ScanScreen extends Component {
  static navigationOptions = {
      //To hide the ActionBar/NavigationBar
      header: null,
  };
  componentDidMount() {
    this.initializeSDK();
  }
  render() {
    return (

      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.startScanbotCameraButtonTapped} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Scan </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
 startScanbotCameraButtonTapped = async () => {
    const result = await ScanbotSDK.UI.startDocumentScanner({
      // Customize colors, text resources, etc..
      polygonColor: '#00ffff',
      cameraPreviewMode: 'FIT_IN'
    });
    this.debugLog(`DocumentScanner result: ${JSON.stringify(result)}`);
    if (result.status === "OK") {
      this.setPages(this.state.pages.concat(result.pages));
    }
  };
  // takePicture = async function() {
//     console.log("COol")
//     if (this.camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await this.camera.takePictureAsync(options);
//       console.log(data.uri);
//       let pic_bin = ''
//       RNFetchBlob.fs.readStream(
//           data.uri,
//           'base64',
//           4095)
//       .then((ifstream) => {
//           ifstream.open()
//           ifstream.onData((chunk) => {
//             pic_bin += chunk
//           })
//           ifstream.onError((err) => {
//             console.log('oops', err)
//           })
//           ifstream.onEnd(() => {  
//             console.log("image:\n"+pic_bin)
//           })
//       })
//     }
//   };
  async initializeSDK() {
    let options = {
      licenseKey: "",
      loggingEnabled: true,
      storageImageFormat: "JPG",
      storageImageQuality: 80
    };
    try {
      const result = await ScanbotSDK.initializeSDK(options);
      this.debugLog('initializeSDK result: ' + JSON.stringify(result));
    } catch (ex) {
      this.debugLog('initializeSDK error: ' + JSON.stringify(ex.error));
    }
  }
}


const styles = StyleSheet.create({
  preview: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

