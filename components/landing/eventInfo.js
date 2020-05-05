import React, { Component } from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import {List,ListItem,Left,Right,Text,Icon,Button,Toast,Body} from 'native-base'
import configs from '../../conf.json'
import { Col, Row, Grid } from "react-native-easy-grid";
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE,Marker,Callout,AnimatedRegion, Animated } from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

const placePhoto = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${configs["mapsDirectionsKey"]}`
}

const EventScreen = ({event,onUnregister}) => {

    

    return (
        <Grid>
            <Row size={1}>
                <Image source={{uri:placePhoto(event.photoReference)}} style={styles.image}/>
            </Row>
            <Row size={1} style={{alignItems:'center'}}>
                 <List style={{width:'100%'}}>
                    <ListItem icon noBorder>
                            <Left>
                                <Button style={{ backgroundColor: "#FF9501" }}>
                                    <Icon active name="body" />
                                </Button>
                            </Left>
                        
                            <Body><Text>{event.type} ({event.distance})</Text></Body>

                    </ListItem>
                    <ListItem icon noBorder>
                            <Left>
                                <Button style={{ backgroundColor: "#FF9501" }}>
                                    <Icon active name="compass" />
                                </Button>
                            </Left>
                        
                            <Body><Text style={{fontSize:14}}>{event.locationName}</Text></Body>

                    </ListItem>
                    <ListItem icon noBorder>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name="calendar" />
                            </Button>
                        </Left>
                      
                        <Body><Text>{moment(event.timestamp).format("Do MMM YYYY")}</Text></Body>

                    </ListItem>
                    <ListItem icon noBorder>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name="time" />
                            </Button>
                        </Left>
                      
                        <Body><Text>{moment(event.timestamp).format("hh:mm a ([MST])")}</Text></Body>

                    </ListItem>
                </List>
            </Row>
            <Row size={1}>
            <MapView
                        // customMapStyle={mapStyle}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        initialRegion={{
                            latitude: event.source.latitude,
                            longitude: event.source.longitude,
                            latitudeDelta: 0.2,
                            longitudeDelta: 0.2,
                            }}
                        
                        >
                
                        <Marker
                            style={{zIndex:1}}
                            // flat={true}
                            coordinate={event.source}
                        /> 

                   
                        <MapViewDirections
                                origin={event.source}
                                destination={event.destination}
                                apikey={configs["mapsDirectionsKey"]}
                                waypoints={event.waypoints}
                                strokeWidth={6}
                                strokeColor="hotpink"
                            />
                    
                        <Marker 
                            coordinate={event.destination}
                        
                            pinColor="#00B8D4"
                        />
                
                    </MapView>
            </Row>
            <Row size={1} style={{alignItems:'center',justifyContent:'center'}}>
                <Button full rounded danger style={{alignSelf:'center'}} onPress={()=>{onUnregister(event)}}><Text style={{fontSize:20}}>Unregister</Text></Button>
            </Row>
        </Grid>
    )
}


const styles = StyleSheet.create({
    image: {
        flex: 1,
        width:null,
        height:null
        // resizeMode: "stretch",
        // justifyContent: "center"
      },
    imageContainer: {
      height:240,
      backgroundColor: '#FFF',
  
    },
    map: {
        ...StyleSheet.absoluteFillObject,
            // position:'absolute',
        },
    
  })

export default EventScreen;