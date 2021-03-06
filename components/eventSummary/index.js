
import React, {Component,useEffect,useState} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Analysis from './Analysis'
import UserRankings from './userRankings'
import customStyle from '../../styles.json'

const Tab = createMaterialTopTabNavigator();


const EventSummary =  ({route}) => {
    const {eventId,myid} = route.params 
    // const myId = useState(null)
    // console.log(props.route)
    console.log(eventId,myid)
    return (
        <Tab.Navigator tabBarOptions={{labelStyle:{fontWeight:'bold',fontFamily:'roboto'},indicatorStyle:{backgroundColor:customStyle.tabs.color}}}>
            <Tab.Screen name="Leaderboard" component={UserRankings} initialParams={{eventId:eventId,myid:myid}}  />
            <Tab.Screen name="Analysis" component={Analysis} initialParams={{eventId:eventId,myid:myid}} options={{header: () => null}}/>
        </Tab.Navigator>
    );
}

export default EventSummary