import React, { Component } from 'react';
import {ScrollView, View, Text, TouchableOpacity,TextInput,StyleSheet,StatusBar } from 'react-native';
import { ListItem,Button, ButtonGroup } from 'react-native-elements';
import Modal from 'react-native-modalbox';

class AnswerSelection extends Component{
  constructor(){
    super()
    this.state = {
      selectedIndex: 2
    }
    this.updateIndex = this.updateIndex.bind(this)
  }
  getSelection(){
    const buttons = ["A","B","C","D","E"]
    return buttons[this.state.selectedIndex];
  }
  
  updateIndex (selectedIndex) {
    const buttons = ["A","B","C","D","E"]
    this.setState({selectedIndex})
    if(this.props.onChange)
      this.props.onChange(buttons[selectedIndex]);
  }

  render () {
    const buttons = ["A","B","C","D","E"]
    const { selectedIndex } = this.state

    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{height: "10%"}}
      />
    )
  }
}

export default class ExamScreen extends Component{
  static navigationOptions = {
      //To hide the ActionBar/NavigationBar
      header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      courseId:this.props.navigation.getParam('courseId'),
      exams:new Array(0),
      examName:"",
    }
    console.log("Navi:")
    console.log(this.props.navigation.getParam('courseId'))
    console.log("State:")
    console.log(this.state.courseId)
    
  }
  
  componentDidMount() {
    this.retrieveExamsList();
  }
  

  render(){
    return(
    <View style={styles.container}>
      <Text style={styles.welcome}>Exams</Text>
      <ScrollView>
      {
        this.state.exams.map((exam, i) => (
          <ListItem
            key={exam.examid}
            leftAvatar={{ title:String(i+1) }}
            title={exam.name}
            subtitle={exam.answers.join(",")}
            onPress={()=>{this.props.navigation.navigate('Scan',{examId:exam.examid})}}
            onLongPress={()=>{this.removeExam(exam.examid)}}
          />
        ))
      }
      </ScrollView>
      <View style={styles.btnContainer}>
        <TouchableOpacity 
          style={styles.btn}
          onPress={()=>{this.retrieveExamsList()}}
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

      <Modal style={styles.modal} position={"bottom"} ref={"modal4"} backdropPressToClose={false} backButtonClose={true}>
        <View style={{flex: 1,flexDirection: 'column', justifyContent: "space-around",alignItems: 'center'}}>
          <TextInput
            style={{width:"80%", backgroundColor: '#DDDDDD',height:"15%",padding: 5}}
            // style={styles.input}
            ref="className"
            placeholder="Exam Name"  
            onChangeText= {(text) => {this.setState({examName: text.trim()})}}
          />
          <AnswerSelection ref="Q1"/>
          <AnswerSelection ref="Q2"/>
          <AnswerSelection ref="Q3"/>
          <AnswerSelection ref="Q4"/>
          <AnswerSelection ref="Q5"/>

          <TouchableOpacity 
            onPress={() => this.createExam()}
          >
            <Text style={styles.btnTxt}>Add</Text>
          </TouchableOpacity>

        </View>
      </Modal>
     

    </View>
    );
  }
  removeExam(id){
    console.log("Removing Exam")
    url=`http://ScantronBackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/exam/${global.username}/${id}`
    fetch(url, {method: 'DELETE',credentials: 'include'})
    .then((response) =>{
      if (response.ok===true)
        this.retrieveExamsList()
    })
    .catch((error) => {
         console.error(error);
    });
  }
  retrieveExamsList(){
    console.log("Retrieving Exam")
    url=`http://ScantronBackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/exam/${global.username}/${this.state.courseId}/all` 
    console.log(url)

    fetch(url, {method: 'GET',credentials: 'include'})
    .then((response) =>{
      console.log(response)
      if (response.ok===true)
        response.json()
        .then((responseJson) => {
          console.log(responseJson)
          if(Object.keys(responseJson).length>0)
            this.setState({exams:responseJson})
          else
            this.setState({exams:[]})
        })
        .catch((error) => {console.error(error);})
      else{
        this.setState({exams:[]})
      }
    })
    .catch((error) => {
         console.error(error);
    });
  }
  createExam(){
    console.log("createExam")
    examAnswers=["C",'C','C','C','C']
    for(let i=1;i<=5;i++){
      examAnswers[i-1]=this.refs["Q"+String(i)].getSelection();
    }
    console.log(examAnswers)
    url=`http://ScantronBackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com/exam/${global.username}/${this.state.courseId}`;
    fetch(url, {
      method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:this.state.examName,
          answers:examAnswers
        }),
        credentials: 'include'
      })
    .then((response) =>{
      console.log(response)
      if (response.ok===true)
        this.retrieveExamsList()
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
    padding: 15,
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
    height: "80%"
  },
})

