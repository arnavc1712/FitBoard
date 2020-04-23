import React, {Component,useState} from 'react';
import {StyleSheet} from 'react-native';
import {Container} from 'native-base'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import configs from "../conf.json"
navigator.geolocation = require('@react-native-community/geolocation')
import MapView, { PROVIDER_GOOGLE,Marker,Callout,AnimatedRegion, Animated } from 'react-native-maps';
import { Col, Row, Grid } from "react-native-easy-grid";
// navigator.geolocation.getCurrentPosition(
//     (position) => {
//         console.log(position);
//     },
//     (error) => console.log(new Date(), error),
//     {enableHighAccuracy: true, timeout: 10000, maximumAge: 3000}
// );  
// animate(newCoordinate) {
//     const { coordinate } = this.state;
      
//     if (this.map){
//       this.map.animateToRegion({latitude: newCoordinate.latitude,
//                  longitude: newCoordinate.longitude,
//                  latitudeDelta: 0.015,
//                  longitudeDelta: 0.0121,},1000)
//     }
//       if (Platform.OS === 'android') {
//         if (this.marker) {
//           this.marker._component.animateMarkerToCoordinate(newCoordinate, 1000);
//         }
//       } else {
//         coordinate.timing(newCoordinate).start();
//       }
//     }

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

const DestinationPicker = () => {
    return (<Grid>
        <Row size={2} style={{zIndex:9999}}>
            <GooglePlacesAutocomplete
            placeholder='Enter Location'
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            console.log(data, details);
                }}
            styles={autocompleteSyles}
            currentLocation={true}
            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: configs["mapsDirectionsKey"],
                language: 'en', // language of the results
                // types: '(cities)' // default: 'geocode'
            }}
            />
        </Row>
        <Row size={5} style={{zIndex:-1}}>
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
            
            </MapView>
          </Row>
    </Grid>)
}

const autocompleteSyles = {
    
    textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth:0,
    },
    textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
    },
    predefinedPlacesDescription: {
    color: '#1faadb',
    },
}

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
  
   });
   


export default DestinationPicker;