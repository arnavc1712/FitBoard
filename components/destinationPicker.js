import React, {Component,useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Container} from 'native-base'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import configs from "../conf.json"
// import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation')
import MapView, { PROVIDER_GOOGLE,Marker,Callout,AnimatedRegion, Animated } from 'react-native-maps';
import { Col, Row, Grid } from "react-native-easy-grid";


var getPosition = function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
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

    // const [selectedCoordinates, setSelectedCoordinates] = useState({latit})
    useEffect(() => {
        // Update the document title using the browser API
        const getCurrPos = async () => {
            try{
                const location = await getPosition();
                console.log(location)
            }
            catch(error){
                console.log(error);
            }
        }
        
        getCurrPos();
      },[]);
   
    return (<Grid>
        <Row size={5} >
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

             <GooglePlacesAutocomplete
            placeholder='Enter Location'
            minLength={2}
            autoFocus={true}
            returnKeyType={'default'}
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            console.log(data, details);
                }}
            styles={autocompleteSyles}
            currentLocation={true}
            currentLocationLabel="Places around me"
            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: configs["mapsDirectionsKey"],
                language: 'en', // language of the results
                // types: '(cities)' // default: 'geocode'
            }}
            />
          </Row>
    </Grid>)
}

const autocompleteSyles = {
    listView:{backgroundColor:'white',maxHeight:'30%'},
    
    // position:'absolute',
    textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth:0,
    // position:'absolute'
    },
    textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
    // position:'absolute'
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
        position:'absolute',
    },
  
   });
   


export default DestinationPicker;