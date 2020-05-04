import React, {Component,useEffect,useState} from 'react';
import {View,StyleSheet,Image} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EventSummary from './Event';
import Track from './Track';
const Stack = createStackNavigator();


const TrackMenu = ({navigation,route}) => {
    const [eventId, setEventId] = useState(route.params.eventId);   
   console.log("Inside track stack ", eventId);
    return (
       <Stack.Navigator initialRouteName="Track">
           <Stack.Screen name="Track" component={Track} initialParams = {{"eventId" : eventId}}/>
           <Stack.Screen name="EventSummary" component={EventSummary}/>
       </Stack.Navigator>
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
export default TrackMenu;