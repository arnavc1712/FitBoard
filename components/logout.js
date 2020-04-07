import React, { Component } from 'react';
import Constants from 'expo-constants';
import Modal from "react-native-modal";
import {StyleSheet,View} from 'react-native';

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,
  Toast
} from 'native-base';


const LogoutScreen = (props) => {

 //  const navigation = props.navigation
	

	// async onLogout(){
	// 	try {
	// 		await this.firebase.auth().signOut()
	// 		Toast.show({text:"Successfully Logged Out",buttonText:"Okay",duration:750})
 //   //    this.setLoggedIn(false)
 //   //    this.forceUpdate()
	// 		// this.navigation.navigate("Signup")
	// 	}

	// 	catch(error) {
	// 		Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
	// 		console.log(error)
	// 	}


	// }



		return (
		<Container>
      
      </Container>
      )
}

const styles = StyleSheet.create({
	form:{
    flex:1,
    justifyContent : 'center'
	},
  button:{
    marginTop:10,
    width:"70%",
    alignSelf:'center',
    backgroundColor:'white'
    // flexDirection:'row'
  },
  content: {
    height:'auto',
    width:'auto',
    alignSelf:'center',
    backgroundColor: '#009688',
    padding: 22,
    height:'20%',
    // width:'50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: 'rgba(0, 0, 0, 0.1)',


  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 5,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    color:'#009688'
  },

})


export default LogoutScreen