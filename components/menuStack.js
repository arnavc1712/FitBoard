import React, {Component} from 'react';
import {Container,Text,Content,Header, Icon, Picker, Form,Button,Item,Input} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {View,StyleSheet,Image} from 'react-native';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from "./menu"
import Wizard from './wizard'
const Stack = createStackNavigator();


const MenuStack = () => {
    
    return (
       <Stack.Navigator>
           <Stack.Screen name="Menu" component={Menu} />
           <Stack.Screen name="Wizard" component={Wizard}/>

       </Stack.Navigator>
        // <Grid style={styles.grid}>
        //     <Row style={styles.row1} size={1}></Row>
        //     <Row style={styles.row2} size={1}>
        //     <Button full rounded style={styles.button}><Text style={{fontSize:12}}> Create Event </Text></Button>
        //     <Button full rounded style={styles.button}><Text style={{fontSize:12}}> Register for Event </Text></Button>
        //     </Row>
        // </Grid>
       
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