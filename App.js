/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { Component,useState,useEffect } from 'react';

import {
  StyleSheet 
} from 'react-native';

import {Root} from 'native-base'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import LoginScreen from './components/login'
import HomeNavScreen from './components/home'


const Stack = createStackNavigator();

const App = () => {

    const [currentUser,setUser] = useState()
    const [loggedIn,setLoggedIn] = useState(false)


    useEffect(()=>{
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber
    },[])

    const onAuthStateChanged = (user) => {
      console.log(user)
      if (user && user.emailVerified) {
        setUser(user)
        setLoggedIn(true)
      }
      else {
        setUser(null)
        setLoggedIn(false)
      }
    }

    let renderedComponent = null

    if(loggedIn){
      renderedComponent = <Stack.Screen name="Home" component={HomeNavScreen} options={{headerStyle:{backgroundColor:'#00695C'},headerTintColor:'white'}}/>
    }
    else{
      renderedComponent = <React.Fragment>
                              <Stack.Screen name="Login" component={LoginScreen} options={{headerStyle:{backgroundColor:'#00695C'},headerTintColor:'white'}}/>
                              
                            </React.Fragment>
    }

    return (
      <Root>
        <NavigationContainer>
          <Stack.Navigator>
            {renderedComponent}
          </Stack.Navigator>
        </NavigationContainer>
      </Root>
    );
};

const styles = StyleSheet.create({
})

export default App;

