import React, {Component} from 'react'

import { View,StyleSheet } from 'react-native';
import {List,ListItem,Right,Left,Text} from 'native-base'
import moment from 'moment';



const Summary = ({distance,date,event,currLocation}) => {


    return (
        <View>
            <List>
                <ListItem>
                    <Left style={{flex:1}}><Text>Event</Text></Left>
                    <Right style={{flex:1}}><Text>{event}</Text></Right>
                </ListItem>
                <ListItem>
                    <Left style={{flex:1}}><Text>Distance</Text></Left>
                    <Right style={{flex:1}}><Text>{distance}</Text></Right>
                </ListItem>

                <ListItem>
                    <Left style={{flex:1}}><Text>Date</Text></Left>
                    <Right style={{flex:1}}><Text>{moment(date).format("Do MMM YYYY")}</Text></Right>
                </ListItem>

                <ListItem>
                    <Left style={{flex:1}}><Text>Time</Text></Left>
                    <Right style={{flex:1}}><Text>{moment(date).format("hh:mm a ([MST])")}</Text></Right>
                </ListItem>

                <ListItem>
                    <Left style={{flex:1}}><Text>Starting Point</Text></Left>
                    <Right style={{flex:1}}><Text>{currLocation["name"].split(",")[0]}</Text></Right>
                </ListItem>
                
            
            </List>
        </View>
    )
}


export default Summary;