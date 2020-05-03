import React, {Component,useEffect,useState} from 'react';
import {View,StyleSheet,Image} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from "./landing"
import Wizard from './wizard/wizard'
import ShowEvents from './registerEvents/showEvents'
const Stack = createStackNavigator();


const MenuStack = ({navigation,route}) => {
   
    
    return (
       <Stack.Navigator>
           <Stack.Screen name="Menu" component={ProfileScreen} options={{header: () => null}}/>
           <Stack.Screen name="Wizard" component={Wizard}/>
           <Stack.Screen name="ShowEvents" component={ShowEvents}/>
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