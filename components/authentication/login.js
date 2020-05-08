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
import customStyles from '../../styles.json'

const LoginScreen = (props) => {

    

    const navigation = props.navigation
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user,setUser] = useState()
    const [showModal,setShowModal] = useState(false)
    const userColl = firestore().collection('Users')


    const onLogin = async (val) => {
        try{
            const currentUser = await auth().signInWithEmailAndPassword(email.trim(),password)
            setUser(currentUser)
            console.log(currentUser)
            if(!currentUser.user.emailVerified){
                setShowModal(true)
            }
            else{
                navigation.navigate('Home')
            }
        }
        catch(error){
            console.log(error)
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
                <Modal
                    testID={'modal'}
                    isVisible={showModal}
                    backdropColor="#B4B3DB"
                    backdropOpacity={0.8}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}>
                    <VerifyEmailContent onPress={() => onVerifyEmail()}/>
                </Modal>
                <Form>
                    <FormItem floatingLabel style={styles.item}>
                      <Label>Email ID</Label>
                      <Input value={email} onChangeText={val => setEmail(val)}/>
                    </FormItem>
                    <FormItem floatingLabel style={styles.item}>
                      <Label>Password</Label>
                      <Input value={password} secureTextEntry={true} onChangeText={val => setPassword(val)}/>
                    </FormItem>

                    <Button full rounded style={styles.button} onPress={()=>onLogin()} ><Text> Login </Text></Button>
                    <Button full transparent onPress={()=>navigation.navigate("Signup")} ><Text> New User? Click here to register </Text></Button>
                    
           
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
    borderColor:customStyles.tabs.color,
    width:'80%',
    alignSelf:'center'
  },
  button:{
    marginTop:15,
    width:"50%",
    alignSelf:'center',
    backgroundColor:customStyles.solidButton.color
    // flexDirection:'row'
  }

})

export default LoginScreen;