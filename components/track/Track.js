import React, { Fragment } from "react";
import {useState,useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  Modal,
  TouchableHighlight
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE
} from "react-native-maps";
import haversine from "haversine";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCoffee,faCheck,faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faCoffee);
library.add(faCheck);
library.add(faTimesCircle);
library.add(faCheckCircle);
import firestore from '@react-native-firebase/firestore';
import {getDistance} from './getDistanceOfUsers';

import auth from '@react-native-firebase/auth';
import { abs } from "react-native-reanimated";


const randomColor = require('randomcolor'); // import the script


const LATITUDE_DELTA = 0.0009;
const LONGITUDE_DELTA = 0.0009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const EVENT_ID = 'HZPr73HED35xypBWZOQY';
const MY_ID = 'abhidagar1@gmail.com';
const eventColl = firestore().collection('Events')

const  Track = ({route, navigation}) =>{
  console.log(route.params)
  const eventid = route.params.eventId;
  const routeColor = '#000';
  const [latitude, setLatitude] = useState(LATITUDE);
  const [longitude, setLongitude] =  useState(LONGITUDE);
  const [speed, setSpeed] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [routeTravelledCoordinates, setRouteTravelledCoordinates] = useState([]);
  const [distanceTravelled, setDistanceTravelled] = useState([]);
  const [totalDistanceTravelled, setTotalDistanceTravelled] = useState(0);
  // const [prevLatLng, setPrevLatLng] = useState({});
  let prevLatLng = null;
  const [myid, setmyid] = useState(null);
  const [otherPlayersLocation, setOtherPlayerLocation] = useState({});
  const [eventData, setEventData] = useState(null);
  const [travelledRouteColor, setTravelledRouteColor] = useState(randomColor());
  const [currentPosition, setCurrentPosition] = useState(0);
  const [finished, setFinished] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [coordinate, setCoordinate] = useState(new AnimatedRegion({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: 0,
            longitudeDelta: 0
          }));
  var watchId = null;


      useEffect(()=>{
        console.log("########### SPEEED #########")
        console.log(speed)
      },[speed])

      useEffect(()=>{
          // setEventId(route.params.eventId)
          console.log(`Event Id is ${eventid}`)
          if(eventid){
            getCurrentUser();
          
            populateEventDetail();
    
            getAllDistances();
    
            getCurrentLocation();
            
            watchPosition();
    
            listenForUpdate();
          }
    },[]);

    const update_firebase_location = (newCoordinate) => {
        
        if(eventid != null && myid != null){
            const collection_name = eventid;
            const doc_name = myid;
            let res = {};
            res['coordinate'] = newCoordinate;
            res['user'] = myid;
            res['route'] = routeTravelledCoordinates;
            res['distance'] = distanceTravelled;
            res['total_distance'] = totalDistanceTravelled;
            res['speed'] = speed;
            console.log("Inside update_firebase_location", res);
            firestore().collection(collection_name).doc(doc_name).set(res);
        }
        else{
            console.log("EVENTID NULL");
            return;
        }
    }

    const getAllDistances =  async () => {
        //getDistanceTravelledForAllUsers
        getDistance(eventid)
        .then((distance_ranking) =>{
            if(!distance_ranking) return;
            console.log("Total Distance ", distance_ranking);
            console.log("Position ", distance_ranking.indexOf(myid))
            setCurrentPosition(distance_ranking.indexOf(myid)+1);
        })

    }

    const populateEventDetail = () => {
        //getEventDetail
        console.log("Inside populate Event details ", eventid);
        let query = eventColl.doc(eventid).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No Event document');
                } else {
                console.log('Event data:', doc.data());
                setEventData(doc.data());
                setRouteColor(randomColor());
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }

    const getCurrentLocation = () => {
        console.log("Get current location");
        //getCurrentLocation
        navigator.geolocation.getCurrentPosition(
          position => {
          // console.log("Got Current Location", position);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          },
          error => console.log(error.message),
          { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
      );
    }

    const checkIfFinished = (newCoord) => {
      if(!eventData) return
      let finish = eventData.destination;
      let lat_diff = abs(finish.latitude - newCoord.latitude);
      let lng_diff = abs(finish.longitude - newCoord.longitude);
      if(lng_diff <= LATITUDE_DELTA && lat_diff <= LONGITUDE_DELTA){
        setFinished(true);
      }
    }

    const watchPosition = ()=>{
        
        console.log("Inside watch position");
        //watch position
        watchId = navigator.geolocation.watchPosition(
            position => {
              
                // const { routeTravelledCoordinates, speed, totalDistanceTravelled, distanceTravelled} = state;
                const { latitude, longitude} = position.coords;
                const speed_val = position.coords.speed < 0 ? 0 : Math.round(position.coords.speed);
                const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }

                let newCoordinate = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                };
              
                // //update and move the marker
                // if (Platform.OS === "android") {
                //     if (this && this.marker) {
                //       this.marker.animateMarkerToCoordinate(
                //         newCoordinate,
                //         500
                //       );
                //     }
                //   } else {
                //     coordinate.timing(newCoordinate).start();
                // }
                let _speed = speed.concat([speed_val]);
                let _distanceTravelled = distanceTravelled.concat([calcDistance(newLatLngs)]);
                let _total_distance = totalDistanceTravelled + calcDistance(newLatLngs);
                let _routeTravelledCoordinates = routeTravelledCoordinates.concat([newCoordinate]);
                // console.log("############################");
                // console.log(speed, distanceTravelled, totalDistanceTravelled, routeTravelledCoordinates, prevLatLng)
                // console.log(_speed, _distanceTravelled, _total_distance, _routeTravelledCoordinates);
                // console.log("############################");
                setSpeed(speed => ([...speed, speed_val]));
                
                setCurrentSpeed(speed_val);
                console.log("Current Speed")
                console.log(currentSpeed)
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setDistanceTravelled(_distanceTravelled);
                setTotalDistanceTravelled(_total_distance);
                setRouteTravelledCoordinates(_routeTravelledCoordinates);
                // setPrevLatLng({latitude: position.coords.latitude, longitude: position.coords.longitude});
                prevLatLng = {latitude: position.coords.latitude, longitude: position.coords.longitude};
                //now send this updated location to firebase also
                //do so only when the eventid and current location is set
                checkIfFinished(newCoordinate);
                if(speed_val != 0)
                  update_firebase_location(newCoordinate);
                getAllDistances();


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

    const listenForUpdate = () => {
        // listen to firebase location updates
        console.log("Inside listener");
        const ref = firestore().collection(eventid);
        let observer = ref.onSnapshot(docSnapshot => {
            var  otherPlayersLocation = otherPlayersLocation;
            if(otherPlayersLocation == null) otherPlayersLocation = {};
            docSnapshot.forEach( (doc) => {
                let data = doc.data();
                let userid = data.user;

                if(userid == myid) return;
                let user_location = data.coordinate;
                otherPlayersLocation[userid] = user_location;
            });
            setOtherPlayerLocation(otherPlayersLocation);
        }, 
        err => {
            console.log(`Encountered error: ${err}`);
        });
    }

    const getCurrentUser = () => {
      auth().onAuthStateChanged((user) =>{
        console.log("Current User ", user);
        setmyid(user.email);
      })
    }

    const displayOtherPlayer = () => {
      console.log("Inside Display Other Player")
      let keys = Object.keys(otherPlayersLocation);
      return keys.map( (keyName, keyIndex) => {
        return <Marker
            coordinate={otherPlayersLocation[keyName]}
            title={keyName}
            key={keyName}
            pinColor={randomColor()}
        />
      })
    }

    const render_event_map = () => {
      return(
        <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={getMapRegion()}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
        >
          {
          eventData && 
          <Fragment>
              <Marker 
                  title="Start"
                  coordinate = {eventData.waypoints[0]}
                  pinColor = {randomColor()}
              />
  
              <Marker 
                  title={myid}
                  coordinate = {{'latitude':latitude, 'longitude':longitude}}
                  pinColor = {randomColor()}
              />
              <Polyline
                  coordinates={eventData.waypoints}
                  strokeColor={routeColor} // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={6}
              />
              <Marker 
                  title="Finish"
                  coordinate = {eventData.destination}
                  pinColor = {randomColor()}
              />
  
              <Polyline
                  coordinates={routeTravelledCoordinates}
                  strokeColor={travelledRouteColor} // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={6}
              />
              {
                  displayOtherPlayer()
              }
  
          </Fragment>
       }
  
  
  
      </MapView>
        <View style={styles.statsContainer}>
        <Text style={styles.stats}>
            Position : {parseInt(currentPosition)}
          </Text>
          <Text style={styles.stats}>
            Distance : {parseFloat(totalDistanceTravelled).toFixed(2)} km
          </Text>
          <Text style={styles.stats}>
            Speed : {parseFloat(currentSpeed).toFixed(2)} km/hr
          </Text>
        </View>
      </View>
      )

    }

    const calcDistance = (newLatLng) => {
        console.log(prevLatLng, newLatLng);
        console.log("Distance ", (haversine(prevLatLng, newLatLng) || 0));
        return (haversine(prevLatLng, newLatLng) || 0)
      }

    const getMapRegion = () => {
      return {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        
    }};

    const create_finish_alert = () => {
      console.log("Inside create finish alert");
      return (
        eventData && 
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
          >
            
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <FontAwesomeIcon icon={faCheckCircle} size={45} style={{color:'grey',marginBottom:10}}/>
              <Text style={styles.modalText}>
                Wohooo !! You have successfully completed the event.</Text>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate('TrackMenu',{screen:'EventSummary', myid : myid, eventId: eventid});
                }}
              >
                <Text style={styles.textStyle}>View My Statistics for the event</Text>
              </TouchableHighlight>
            </View>
          </View>

          
        </Modal>
      </View>
      )

    }
    return (
        (!finished && render_event_map()) || 
        (finished && create_finish_alert())
    );

}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: 'auto',
    backgroundColor: '#FDD7E4',
    alignSelf: 'stretch',
    textAlign: 'center',
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
    elevation: 2,
    marginTop: 10,
    width: 300
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
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