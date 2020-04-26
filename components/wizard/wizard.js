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
import {GetPaths} from '../../utils/getPaths'
const defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flex: 1,
      justifyContent: 'center'
    }
  };



const Wizard = ({navigation}) => {

    const [date,setDate] = useState(new Date())
    const [event, setEvent] = useState(null)
    const [distance, setDistance] = useState(null)
    const [errors,setErrors] = useState(false)
    const [currLocation, setCurrLocation] = useState({"coords":{latitude:38.4214278,longitude:-111.9185674},
                                                      "name":'',
                                                       "photo_reference":''})
                                        
    const [user,setUser] = useState(null)
    const [selectedPath,setSelectedPath] = useState([])
    const [destination,setDestination] = useState({})
    const [selectedIndex,setSelectedIndex] = useState(0)
    const [pathArr,setPathArr] = useState([])
    const eventColl = firestore().collection('Events')

    const getPaths = async () => {
            
        let paths = await GetPaths(currLocation['coords'],distance)

        let parsePathArr = [];
        for (obj of paths){
            parsePathArr.push({coordinate:obj["coordinate"],path:obj["paths"][0]})
        }

        setPathArr(parsePathArr)
    }
    
    useEffect(()=>{
        const subscriber = auth().onAuthStateChanged((user)=>setUser(user))
        return subscriber
    },[])




    const createEvent = async () => {
        if(user){
            try{
                await eventColl.add({
                    type:event,
                    distance:distance,
                    coords:{latitude:currLocation["coords"]["latitude"],
                            longitude:currLocation["coords"]["longitude"]},
                    locationName:currLocation["name"],
                    photoReference:currLocation["photo_reference"],
                    timestamp:date,
                    destination:destination,
                    waypoints:selectedPath,
                    creator:user["email"]
                })

                Toast.show({text:"Successfully Created Event",buttonText:"Okay",duration:3000})
                navigation.navigate('MenuStack',{screen:'Menu'})




            }
            catch(error){
                alert("Error Submitting. Please Try again")
            }
            
            
         }

    }


    useEffect(() => {
        const getCurrPos = async () => {
            try{
                
                const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000,});
                let coordObj = {latitude:location["latitude"],longitude:location["longitude"]}
                setCurrLocation({'coords':coordObj,
                                  'name':'Current Location',
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

    const onChoosePathNext = () => {
        if(Object.keys(destination).length>0 && selectedPath!=null && selectedPath.length>0){
            setErrors(false)
        }
        else{
            setErrors(true)
            Toast.show({text:"Please choose the starting location as well as a path",buttonText:"Okay",duration:3000})
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
                <ProgressStep label="Choose Path" scrollViewProps={defaultScrollViewProps} onNext={onChoosePathNext} errors={errors}>
                        <DestinationPicker 
                            currLocation={currLocation}
                            setCurrLocation={setCurrLocation}
                            distance={distance}
                            setSelectedPath={setSelectedPath}
                            setDestination={setDestination}
                            selectedPath={selectedPath}
                            destination={destination}
                            pathArr={pathArr}
                            setPathArr={setPathArr}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
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