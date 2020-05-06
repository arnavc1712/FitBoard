import React, {Component,useEffect,useState} from 'react';
import {View,StyleSheet,Image} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EventSummary from './eventSummary'
import Track from './Track';
const Stack = createStackNavigator();


const TrackMenu = ({navigation,route}) => {

   console.log("Inside track stack ", route.params);
    return (
       <Stack.Navigator initialRouteName="Track">
           <Stack.Screen name="Track" component={Track} initialParams = {route.params}/>
           <Stack.Screen name="EventSummary" component={EventSummary} initialParams = {route.params}/>
       </Stack.Navigator>
    )
}

export default TrackMenu;