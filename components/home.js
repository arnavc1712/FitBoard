import React, { Component,useEffect,useState } from 'react';

import { Container, Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label,Toast} from 'native-base';
import {
  StyleSheet 
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LogoutScreen from './logout';
import viewMaps from './viewMaps';
import MenuStack from './menuStack';
import auth from '@react-native-firebase/auth';
import Track from './track/Track';


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

const Home = ({navigation,route}) => {
		// const [currLocation,setCurrLocation] = useState({latitude:null,longitude:null})
	
			
	// 		messaging().onNotificationOpenedApp(remoteMessage => {
	// 			console.log(
	// 				'Notification caused app to open from background state:',
	// 				remoteMessage.notification,
	// 			);
	// 			navigation.navigate('MenuStack',{screen:'ShowEvents'});
	// 		});
	// 		const getToken = async() => {
	// 			await messaging().subscribeToTopic('weather')
	// 			console.log("Subscribed to topic")
  // // .then(() => console.log('Subscribed to topic!'));
	// 			await messaging().registerDeviceForRemoteMessages();

  // // Get the token
	// 			const token = await messaging().getToken();
	// 			console.log("Device token")
	// 			console.log(token)
	// 		}
	// 		getToken()
		
		return(
			<Tab.Navigator
			screenOptions={({ route }) => ({
	          tabBarIcon: ({ focused, color, size }) => {
	            let iconName;

	            if (route.name === 'Home') {
	              iconName = focused
	                ? 'ios-information-circle'
	                : 'ios-information-circle-outline';
	            } else if (route.name === 'MenuStack') {
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
				<Tab.Screen name="MenuStack" component={MenuStack}/>
		        <Tab.Screen name="Maps" component={viewMaps} />
				<Tab.Screen name="Track" component={Track} />
		        <Tab.Screen name="Logout" component={LogoutScreen} 
		        			listeners={{ tabPress: e => {
		        							console.log(e)
		        							logout()
		        						} }}
		        />
	      	</Tab.Navigator>
		)
}


const styles = StyleSheet.create({

})

export default Home;