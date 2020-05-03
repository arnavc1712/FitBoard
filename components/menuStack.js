import React, {Component,useEffect,useState} from 'react';
import {View,StyleSheet,Image} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from "./menu"
import Wizard from './wizard/wizard'
import ShowEvents from './registerEvents/showEvents'
import EventSummary from './track/Event';
const Stack = createStackNavigator();


const MenuStack = ({navigation,route}) => {
   console.log("Inside menu stack ", route.params);
    return (
       <Stack.Navigator>
           <Stack.Screen name="Menu" component={Menu} />
           <Stack.Screen name="Wizard" component={Wizard}/>
           <Stack.Screen name="ShowEvents" component={ShowEvents}/>
           <Stack.Screen name="EventSummary" component={EventSummary} initialParams={route.params}/>
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
export default MenuStack;