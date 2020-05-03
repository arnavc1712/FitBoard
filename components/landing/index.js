import Profile from './profile'
import React, {Component,useState,useEffect} from 'react';
import {Container,Text,Content,Header, Icon, Picker, Form,Button,Item,Input} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {View,StyleSheet,Image,ScrollView} from 'react-native';
import GetLocation from 'react-native-get-location'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import configs from "../../conf.json"
import messaging from '@react-native-firebase/messaging';
import RegisteredEvents from './registeredEvents'


const ProfileScreen = ({navigation}) => {

    const [currLocation,setCurrLocation] = useState({latitude:null,longitude:null})
    const [topic,setTopic] = useState(null)
    const [user,setUser] = useState(null)
    const [showModal,setShowModal] = useState(false)
    let state = ''
    let zipCode = ''
    let country = ''
    let city =' '
    const userColl = firestore().collection('Users')
    // console.log("Rendered")
    const onAuthChanged = async(user) => {
        try{
            setUser(user)
            const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000,});
            let coordObj = {latitude:location["latitude"],longitude:location["longitude"]}
            // console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordObj.latitude},${coordObj.longitude}&key=${configs.mapsDirectionsKey}`)
            let response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + coordObj.latitude.toString() + ',' + coordObj.longitude.toString() + '&key=' + configs["mapsDirectionsKey"])
            let data = await response.json()
            
            for (let val of data["results"][0]["address_components"]){
                if(val["types"].includes("administrative_area_level_1")){
                    state = val["short_name"]
                }
                else if(val["types"].includes("locality")){
                    city = val["long_name"].toLowerCase()
                }
                else if(val["types"].includes("country")){
                    country = val["short_name"]
                }
                else if(val["types"].includes("postal_code")){

                    zipCode = val["long_name"]
                }
            }


            messaging()
            .subscribeToTopic(`${state}-${city}-${zipCode}`)
            .then(() => console.log(`Subscribed to topic! ${state}-${city}-${zipCode}`));


            await userColl.doc(user["email"])
                               .set({lastUpdatedLocation:coordObj,
                                    country:country,
                                    state:state,
                                    city:city,
                                    zipCode:zipCode,
                                    topics:firestore.FieldValue.arrayUnion(`${state}-${city}-${zipCode}`)},{merge:true})

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


    return(
        <ScrollView style={styles.scroll}>
            <View>
                <Profile/>
                <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Button full rounded style={styles.button} onPress={() => navigation.navigate('MenuStack',{screen:'Wizard',params:{currLocation:currLocation}})}><Text style={{fontSize:12}}> Create Event </Text></Button>
                    <Button full rounded style={styles.button} onPress={() => navigation.navigate('MenuStack',{screen:'ShowEvents',params:{currLocation:currLocation}})}><Text style={{fontSize:12}}> Register for Event </Text></Button>
                </View>
                <RegisteredEvents user={user}/>
            </View>
        </ScrollView>

        
    )
}


const styles = StyleSheet.create({
    button:{
        width:'40%',
        height:50,
        alignSelf:'center',
        margin:10,
    },
    scroll:{
        backgroundColor:'white'
    }
})

export default ProfileScreen