import React, {Component,useState,useEffect} from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import {Button,Text,Toast,List,ListItem,Right,Left} from 'native-base'
import { View,StyleSheet } from 'react-native';
import DestinationPicker from './destinationPicker';
import EventDetailPicker from './eventDetailPicker';
import Summary from './summary'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GetPaths} from '../../utils/getPaths'
import GetLocation from 'react-native-get-location'
import messaging from '@react-native-firebase/messaging';
import customStyles from '../../styles.json'

const defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flex: 1,
      justifyContent: 'center'
    }
  };



const Wizard = ({navigation,route}) => {
    const [date,setDate] = useState(new Date())
    const [event, setEvent] = useState(null)
    const [distance, setDistance] = useState(null)
    const [errors,setErrors] = useState(false)
    const [currLocation, setCurrLocation] = useState({"coords":route.params.currLocation,
                                                      "name":'',
                                                       "photo_reference":''})
                                        
    const [user,setUser] = useState(null)
    const [selectedPath,setSelectedPath] = useState([])
    const [destination,setDestination] = useState({})
    const [selectedIndex,setSelectedIndex] = useState(0)
    const [pathArr,setPathArr] = useState([])
    const [city,setCity] = useState('')
    const [state,setState] = useState('')
    const [country,setCountry] = useState('')
    const [zipCode,setZipCode] = useState('')
    const eventColl = firestore().collection('Events')
    const userColl = firestore().collection('Users')



    useEffect(() => {

        const subscriber = auth().onAuthStateChanged((user)=>setUser(user))
        const getPos = async () => {
            const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000,});
            let coordObj = {latitude:location["latitude"],longitude:location["longitude"]}
            setCurrLocation({coords:coordObj,
                             name:'',
                            photo_reference:''})
        }
        if(!currLocation.coords.latitude || !currLocation.coords.latitude){
            getPos()
        }
			// getCurrPos();
		return subscriber
	},[])

    const getPaths = async () => {
            
        let paths = await GetPaths(currLocation['coords'],distance)

        let parsePathArr = [];
        for (obj of paths){
            parsePathArr.push({coordinate:obj["coordinate"],path:obj["paths"][0]})
        }

        setPathArr(parsePathArr)
    }





    const createEvent = async () => {
        if(user){
            try{
                const newEvent = await eventColl.add({
                    type:event,
                    distance:distance,
                    source:{latitude:currLocation["coords"]["latitude"],
                            longitude:currLocation["coords"]["longitude"]},
                    locationName:currLocation["name"],
                    country:country,
                    state:state,
                    city:city,
                    zipCode:zipCode,
                    photoReference:currLocation["photo_reference"],
                    topic:`${state}-${city}-${zipCode}`,
                    timestamp:date,
                    destination:destination,
                    waypoints:selectedPath,
                    creator:user["email"],
                    registeredUsers:[user["email"]],
                    state:"created",
                    rankings:[],
                    createdAt:new Date()
                })
                let userData = await userColl.doc(user["email"]).get()
                let participatingEvents = userData._data.participatingEvents
                if(participatingEvents){
                    participatingEvents.push(newEvent.id)
                }
                else{
                    participatingEvents = [newEvent.id]
                }
                await userColl.doc(user["email"]).update({participatingEvents:participatingEvents})
                
                //subscribe to this event
                messaging()
                .subscribeToTopic(`${newEvent.id}`)
                .then(() => console.log(`Subscribed to topic! ${newEvent.id}`));

                Toast.show({text:"Successfully Created Event",buttonText:"Okay",duration:3000})
                navigation.navigate('MenuStack',{screen:'Menu'})




            }
            catch(error){
                alert("Error Submitting. Please Try again")
            }
            
            
         }

    }


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
            <ProgressSteps activeStepIconBorderColor={customStyles.tabs.color} completedProgressBarColor={customStyles.tabs.color} activeLabelColor={customStyles.tabs.color} activeStepNumColor="#673AB7" completedStepIconColor={customStyles.tabs.color}>
                <ProgressStep label="Event Details" scrollViewProps={defaultScrollViewProps} onNext={onDateNext} errors={errors} nextBtnTextStyle={{color:customStyles.tabs.color}} previousBtnTextStyle={{color:customStyles.tabs.color}}>
                    <EventDetailPicker
                        event={event}
                        setEvent={setEvent}
                        distance={distance}
                        setDistance={setDistance}
                        date={date}
                        setDate={setDate}
                    />
                   
                </ProgressStep>
                <ProgressStep label="Choose Path" scrollViewProps={defaultScrollViewProps} onNext={onChoosePathNext} errors={errors} nextBtnTextStyle={{color:customStyles.tabs.color}} previousBtnTextStyle={{color:customStyles.tabs.color}}>
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
                            setCity={setCity}
                            setCountry={setCountry}
                            setState={setState}
                            setZipCode={setZipCode}
                        />
                 
                </ProgressStep>
                <ProgressStep label="Summary" scrollViewProps={defaultScrollViewProps} onSubmit={() => createEvent()} nextBtnTextStyle={{color:customStyles.tabs.color}} previousBtnTextStyle={{color:customStyles.tabs.color}}>
                    <Summary date={date} distance = {distance} event={event} currLocation={currLocation}/>
                </ProgressStep>
            </ProgressSteps>
        </View>
    )
}




export default Wizard;