import React, {Component,useState,useEffect} from 'react';
import {Container,Text,Content,Header, Icon, Picker, Form,Button,Item,Input} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {View,StyleSheet,Image} from 'react-native';
import GetLocation from 'react-native-get-location'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



const Menu = ({navigation}) => {

    const [currLocation,setCurrLocation] = useState({latitude:null,longitude:null})
    const userColl = firestore().collection('Users')
    // console.log("Rendered")
    const onAuthChanged = async(user) => {
        try{
            const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000,});
            let coordObj = {latitude:location["latitude"],longitude:location["longitude"]}
            setCurrLocation(coordObj)
            
            await userColl.doc(user["email"]).update({lastUpdatedLocation:coordObj})

        }
        catch(error){
            console.log(error)
        }
        

    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthChanged)
			// getCurrPos();
		return subscriber
    },[])
    
    return (

        <Grid style={styles.grid}>
            <Row style={styles.row1} size={1}></Row>
            <Row style={styles.row2} size={1}>
            <Button full rounded style={styles.button} onPress={() => navigation.navigate('MenuStack',{screen:'Wizard',params:{currLocation:currLocation}})}><Text style={{fontSize:12}}> Create Event </Text></Button>
            <Button full rounded style={styles.button} onPress={() => navigation.navigate('MenuStack',{screen:'ShowEvents',params:{currLocation:currLocation}})}><Text style={{fontSize:12}}> Register for Event </Text></Button>
            </Row>
        </Grid>
       
    )
}

const styles = StyleSheet.create({
    grid:{
        alignItems:'center',
    },
    row2:{
        // backgroundColor:'green'
    },
    button:{
        width:'40%',
        height:50,
        alignSelf:'center',
        margin:10,
    },
    form:{
        flex:1,
        justifyContent : 'center'
    },
    
})
export default Menu;