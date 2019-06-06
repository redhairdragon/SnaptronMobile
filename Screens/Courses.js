import React, { Component } from 'react';
import {ScrollView, View, Text, TouchableOpacity,TextInput,StyleSheet,StatusBar } from 'react-native';
import { ListItem } from 'react-native-elements';
import Modal from 'react-native-modalbox';



export default class CoursesScreen extends Component{
  static navigationOptions = {
      //To hide the ActionBar/NavigationBar
      header: null,
  };
  constructor(props){
    super(props);
    this.state = {
     isOpen: false,
     courses:[],
     className:"",
     classDescription:""
    }
  }
  
  componentDidMount() {
    this.retrieveCoursesList()
  }
  
  render(){
    return(
    <View style={styles.container}>
      <Text style={styles.welcome}>Courses</Text>
      <ScrollView>
      {
        this.state.courses.map((course, i) => (
          <ListItem
            key={course.courseid}
            leftAvatar={{ title:String(i+1) }}
            title={course.name}
            subtitle={course.description}
            onPress={()=>{this.props.navigation.navigate('Exams',{courseId:course.courseid})}}
            onLongPress={()=>{this.removeCourse(course.courseid)}}
          />
        ))
      }
      </ScrollView>
      <View style={styles.btnContainer}>
        <TouchableOpacity 
          style={styles.btn}
          onPress={()=>{this.retrieveCoursesList()}}
        >
          <Text style={styles.btnTxt}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btn}
          onPress={() => this.refs.modal4.open()}
        >
          <Text style={styles.btnTxt}>Add</Text>
        </TouchableOpacity>
      </View>

      <Modal style={styles.modal} position={"bottom"} ref={"modal4"} backButtonClose={true} backdropPressToClose={false}>
        <View style={{flex: 1,flexDirection: 'column', justifyContent: "space-around",alignItems: 'center'}}>
          <TextInput
            style={{width:"70%", backgroundColor: '#DDDDDD',height:"45%",padding: 15}}
            ref="className"
            placeholder="Class Name"
            returnKeyType="next"
            onSubmitEditing={()=>this.refs.classDescription.focus()}
            onChangeText= {(text) => {this.setState({className: text.trim()})}}
          />
          <TextInput
            style={{backgroundColor: '#DDDDDD',width:"70%",height:"45%",padding: 15}}

            ref="classDescription"
            placeholder="Description"
            returnKeyType="go"
            onChangeText= {(text) => {this.setState({classDescription: text.trim() })}}
            onSubmitEditing={()=>this.createClass()}
          />
        </View>
      </Modal>
    </View>
    );
  }

  removeCourse(id){
    console.log("Removing Course")
    url=`http://ScantronBackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/course/${global.username}/${id}`

    fetch(url, {method: 'DELETE',credentials: 'include'})
    .then((response) =>{
      if (response.ok===true)
        this.retrieveCoursesList()
    })
    .catch((error) => {
         console.error(error);
    });
  }

  retrieveCoursesList(){
    console.log("Retrieving Courses")
    url=`http://ScantronBackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/course/${global.username}`  
    console.log(url)
    fetch(url, {method: 'GET',credentials: 'include'})
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
        this.setState({courses:[]}) 
    })
    .catch((error) => {
         console.error(error);
    });
  }

  createClass(){
    url=`http://ScantronBackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/course/${global.username}`;
    fetch(url, {
      method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:this.state.className.trim(),
          "description": this.state.classDescription
        }),
        credentials: 'include'
      })
    .then((response) =>{
      console.log(response)
      if (response.ok===true)
        this.retrieveCoursesList()
      if (response.ok===false)
        alert("Fail to create class") 
    })
    .catch((error) => {
         console.error(error);
    });
    this.refs.modal4.close()
  }

}


const styles= StyleSheet.create(
{
  welcome:{
    fontSize: 30,
    textAlign:"center",
    color:"#FFF",
    margin: 20,
    fontFamily: "Webrush Demo"

  },
  container:{
    flex:1,
    backgroundColor:"#21b278"
  },
  btnContainer:{
    flexDirection: "row",
    justifyContent:"space-between",
    width:"90%",
    padding: 10,
    alignSelf: 'center'
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
  },
  modal: {
    // justifyContent: 'center',
    // alignItems: 'center',
    height: "45%"
  },
})
