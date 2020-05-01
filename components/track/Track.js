import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE
} from "react-native-maps";
import haversine from "haversine";

import firestore from '@react-native-firebase/firestore';
import {getDistance} from './getDistanceOfUsers';
import auth from '@react-native-firebase/auth';
// import {checkPointOnLine} from './checkPointOnLine';


const randomColor = require('randomcolor'); // import the script


const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const EVENT_ID = 'HZPr73HED35xypBWZOQY';
const MY_ID = 'abhidagar1@gmail.com';
const eventColl = firestore().collection('Events')

class Track extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          speed: [],
          currentSpeed : 0,
          routeTravelledCoordinates: [],
          distanceTravelled:[],
          totalDistanceTravelled: 0,
          prevLatLng: {},
          eventid: EVENT_ID, //replace this later with props.EVENT_ID
          evendetails: null,
          myid: null, //replace this later with props.myid
          otherPlayersLocation: {},
          prevLatLng: {},
          eventData: null,
          routeColor: '#000',
          travelledRouteColor: randomColor(),
          currentPosition: -1,
          coordinate: new AnimatedRegion({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: 0,
            longitudeDelta: 0
          })
        };
      }

    update_firebase_location(newCoordinate){
        
        if(this.state.eventid != null && this.state.myid != null){
            const collection_name = this.state.eventid;
            const doc_name = this.state.myid;
            let res = {};
            res['coordinate'] = newCoordinate;
            res['user'] = this.state.myid;
            res['route'] = this.state.routeTravelledCoordinates;
            res['distance'] = this.state.distanceTravelled;
            res['total_distance'] = this.state.totalDistanceTravelled;
            res['speed'] = this.state.speed;
            console.log("Inside update_firebase_location", res);
            firestore().collection(collection_name).doc(doc_name).set(res);
        }
        else{
            console.log("EVENTID NULL");
            return;
        }
    }

    async getAllDistances(){
        //getDistanceTravelledForAllUsers
        getDistance(this.state.eventid)
        .then((distance_ranking) =>{
            if(!distance_ranking) return;
            console.log("Total Distance ", distance_ranking);
            console.log("Position ", distance_ranking.indexOf(this.state.myid))
            this.setState({
                currentPosition : distance_ranking.indexOf(this.state.myid)+1
            })
        })

    }

    populateEventDetail(){
        //getEventDetail
        console.log("Inside populate Event details");
        let query = eventColl.doc(this.state.eventid).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No Event document');
                } else {
                // console.log('Event data:', doc.data());
                this.setState({
                    eventData: doc.data(),
                    routeColor: randomColor()
                })
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }

    getCurrentLocation(){
        console.log("Get current location");
        //getCurrentLocation
        navigator.geolocation.getCurrentPosition(
            position => {
            // console.log("Got Current Location", position);
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
              });
            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
        );
    }

    watchPosition(){
        console.log("Inside watch position");
        //watch position
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const { routeTravelledCoordinates, speed, totalDistanceTravelled, distanceTravelled} = this.state;
                const { latitude, longitude} = position.coords;
                const speed_val = position.coords.speed < 0 ? 0 : Math.round(position.coords.speed);
                const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }
                console.log("Speed ", speed_val);
                let newCoordinate = {
                    latitude,
                    longitude
                };
              

                //update and move the marker
                if (Platform.OS === "android") {
                    if (this.marker) {
                      this.marker.animateMarkerToCoordinate(
                        newCoordinate,
                        500
                      );
                    }
                  } else {
                    coordinate.timing(newCoordinate).start();
                }

                this.setState({
                    speed: speed.concat([speed_val]),
                    currentSpeed: speed_val, 
                    latitude,
                    longitude,
                    distanceTravelled: distanceTravelled.concat([this.calcDistance(newLatLngs)]),
                    totalDistanceTravelled: totalDistanceTravelled + this.calcDistance(newLatLngs),
                    routeTravelledCoordinates: routeTravelledCoordinates.concat([newCoordinate]),
                    prevLatLng: newLatLngs
                });

                //now send this updated location to firebase also
                //do so only when the eventid and current location is set
                this.update_firebase_location(newCoordinate);
                this.getAllDistances();

            },
            error => console.log(error),
            {
                enableHighAccuracy: false,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 5                
            }
        );
    }

    listenForUpdate(){
        // listen to firebase location updates
        console.log("Inside listener");
        const ref = firestore().collection(this.state.eventid);
        let observer = ref.onSnapshot(docSnapshot => {
            var  otherPlayersLocation = this.state.otherPlayersLocation;
            if(otherPlayersLocation == null) otherPlayersLocation = {};
            docSnapshot.forEach( (doc) => {
                let data = doc.data();
                let userid = data.user;

                if(userid == this.state.myid) return;
                let user_location = data.coordinate;
                otherPlayersLocation[userid] = user_location;
            });
            this.setState({
              otherPlayersLocation: otherPlayersLocation
            });
        }, 
        err => {
            console.log(`Encountered error: ${err}`);
        });
    }

    getCurrentUser(){
      auth().onAuthStateChanged((user) =>{
        console.log("Current User ", user);
        this.setState({
          myid: user.email
        })
      })
    }

    displayOtherPlayer(){
      console.log("Inside Display Other Player")
      let keys = Object.keys(this.state.otherPlayersLocation);
      return keys.map( (keyName, keyIndex) => {
        return <Marker
            coordinate={this.state.otherPlayersLocation[keyName]}
            title={keyName}
            key={keyName}
            pinColor={randomColor()}
        />
      })
    }

    componentDidMount() {
        this.getCurrentUser();
        
        this.populateEventDetail();

        this.getAllDistances();

        this.getCurrentLocation();
        
        this.watchPosition();

        this.listenForUpdate();


    }

    calcDistance(newLatLng) {
        const { prevLatLng } = this.state
        console.log("Distance ", (haversine(prevLatLng, newLatLng) || 0));
        return (haversine(prevLatLng, newLatLng) || 0)
      }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    render() {
        {
        console.log("My Location ", {'latitude':this.state.latitude, 'longitude':this.state.longitude});
        if(this.state.otherPlayersLocation){
          Object.keys(this.state.otherPlayersLocation).map( (keyName, keyIndex) => {
            console.log("Key ", keyName, "Coords ", this.state.otherPlayersLocation[keyName]);
          })
        }
      }
        return (
          <View style={styles.container}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={this.getMapRegion()}
                showsUserLocation={true}
                // followUserLocation={true}
            >
                {
                this.state.eventData && 
                <Fragment>
                    <Marker 
                        title="Start"
                        coordinate = {this.state.eventData.waypoints[0]}
                        pinColor = {randomColor()}
                    />

                    <Marker 
                        title={this.state.myid}
                        coordinate = {{'latitude':this.state.latitude, 'longitude':this.state.longitude}}
                        pinColor = {randomColor()}
                    />
                    <Polyline
                        coordinates={this.state.eventData.waypoints}
                        strokeColor={this.state.routeColor} // fallback for when `strokeColors` is not supported by the map-provider
                        strokeWidth={6}
                    />
                    <Marker 
                        title="Finish"
                        coordinate = {this.state.eventData.destination}
                        pinColor = {randomColor()}
                    />

                    <Polyline
                        coordinates={this.state.routeTravelledCoordinates}
                        strokeColor={this.state.travelledRouteColor} // fallback for when `strokeColors` is not supported by the map-provider
                        strokeWidth={6}
                    />
                    {
                        this.displayOtherPlayer()
                    }

                </Fragment>
             }

              {/* <Marker.Animated
                ref={marker => {
                  this.marker = marker;
                }}
                coordinate={this.state.coordinate}
              /> */}
{/* 
                <Polyline
                    coordinates={this.state.routeTravelledCoordinates}
                    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeColors={[
                        '#7F0000',
                        '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                        '#B24112',
                        '#E5845C',
                        '#238C23',
                        '#7F0000'
                    ]}
                    strokeWidth={6}
                /> */}
               {

        
                }

            </MapView>
            <View style={styles.statsContainer}>
            <Text style={styles.stats}>
                Position : {parseInt(this.state.currentPosition)}
              </Text>
              <Text style={styles.stats}>
                Distance : {parseFloat(this.state.totalDistanceTravelled).toFixed(2)} km
              </Text>
              <Text style={styles.stats}>
                Speed : {parseFloat(this.state.currentSpeed).toFixed(2)} km/hr
              </Text>
            </View>
          </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    bubble: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.7)",
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20
    },
    latlng: {
      width: 200,
      alignItems: "stretch"
    },
    button: {
      width: 80,
      paddingHorizontal: 12,
      alignItems: "center",
      marginHorizontal: 10
    },
    statsContainer:{
        position:'absolute',
        top: 10,
        right: 10,
        padding: 10,
        justifyContent: "flex-end",
        backgroundColor: "lightblue",
        // opacity: 0.3,
        color: 'white'
    },
    stats: {
      marginVertical: 5,
      color: 'white',
      fontSize: 18,
    }
  });
  
  export default Track;