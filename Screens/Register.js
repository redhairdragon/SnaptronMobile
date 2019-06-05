import React, { Component } from 'react';
import { View, Text, TouchableOpacity,TextInput,StyleSheet,StatusBar } from 'react-native';
import VerificationScreen from "./Verification";


export default class RegisterScreen extends Component{
  static navigationOptions = {
      //To hide the ActionBar/NavigationBar
      header: null,
  };
  state = {
      school:'',
      username: '',
      password: '',
      password_repeat:'',
      first_name:'',
      last_name:''
  }
  handleFirstName = (text) => {
    this.setState({ first_name: text })
  }
  handleLastName = (text) => {
    this.setState({ last_name: text })
  }
  handleSchool= (text) => {
    this.setState({ school: text })
  }
  handleUsername = (text) => {
    this.setState({ username: text })
  }
  handlePassword = (text) => {
    this.setState({ password: text })
  }
  handlePasswordRepeat = (text) => {
    this.setState({ password_repeat: text })
  }
  register = () => {
    if(this.state.password!==this.state.password_repeat){
      alert("Passwords don't match");
      return
    }

    url='http://scantronbackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/authentication/register';
    fetch(url, 
     {method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      password: this.state.password,
      passwordConf: this.state.password_repeat,
      email: this.state.username.trim(),
      firstName: this.state.first_name.trim(),
      lastName: this.state.last_name.trim(),
      school: this.state.school.trim()})
    })
    .then((response) => {
      if (response.ok===true){
        this.props.navigation.navigate('Verification',{email:this.state.username.trim()})
      }
      else{
        response.json().then((responseJson) => {alert(responseJson.message)})
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
        <Text style={styles.welcome}>Register</Text>
         <TextInput
          style={styles.input}
          placeholder="First Name"
          returnKeyType="next"
          onSubmitEditing={()=>this.lastNameInput.focus()}
          onChangeText = {this.handleFirstName}
          autoCapitalize='none'
        />
         <TextInput
          style={styles.input}
          placeholder="Last Name"
          returnKeyType="next"
          onSubmitEditing={()=>this.schoolInput.focus()}
          onChangeText = {this.handleLastName}
          ref={(input)=>this.lastNameInput=input}
          autoCapitalize='none'
        />
         <TextInput
          style={styles.input}
          placeholder="School"
          returnKeyType="next"
          onSubmitEditing={()=>this.usernameInput.focus()}
          onChangeText = {this.handleSchool}
          ref={(input)=>this.schoolInput=input}
          autoCapitalize='none'
        />
         <TextInput
          style={styles.input}
          placeholder="Email"
          returnKeyType="next"
          onSubmitEditing={()=>this.passwordInput.focus()}
          ref={(input)=>this.usernameInput=input}
          onChangeText = {this.handleUsername}
          autoCapitalize='none'
        />
         <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize='none'
          returnKeyType="go"
          ref={(input)=>this.passwordInput=input}
          onSubmitEditing={()=>this.passwordRepeatInput.focus()}
          onChangeText = {this.handlePassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password Again"
          secureTextEntry
          autoCapitalize='none'
          returnKeyType="go"
          ref={(input)=>this.passwordRepeatInput=input}

          onSubmitEditing={()=>this.register()}
          onChangeText = {this.handlePasswordRepeat}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={() => this.register()}
          >
          <Text style={styles.btnTxt}>Register</Text>
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