/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { Component } from 'react';

import {
  StyleSheet 
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './components/login'
import HomeNavScreen from './components/home'


const Stack = createStackNavigator();

export default class App extends Component {

  constructor(props){
    super(props);

    
  }
  render(){
    return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerStyle:{backgroundColor:'#00695C'},headerTintColor:'white'}}/>
        <Stack.Screen name="Home" component={HomeNavScreen} options={{headerStyle:{backgroundColor:'#00695C'},headerTintColor:'white'}}/>

      </Stack.Navigator>
    </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
})


