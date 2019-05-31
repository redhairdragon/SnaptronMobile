import React, { Component } from 'react';
import { View, Text, TouchableOpacity,TextInput,StyleSheet,StatusBar } from 'react-native';
import { createAppContainer, createStackNavigator, NavigationActions } from 'react-navigation'; // Version can be specified in package.json


export default class VerificationScreen extends Component{
	componentDidMount(){
		this.setState({ username: this.props.navigation.getParam('email') });
	}

  static navigationOptions = {
      //To hide the ActionBar/NavigationBar
      header: null,
  };
  state = {
      verification_code:"",
      username:"",
  }
  handleVerification = (text) => {
    this.setState({ verification_code: text })
  }
  verify = () => {
    url='http://scantronbackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/authentication/confirm';
    fetch(url, 
     {method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      	email:this.state.username,
		confirmCode: this.state.verification_code
  		})
  	})
    .then((response) => {
      if (response.ok===true){
        this.props.navigation.navigate('Login')
      }
      else{
      	console.log(response)
      }
    })
    .catch((error) => {
         console.error(error);
    });
  }
  render(){
 
    return(	
      <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
        <Text style={styles.welcome}>Verification</Text>
        <TextInput
          style={styles.input}
          placeholder="Verification Code Sent to Your Email"
          returnKeyType="go"
          maxLength={6}
          keyboardType='numeric'
          onSubmitEditing={()=>this.verify()}
          onChangeText = {this.handleVerification}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={() => this.verify()}
          >
          <Text style={styles.btnTxt}>Verify</Text>
          </TouchableOpacity>
        </View>
    </View>
    );
  }
}


const styles= StyleSheet.create(
{
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#21b278"
  },
  welcome:{
    fontSize: 30,
    textAlign:"center",
    color:"#FFF",
    margin: 20,
    fontFamily: "Webrush Demo"

  },
  input:{
    width: "90%",
    marginBottom: 15,
    height: 50,
    padding: 15,
    backgroundColor: "white"
  },
  btnContainer:{
    flexDirection: "row",
    justifyContent:"space-between",
    width:"90%",
    padding: 10,
  },
  btn:{
    backgroundColor: "white",
    width: "45%",
    padding: 20,
  },
  btnTxt:{
    textAlign:"center",
    fontSize: 18,
    fontWeight: '700'
  }
}
)