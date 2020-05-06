import React, { Component,useEffect,useState } from 'react';

import { Container, Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label,Toast} from 'native-base';
import {
  StyleSheet 
} from 'react-native';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LogoutScreen from './authentication/logout';
import viewMaps from './viewMaps';
import MenuStack from './menuStack';
import auth from '@react-native-firebase/auth';
import TrackMenu from './track/trackMenuStack';
import PastEvents from './track/pastEvents';
import ProfileScreen from './landing';
import messaging from '@react-native-firebase/messaging'


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



const Tab = createMaterialBottomTabNavigator();

const Home = ({navigation,route}) => {
		// const [currLocation,setCurrLocation] = useState({latitude:null,longitude:null})
	
			
			messaging().onNotificationOpenedApp(remoteMessage => {
				console.log(
					'Notification caused app to open from background state:',
					remoteMessage.notification,
				);
				navigation.navigate('MenuStack',{screen:'ShowEvents'});
			});

		
		return(
			<Tab.Navigator
					activeColor='#ba68c8'
					inactiveColor='gray'
					barStyle={{ backgroundColor: 'white' }}
			>
				<Tab.Screen name="MenuStack" component={MenuStack} options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}/>
		      <Tab.Screen name="TrackMenu" component={TrackMenu} options={{
          tabBarLabel: 'Track',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" color={color} size={26} />
          ),
        }}/>

		<Tab.Screen name="Past Events" component={PastEvents} options={{
          tabBarLabel: 'Past Events',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" color={color} size={26} />
          ),
        }}/>

						<Tab.Screen name="Logout" component={LogoutScreen} 
					
		        			listeners={{ tabPress: e => {
		        							console.log(e)
		        							logout()
												} }}
									options={{
										tabBarLabel: 'Logout',
										tabBarIcon: ({ color }) => (
											<MaterialCommunityIcons name="logout" color={color} size={26} />
										),
									}}
									
		        />
	      	</Tab.Navigator>
		)
}


const styles = StyleSheet.create({

})

export default Home;