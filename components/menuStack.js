import React, {Component,useEffect,useState} from 'react';
import {View,StyleSheet,Image} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from "./landing"
import Wizard from './wizard/wizard'
import ShowEvents from './registerEvents/showEvents'
import TrackStack from './track/';
const Stack = createStackNavigator();

const MenuStack = ({navigation,route}) => {
   console.log("Inside menu stack ", route.params);
    return (
       <Stack.Navigator>
           <Stack.Screen name="Menu" component={ProfileScreen} options={{header: () => null}}/>
           <Stack.Screen name="Wizard" component={Wizard}/>
           <Stack.Screen name="ShowEvents" component={ShowEvents}/>
           <Stack.Screen name="TrackStack" component={TrackStack} options={{header: () => null}}/>
       </Stack.Navigator>
       
    )
}

export default MenuStack;