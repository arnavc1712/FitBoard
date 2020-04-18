import MapView, { PROVIDER_GOOGLE,Marker,Callout,AnimatedRegion, Animated } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {View,StyleSheet,Image} from 'react-native';
import React, {Component} from 'react';
import {Container,Text,Content,Header, Icon, Picker, Form,Button,Item,Input} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
// import firestore from '@react-native-firebase/firestore';

import firebase from '@react-native-firebase/app';
import MapViewDirections from 'react-native-maps-directions';
import configs from "../conf.json"

const origin = {latitude: 33.419734999999996, longitude: -111.9164663};
const destination = {latitude: 33.4154404, longitude: -111.9155886};
// import Modal from "react-native-modal";


// Geocoder.init("AIzaSyBfnMT32j2IPKOiQBkmnfEEUWiLiNKRo0o");



const styles = StyleSheet.create({
 container: {
   // ...StyleSheet.absoluteFillObject,
   // flex:1,
   // justifyContent: 'flex-end',
   // alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,

 },
 // button
 picker:{
  width: "50%",
  alignSelf:'center',
  justifyContent:'center',
  alignItems:'center',
  marginTop:20
 },
 address:{
  marginTop:20,
  width:'50%',
  alignSelf:'center'
 },
 button:{
  marginTop:20,
  width:'50%',
  alignSelf:'center'
 },
 input:{
  borderColor: '#009688'
 }
});

const mapStyle = [
    {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#ff0000"
            }
        ]
    }
]

   

const ViewMaps = () => {

  let map = null;

  return(
      
    <Container style={styles.container}>

      <Grid>
        <Row size={3}>
          <MapView
             // showUserLocation={true}
            ref={(map) => { map = map; }}
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            initialRegion={{
             latitude: 33.419734999999996,
             longitude: -111.9164663,
             latitudeDelta: 0.015,
             longitudeDelta: 0.0121,
           }}
            
          >
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={configs["mapsDirectionsKey"]}
            strokeWidth={3}
            strokeColor="hotpink"
          />
          </MapView>
        </Row>

        <Row size={1} >
          <Container>
            
          </Container>
        </Row>
          
    </Grid>

       </Container>


   )

}

export default ViewMaps;