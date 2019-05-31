import React, { Component } from 'react';
import { View, Text, TouchableOpacity,TextInput,StyleSheet,StatusBar } from 'react-native';
import { createAppContainer, createStackNavigator, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import ScanbotSDK from 'react-native-scanbot-sdk';
import ScanScreen from "./Screens/Scan";
import RegisterScreen from "./Screens/Register";
import VerificationScreen from "./Screens/Verification";



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
export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

class LoginScreen extends Component{
  static navigationOptions = {
      //To hide the ActionBar/NavigationBar
      header: null,
  };
  state = {
      username: '',
      password: ''
  }
  handleUsername = (text) => {
    this.setState({ username: text })
  }
  handlePassword = (text) => {
    this.setState({ password: text })
  }
  login = (usr, pass) => {
    url=`http://scantronbackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/authentication/login?email=${usr}&password=${pass}`;
    fetch(url, {method: 'GET'})
    .then((response) =>{
      console.log(response)
      if (response.ok===true)
        // response.json().then((responseJson) => {console.log(responseJson)})
        global.username = this.state.username;
        this.props.navigation.navigate('Scan')

      if (response.ok===false)
        alert("Wrong password/User doesn't exist")
    })
    .catch((error) => {
         console.error(error);
    });
  }

  register=()=>{
    this.props.navigation.navigate('Register')
  }


  render(){

    return(
      <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
        <Text style={styles.welcome}>Login into Gradus</Text>
         <TextInput
          style={styles.input}
          placeholder="Username"
          returnKeyType="next"
          onSubmitEditing={()=>this.passwordInput.focus()}
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
          onSubmitEditing={() => this.login(this.state.username, this.state.password)}
          onChangeText = {this.handlePassword}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={()=>this.login(this.state.username.trim(), this.state.password)}
          >
          <Text style={styles.btnTxt}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.btn}
            onPress={()=>{this.register()}}
          >
          <Text style={styles.btnTxt}>Register</Text>
          </TouchableOpacity>
        </View>
    </View>
    );
  }
}
// Other code for HomeScreen here...

class HomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Scan')}
          title="Try"
          color="#841584"
        />
      </View>
    );
  }
}


const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    Scan: ScanScreen,
    Register: RegisterScreen,
    Verification: VerificationScreen
  },
  {
    initialRouteName: "Login"
  }
);

const AppContainer = createAppContainer(RootStack);