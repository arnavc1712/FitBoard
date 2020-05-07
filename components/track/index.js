import React, {Component,useEffect,useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Track from './track';
import Countdown from './countdown'
import firestore from '@react-native-firebase/firestore';
const Stack = createStackNavigator();

const TrackStack = ({navigation,route}) => {
    const eventColl = firestore().collection("Events")
    // const [eventData,setEventData] = useState(null)
    const [eventState,setEventState] = useState("starting")
    const onSetEventState = async () => {
        let eventData = await eventColl.doc(route.params.eventId).get()
        setEventState(eventData.data().state)
    }
    useEffect(()=>{
        try{
            onSetEventState()
        }
        catch(err){
            console.log(err)
        }
        
    },[])
    return (
       <Stack.Navigator>
           {eventState=="starting" && <Stack.Screen name="Countdown" component={Countdown} initialParams = {{eventId:route.params.eventId}}/>}
           
           <Stack.Screen name="Track" component={Track} initialParams = {{eventId:route.params.eventId}}/>
       </Stack.Navigator>
       
    )
}

export default TrackStack;