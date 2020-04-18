import React, { Component } from 'react';

import { Container, Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label,Toast} from 'native-base';
import {
  StyleSheet 
} from 'react-native';

import Constants from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LogoutScreen from './logout';
import viewMaps from './viewMaps';
import auth from '@react-native-firebase/auth';
import pedoMeter from './pedoMeter';


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

const logout = async () => {
	try {
		await auth().signOut()
		Toast.show({text:"Successfully Logged Out",buttonText:"Okay",duration:750})
	}

	catch(error) {
			Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
			console.log(error)
	}
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
	            else if (route.name == "Logout") {
	            	iconName = 'logout'
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
		        <Tab.Screen name="Home" component={viewMaps} />
						<Tab.Screen name="Pedometer" component={pedoMeter}/>
		        <Tab.Screen name="Settings" component={SettingsScreen} />
		        <Tab.Screen name="Logout" component={LogoutScreen} 
		        			listeners={{ tabPress: e => {
		        							console.log(e)
		        							logout()
		        						} }}
		        />
	      	</Tab.Navigator>
		)
	}
}


const styles = StyleSheet.create({

})

export default Home;