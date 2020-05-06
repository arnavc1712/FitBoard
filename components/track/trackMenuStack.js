import React, {Component,useEffect,useState} from 'react';
import {View,StyleSheet,Image} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EventSummary from './eventSummary'
import Track from './Track';
import PastEvents from './pastEvents';
const Stack = createStackNavigator();


const Events = ({navigation,route}) => {

   console.log("Inside Event stack ", route.params);
    return (
       <Stack.Navigator initialRouteName="Track">
           <Stack.Screen name="PastEvents" component={PastEvents}/>
           <Stack.Screen name="EventSummary" component={EventSummary} initialParams = {route.params}/>
       </Stack.Navigator>
    )
}

export default Events;