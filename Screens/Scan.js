import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import ScanbotSDK from 'react-native-scanbot-sdk';
import RNFetchBlob from 'rn-fetch-blob'

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

let licenseKey =
  "oS+qWvWge+ebPhz39TcreeiEEGEc/7" +
  "XXjFFgpbuRRTpMcFnxdTgYLTGQvE3O" +
  "NB2X4DtWy6rC52taWYu5Kl4dRoVCSm" +
  "VgZNXc4NOFlxo4IcgqXfVTQ8sQB1St" +
  "eRcU7nkaLpLdD4EXUAUO7/7A80ITCU" +
  "6SjquhqgI7HAf4O/bGEcEzSq3YoqTz" +
  "gtg273qb7tMmBVQm+PRL+99Y6xru5J" +
  "SnK84rfIA7tT8lsvZqOmxKFbeygB+d" +
  "gwwiq+kkyTA8sLThY3X4HRDJoyHIga" +
  "Y8f56Lvv09HAHjxUgxPcIGgKBqphEP" +
  "9Yo6CpJ9nuA0Xa7aSg8oC7XQJdulRs" +
  "37fYWN+hJ71w==\nU2NhbmJvdFNESw" +
  "pjb20uc25hcHRyb24KMTU2MDAzODM5" +
  "OQo1OTAKMw==\n";

export default class ScanScreen extends Component {
  static navigationOptions = {
      //To hide the ActionBar/NavigationBar
      header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      examId:this.props.navigation.getParam('examId'),
    }
    // console.log("Constructor: ");
    // console.log(this.state.examId);
  }
  

  componentDidMount() {
    this.initializeSDK();
    ScanbotSDK.isLicenseValid()
    .then((valid)=>{
      // console.log("***************************")
      // console.log(valid)
      // console.log("***************************")
    })
  }
  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity
            onPress={()=>this.startScanbotCameraButtonTapped(false)} 
            style={styles.buttonSingle}
          >
          <Text style={{fontSize:40,textAlign: 'center',textAlignVertical:"center"}}>Single Paper</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>this.startScanbotCameraButtonTapped(true)} 
            style={styles.buttonMultiple}
          >
          <Text style={{fontSize:40,textAlign: 'center',textAlignVertical:"center"}}>Multiple Papers</Text>
          </TouchableOpacity>
      </View>
    );
  }


  croppingPage = async (page) => {
    let result = await ScanbotSDK.UI.startCroppingScreen(page, {
      doneButtonTitle: 'Apply',
      topBarBackgroundColor: '#c8193c'
    });
    if (result.status === "OK") {
      return result.page
    }
    else{
      return page;
    }
  };


   startScanbotCameraButtonTapped = async (isMultiple) => {
    const result = await ScanbotSDK.UI.startDocumentScanner({
      // Customize colors, text resources, etc..
      polygonColor: '#00ffff',
      cameraPreviewMode: 'FIT_IN',
      multiPageEnabled: isMultiple,
      flashEnabled:true
    });
    if (result.status === "OK") {
      //handover to cropping screen
      // await this.croppingPages(result.pages)
      console.log(result.pages)
      result.pages.forEach((x)=>{this.handlePage(x)})
    }
  };

  handlePage=async (page)=>{
    if(page.detectionResult=="OK")
      this.submitImage(page)
    else{
      this.submitImage(await this.croppingPage(page))
    }
  }
  submitImage(page){
    //Read file to bin
    // console.log(page.originalImageFileUri)
    var pic_bin_uncropped='';
    send=()=>{
      var pic_bin = ''
      RNFetchBlob.fs.readStream(
          // page.originalImageFileUri.split('?')[0],
          page.documentImageFileUri.split('?')[0],
          'base64',
          4095)
      .then((ifstream) => {
          ifstream.open()
          ifstream.onData((chunk) => {
            pic_bin += chunk
          })
          ifstream.onError((err) => {
            console.log('oops', err)
          })
          ifstream.onEnd(() => {
            console.log("============================")
            console.log(pic_bin)

            console.log(pic_bin_uncropped)
            console.log("============================")
            url=`http://ScantronBackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/submission/${global.username}/${this.state.examId}`;
            fetch(url, {
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify({
                // exam_image:pic_bin
                cropped_image:pic_bin,
                uncropped_image:pic_bin_uncropped
              }),
              credentials: 'include'
            })
            .then((response) =>{
              console.log(response)
              if (response.ok===true)
                response.json()
                .then((responseJson) => {
                  console.log(responseJson)
                  this.setState({courses:responseJson})
                })
                .catch((error) => {console.error(error);})
              if (response.ok===false)
                alert("Fail to submit pic") 
            })
            .catch((error) => {
                 console.error(error);
            });
          })
      })
      .catch((error) => {
           console.error(error);
      });
    }
    // send()
    RNFetchBlob.fs.readStream(
        page.originalImageFileUri.split('?')[0],
        // page.documentImageFileUri.split('?')[0],
        'base64',
        4095)
    .then((ifstream) => {
        ifstream.open()
        ifstream.onData((chunk) => {
          pic_bin_uncropped += chunk
        })
        ifstream.onError((err) => {
          console.log('oops', err)
        })
        ifstream.onEnd(() => { 
          send()
        })
    })
    

    
  }
   async initializeSDK() {
    if(global.SDKInit==true)
      return
    let options = {
      licenseKey: licenseKey,
      loggingEnabled: true,
      storageImageFormat: "JPG",
      storageImageQuality: 50
    };
    try {
      const result = await ScanbotSDK.initializeSDK(options);
      console.log('initializeSDK result: ' + JSON.stringify(result));
    } catch (ex) {
      console.log('initializeSDK error: ' + JSON.stringify(ex.error));
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
  },
  buttonSingle: {
    alignItems: 'center',
    height:"50%",
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  buttonMultiple: {
    alignItems: 'center',
    height:"50%",
    backgroundColor: 'blue',
    justifyContent: 'center',
  },
  
});

