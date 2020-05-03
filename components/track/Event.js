import React, { Component, useState, useEffect } from 'react';
import { Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label,Toast} from 'native-base';
import {
  StyleSheet ,
  View
} from 'react-native';
import { Container, Card, CardItem, Thumbnail, Icon, Left, Right } from 'native-base';
import { Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';
const win = Dimensions.get('window');
const ratio = win.width/400;
import configs from "../../conf.json"

const placePhoto = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${configs["mapsDirectionsKey"]}`
}

const EventSummary = ({eventId, eventData}) => {
    console.log( placePhoto(eventData.photoReference));
    return(

    <View>
        
        <Header />
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Body>
                <Text note>Event Details for {eventId}</Text>
                <Text note>GeekyAnts</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
                <Image  style={styles.cardImage} source={{uri:placePhoto(eventData.photoReference)}} />
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active name="thumbs-up" />
                  <Text>12 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>11h ago</Text>
              </Right>
            </CardItem>
          </Card>
        </Content>
    </View>
    );
}
const styles = StyleSheet.create({
    cardImage:{ 
        width: win.width,
        height: 362 * ratio,
        flex: 1 },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });
export default EventSummary;