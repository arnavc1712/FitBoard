import React, { Component, useState, useEffect } from 'react';
// import Permissions from 'react-native-permissions';
import { Container, Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label,Toast} from 'native-base';
import {
  StyleSheet 
} from 'react-native';

import Constants from 'expo-constants';
import VerifyEmailContent from '../verifyEmailModalContent';
import Modal from "react-native-modal";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = (props) => {

    

    const navigation = props.navigation
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name,setName] = useState('')
    const [user,setUser] = useState()
    const [showModal,setShowModal] = useState(false)
    const userColl = firestore().collection('Users')



    const onSignup = async () => {
        try {
            const currentUser = await auth().createUserWithEmailAndPassword(email,password)
            
            setUser(currentUser)
            if (currentUser && currentUser["additionalUserInfo"]["isNewUser"]){
                await userColl.doc(currentUser["user"]["email"]).set({
                                                                      name:name,
                                                                      email:currentUser["user"]["email"],
                                                                      participatingEvents:[],
                                                                      lastUpdatedLocation:{}})
            }
            await auth().currentUser.sendEmailVerification()
            // console.log(user["user"]["email"])
            navigation.navigate("Login")
            Toast.show({text:"A verfication email has been sent to "+currentUser["user"]["email"],buttonText:"Okay",duration:3000})
        }
        catch(error){
            console.log(error);
            Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
        }
    }

    const onVerifyEmail = async () => {
        try{
            setShowModal(false)
            if(user){
                await auth().currentUser.sendEmailVerification()
                Toast.show({text:"A verfication email has been sent to "+user["user"]["email"],buttonText:"Okay",duration:3000})
            }

        }
        catch(error){
            console.log(error)
            Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
        }
    }


    return(

        <Container style={{ paddingTop: Constants.statusBarHeight }}>
            <Content padder contentContainerStyle={styles.form}>
               
                <Form>
                    <FormItem floatingLabel style={styles.item}>
                      <Label>Name</Label>
                      <Input value={name} onChangeText={val => setName(val)}/>
                    </FormItem>
                    <FormItem floatingLabel style={styles.item}>
                      <Label>Email ID</Label>
                      <Input value={email} onChangeText={val => setEmail(val)}/>
                    </FormItem>
                    <FormItem floatingLabel last style={styles.item}>
                      <Label>Password</Label>
                      <Input value={password} secureTextEntry={true} onChangeText={val => setPassword(val)}/>
                    </FormItem>

                    <Button full rounded style={styles.button} onPress={()=>onSignup()} ><Text> Signup </Text></Button>
                    
           
                </Form>
            </Content>
            
        </Container>
    );

}




const styles = StyleSheet.create({
    form:{
    flex:1,
    justifyContent : 'center'
    },
  item:{
    borderBottomWidth:2,
    borderColor:'#009688'
  },
  button:{
    marginTop:15,
    width:"50%",
    alignSelf:'center',
    backgroundColor:'#009688'
    // flexDirection:'row'
  }

})

export default SignupScreen;