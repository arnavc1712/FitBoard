import React, { Component } from 'react';

import { Container, Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label} from 'native-base';
import {
  StyleSheet 
} from 'react-native';

import Constants from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


function HomeScreen() {
  return (
    <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </Container>
  );
}

function SettingsScreen() {
  return (
    <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </Container>
  );
}

const Tab = createBottomTabNavigator();

class Home extends Component {

	constructor(props){
		super(props)
	}

	render(){
		return(
			<Tab.Navigator
			screenOptions={({ route }) => ({
	          tabBarIcon: ({ focused, color, size }) => {
	            let iconName;

	            if (route.name === 'Home') {
	              iconName = focused
	                ? 'ios-information-circle'
	                : 'ios-information-circle-outline';
	            } else if (route.name === 'Settings') {
	              iconName = focused ? 'ios-list-box' : 'ios-list';
	            }

	            // You can return any component that you like here!
	            return <Ionicons name={iconName} size={size} color={color} />;
	          },
	        })}
	        tabBarOptions={{
	          activeTintColor: 'tomato',
	          inactiveTintColor: 'gray',
	        }}
			>
		        <Tab.Screen name="Home" component={HomeScreen} />
		        <Tab.Screen name="Settings" component={SettingsScreen} />
	      	</Tab.Navigator>
		)
	}
}


const styles = StyleSheet.create({

})

export default Home;