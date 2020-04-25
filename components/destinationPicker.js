import React, {Component,useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Container} from 'native-base'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import configs from "../conf.json"
// import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation')
import MapView, { PROVIDER_GOOGLE,Marker,Callout,AnimatedRegion, Animated } from 'react-native-maps';
import { Col, Row, Grid } from "react-native-easy-grid";
import GetLocation from 'react-native-get-location';
import { Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label,Toast} from 'native-base';
import {GetPaths} from './getPaths';


// var getPosition = function () {
//     return new Promise(function (resolve, reject) {
//       navigator.geolocation.getCurrentPosition(resolve, reject,{enableHighAccuracy: true,timeout: 15000});
//     });
//   }



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

const DestinationPicker = ({distance, currLocation,setCurrLocation,startLocation,setStartLocation}) => {

    const [map,setMap] = useState()
    const [marker,setMarker] = useState()
    const [destinationMarker, setDestinationMarkers] = useState();
    
    const [animating, setAnimate] = useState();
    useEffect(() => {
        const getCurrPos = async () => {
            try{
                const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000,});
                let coordObj = {latitude:location["latitude"],longitude:location["longitude"]}
                setStartLocation(coordObj);
                setCurrLocation(coordObj)
                animate(coordObj);

                // await getEndPoints(coordObj);
                // getEndPoints(coordObj);
                // const origin = {latitude: 33.419734999999996, longitude: -111.9164663};
                GetPaths(coordObj, '5K');
                
            }
            catch(error){
                console.log("Error 1", error)
            }
        }
        
        getCurrPos();
      },[map,marker]);
    



    const animate = (newCoordinates) => {
        if (map){
            map.animateToRegion({latitude: newCoordinates.latitude,
                        longitude: newCoordinates.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121},1000)
        }
        if (Platform.OS === 'android') {
            if (marker) {
                marker["animateMarkerToCoordinate"](newCoordinates, 10);
            }
            } else {
                startLocation.timing(newCoordinates).start();
            }
        }
        
    return (
    
    <Grid>
        <Row size={5} >
            <MapView
                showUserLocation={true}
                ref={(map) => { setMap(map); }}
                customMapStyle={mapStyle}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                initialRegion={{
                    latitude: currLocation["latitude"],
                    longitude: currLocation["longitude"],
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
            <Marker.Animated
                ref={mark => { setMarker(mark); }}
                style={{zIndex:1}}
                flat={true}
                coordinate={currLocation}
                key="Asasas"
            />     
            {/* {destinationMarker != null && destinationMarker.length > 0? destinationMarker.map((item, index) =>(
                <MapView.Marker 
                coordinate={{'latitude':item.lat, 'longitude':item.lng}} 
                title={item.name} 
                icon={item.icon} 
                key={index}
                />
            )) : <Text></Text>} */}


            </MapView>

            <GooglePlacesAutocomplete
                placeholder='Enter Location'
                minLength={2}
                autoFocus={false}
                listViewDisplayed={false}
                returnKeyType={'default'}
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    // let name = null;
                    if ("description" in data){
                        setStartLocation(data["description"].split(",")[0])
                    }
                    else{
                        setStartLocation(data["name"].split(",")[0])
                    }
                    let coordObj = {latitude:details["geometry"]["location"]["lat"],longitude:details["geometry"]["location"]["lng"]};
                    animate(coordObj);
                    setCurrLocation(coordObj);
                    GetPaths(coordObj, '5K');
                    
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
    listView:{backgroundColor:'white',maxHeight:'50%'},
    
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