import React, {Component,useState,useEffect} from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import {Button,Text,Toast} from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import { View,StyleSheet } from 'react-native';
import DestinationPicker from './destinationPicker';
import EventDetailPicker from './eventDetailPicker';
import GetLocation from 'react-native-get-location'


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
    const [currLocation, setCurrLocation] = useState({latitude:38.4214278,longitude:-111.9185674})
    const [startLocation, setStartLocation] = useState('')

    useEffect(() => {
        const getCurrPos = async () => {
            try{
                
                const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000,});
                let coordObj = {latitude:location["latitude"],longitude:location["longitude"]}
                setCurrLocation(coordObj)
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
                <ProgressStep label="Date and time" scrollViewProps={defaultScrollViewProps} onNext={onDateNext} errors={errors}>
                    <EventDetailPicker
                        event={event}
                        setEvent={setEvent}
                        distance={distance}
                        setDistance={setDistance}
                        date={date}
                        setDate={setDate}
                    />
                   
                </ProgressStep>
                <ProgressStep label="Second Step" scrollViewProps={defaultScrollViewProps}>
                        <DestinationPicker 
                            currLocation={currLocation}
                            setCurrLocation={setCurrLocation}
                            startLocation={startLocation}
                            setStartLocation={setStartLocation}
                        />
                 
                </ProgressStep>
                <ProgressStep label="Third Step" scrollViewProps={defaultScrollViewProps}>
                    <View style={{ alignItems: 'center' }}>
                        <Text>This is the content within step 3!</Text>
                    </View>
                </ProgressStep>
            </ProgressSteps>
        </View>
    )
}




export default Wizard;