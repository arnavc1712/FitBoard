import React, {Component,useState,useEffect} from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import {Button,Text,Toast,List,ListItem,Right,Left} from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import { View,StyleSheet } from 'react-native';
import DestinationPicker from './destinationPicker';
import EventDetailPicker from './eventDetailPicker';
import Summary from './summary'
import GetLocation from 'react-native-get-location'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flex: 1,
      justifyContent: 'center'
    }
  };



const Wizard = () => {

    const [date,setDate] = useState(new Date())
    const [event, setEvent] = useState(null)
    const [distance, setDistance] = useState(null)
    const [errors,setErrors] = useState(false)
    const [currLocation, setCurrLocation] = useState({"coords":{latitude:38.4214278,longitude:-111.9185674},
                                                      "name":'',
                                                       "photo_reference":''})
                                        
    const [startLocation, setStartLocation] = useState('')
    const [user,setUser] = useState(null)
    const eventColl = firestore().collection('Events')


    useEffect(()=>{
        const subscriber = auth().onAuthStateChanged((user)=>setUser(user))
        return subscriber
    },[])

    const createEvent = async () => {
        if(user){
            console.log(user)
            await eventColl.add({
                type:event,
                distance:distance,
                coords:{latitude:currLocation["coords"]["latitude"],
                        longitude:currLocation["coords"]["longitude"]},
                locationName:currLocation["name"],
                photoReference:currLocation["photo_reference"],
                timestamp:date,
                creator:user["email"]
            })

            console.log("Event added")
            
         }

    }


    useEffect(() => {
        const getCurrPos = async () => {
            try{
                
                const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000,});
                let coordObj = {latitude:location["latitude"],longitude:location["longitude"]}
                setCurrLocation({'coords':coordObj,
                                  'name':'',
                                  'photo_reference':''})
                animate(coordObj);
            }
            catch(error){
                console.log(error)
            }
        }
        getCurrPos();
      },[]);

    const onDateNext = () => {
        if (date==null || event==null || distance==null){
            setErrors(true)
            Toast.show({text:"Please fill up all fields before proceeding",buttonText:"Okay",duration:3000})
        }
        else{
            setErrors(false)
        }
    }

    return (
        <View style={{flex: 1}}>
            <ProgressSteps>
                <ProgressStep label="Event Details" scrollViewProps={defaultScrollViewProps} onNext={onDateNext} errors={errors}>
                    <EventDetailPicker
                        event={event}
                        setEvent={setEvent}
                        distance={distance}
                        setDistance={setDistance}
                        date={date}
                        setDate={setDate}
                    />
                   
                </ProgressStep>
                <ProgressStep label="Choose Path" scrollViewProps={defaultScrollViewProps}>
                        <DestinationPicker 
                            currLocation={currLocation}
                            setCurrLocation={setCurrLocation}
                            startLocation={startLocation}
                            setStartLocation={setStartLocation}
                        />
                 
                </ProgressStep>
                <ProgressStep label="Summary" scrollViewProps={defaultScrollViewProps} onSubmit={() => createEvent()}>
                    <Summary date={date} distance = {distance} event={event} currLocation={currLocation}/>
                </ProgressStep>
            </ProgressSteps>
        </View>
    )
}




export default Wizard;