import React, { Fragment } from "react";
import {useState,useEffect,useRef} from 'react';
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
import configs from '../../conf.json'
import MapViewDirections from 'react-native-maps-directions';
import { radialArea } from "d3-shape";
const randomColor = require('randomcolor'); // import the script


const LATITUDE_DELTA = 0.0009;
const LONGITUDE_DELTA = 0.0009;
const START_LATITUDE_DELTA = 0.00004;
const START_LONGITUDE_DELTA = 0.00004;
const FINISH_LONGITUDE_DELTA = 0.00009;
const FINISH_LATITUDE_DELTA = 0.00009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const EVENT_ID = 'HZPr73HED35xypBWZOQY';
const MY_ID = 'abhidagar1@gmail.com';
const eventColl = firestore().collection('Events')

const  Track = ({route, navigation}) =>{
  // console.log(route.params)
  const eventid = route.params.eventId;
  let prevLatLng = {}
  // const savedCallback = useRef();
  const stateRef = useRef({});
  const [latitude, setLatitude] = useState(LATITUDE);
  const [longitude, setLongitude] =  useState(LONGITUDE);
  const [speed, setSpeed] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [routeTravelledCoordinates, setRouteTravelledCoordinates] = useState([]);
  const [distanceTravelled, setDistanceTravelled] = useState([]);
  const [totalDistanceTravelled, setTotalDistanceTravelled] = useState(0);
  const [routeColor, setRouteColor] = useState('#000');
  const [atStartLocation, setatStartLocation] = useState(false);
  const [myid, setmyid] = useState(null);
  const [otherPlayersLocation, setOtherPlayerLocation] = useState({});
  const [eventData, setEventData] = useState(null);
  const [travelledRouteColor, setTravelledRouteColor] = useState(randomColor());
  const [currentPosition, setCurrentPosition] = useState(0);
  const [finished, setFinished] = useState(false); 
  const [coordinate, setCoordinate] = useState(new AnimatedRegion({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: 0,
            longitudeDelta: 0
          }));
  var watchId = null;

  stateRef.current = {
                      eventData: eventData,
                      speed:speed,
                      currentSpeed:currentSpeed,
                      totalDistanceTravelled:totalDistanceTravelled,
                      latitude:latitude,
                      longitude:longitude,
                      distanceTravelled:distanceTravelled,
                      routeTravelledCoordinates:routeTravelledCoordinates,
                      myid: myid,
                      currentPosition: currentPosition,
                      atStartLocation: atStartLocation,
                      finished: finished
                    }


     

      useEffect(()=>{
          // setEventId(route.params.eventId)
          // savedCallback.settingSpeed = settingSpeed
          // console.log(`Event Id is ${eventid}`)
          if(eventid){
            getCurrentUser();
            populateEventDetail();
            getCurrentLocation();
            checkIfAtStarted();
            watchPosition();
            if(stateRef.current.atStartLocation == true){
              getAllDistances();
              listenForUpdate();
            }
          }
    },[eventid]);

    useEffect(() => {
      try{
        if(finished==true){
          firestore().collection("Events").doc(eventid).set({
                                                            rankings:firestore.FieldValue.arrayUnion({user:myid,position:currentPosition})
                                                              },{merge:true})
        }
      }
      catch(err){
        console.log(err)
      }
    },[finished])


    const update_firebase_location = (newCoordinate) => {
        
        if(eventid != null && stateRef.current.myid != null){
            const collection_name = eventid;
            const doc_name = stateRef.current.myid;
            let res = {};
            res['coordinate'] = newCoordinate;
            res['user'] = stateRef.current.myid;
            res['route'] = stateRef.current.routeTravelledCoordinates;
            res['distance'] = stateRef.current.distanceTravelled;
            res['total_distance'] = stateRef.current.totalDistanceTravelled;
            res['speed'] = stateRef.current.speed;
            // console.log("Inside update_firebase_location", res);
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
            console.log("Myid ", stateRef.current.myid);
            console.log("Position ", distance_ranking.indexOf(stateRef.current.myid))
            setCurrentPosition(distance_ranking.indexOf(stateRef.current.myid)+1);
        })

    }

    const populateEventDetail = () => {
        //getEventDetail
        // console.log("Inside populate Event details ", eventid);
        let query = eventColl.doc(eventid).get()
        .then(doc => {
            if (!doc.exists) {
                // console.log('No Event document');
                } else {
                // console.log('Event data:', doc.data());
                setEventData(doc.data());
                setRouteColor(randomColor());
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }

    const getCurrentLocation = () => {
        // console.log("Get current location");
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
      if(!stateRef.current.eventData) return

      let finish = stateRef.current.eventData.destination;
      let lat_diff = Math.abs(finish.latitude - newCoord.latitude);
      let lng_diff = Math.abs(finish.longitude - newCoord.longitude);
      if(lng_diff <= FINISH_LONGITUDE_DELTA && lat_diff <= FINISH_LONGITUDE_DELTA){
        setFinished(true);
      }
    }


    const checkIfAtStarted = () => {
      if(!stateRef.current.eventData) return
      let source = stateRef.current.eventData.source;
      let lat_diff = Math.abs(source.latitude - stateRef.current.latitude);
      let lng_diff = Math.abs(source.longitude - stateRef.current.longitude);
      console.log("Started ", source, stateRef.current.latitude, stateRef.current.longitude);
      console.log("Diff ", lat_diff, lng_diff);
      if(lng_diff <= START_LATITUDE_DELTA && lat_diff <= START_LONGITUDE_DELTA){
        setatStartLocation(true);
      }
    }

    const watchPosition = ()=>{
        
        console.log("Inside watch position");
        //watch position
        watchId = navigator.geolocation.watchPosition(
           (position) => {
                // console.log(position)
                // const { routeTravelledCoordinates, speed, totalDistanceTravelled, distanceTravelled} = state;
                const { latitude, longitude} = position.coords;
                const speed_val = position.coords.speed < 0 ? 0 : Math.round(position.coords.speed);
                const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }

                let newCoordinate = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                };

                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                if(stateRef.current.atStartLocation != true){
                  checkIfAtStarted();
                  return;
                }
                  

                let _speed = stateRef.current.speed.concat([speed_val]);
                
                let _distanceTravelled = stateRef.current.distanceTravelled.concat([calcDistance(newLatLngs)]);
                let _total_distance = stateRef.current.totalDistanceTravelled + calcDistance(newLatLngs);
                let _routeTravelledCoordinates = stateRef.current.routeTravelledCoordinates.concat([newCoordinate]);
                setSpeed(_speed);
                
                setCurrentSpeed(speed_val);
        

                setDistanceTravelled(_distanceTravelled);
                setTotalDistanceTravelled(_total_distance);
                setRouteTravelledCoordinates(_routeTravelledCoordinates);
                // setPrevLatLng({latitude: position.coords.latitude, longitude: position.coords.longitude});
                prevLatLng = {latitude: position.coords.latitude, longitude: position.coords.longitude};
                console.log("Current States")
                console.log(stateRef.current)
                //now send this updated location to firebase also
                //do so only when the eventid and current location is set
                update_firebase_location(newCoordinate);
                getAllDistances();
                checkIfFinished(newCoordinate);

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

                if(userid == stateRef.current.myid) return;
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
        // console.log("Current User ", user);
        setmyid(user.email);
      })
    }

    const displayOtherPlayer = () => {
      // console.log("Inside Display Other Player")
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
          stateRef.current.eventData && 
          <Fragment>
              <Marker 
                  title="Start"
                  coordinate = {stateRef.current.eventData.source}
                  pinColor = {randomColor()}
              />
  
              <Marker 
                  title={myid}
                  coordinate = {{'latitude':latitude, 'longitude':longitude}}
                  pinColor = {randomColor()}
              />
              {/* {stateRef.current.atStartLocation && */}
              <MapViewDirections
                origin={stateRef.current.eventData.source}
                destination={stateRef.current.eventData.destination}
                apikey={configs["mapsDirectionsKey"]}
                waypoints={stateRef.current.eventData.waypoints}
                strokeWidth={6}
                strokeColor={routeColor}
            />
              {/* } */}
            {/* {!stateRef.current.atStartLocation &&
              <MapViewDirections
                origin={{'latitude':latitude, 'longitude':longitude}}
                destination={stateRef.current.eventData.source}
                apikey={configs["mapsDirectionsKey"]}
                
                strokeWidth={6}
                strokeColor={routeColor}
            />
              } */}
              <Marker 
                  title="Finish"
                  coordinate = {stateRef.current.eventData.destination}
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
            Position : {parseInt(currentPosition) / (Object.keys(otherPlayersLocation) ? Object.keys(otherPlayersLocation).length+1 : 0)}
          </Text>
          <Text style={styles.stats}>
            Distance : {parseFloat(totalDistanceTravelled).toFixed(2)} km
          </Text>
          <Text style={styles.stats}>
            Speed : {parseFloat(currentSpeed).toFixed(2)} km/hr
          </Text>
        </View>
        {!stateRef.current.atStartLocation && 
        <View style={{width:300, textAlign:'center', padding:10}}>
          <Text style={styles.notStarted}>Move to the start location !</Text>
        </View>
      }
      </View>
      )

    }

    const calcDistance = (newLatLng) => {
        // console.log(prevLatLng, newLatLng);

        // console.log("Distance ", (haversine(prevLatLng, newLatLng) || 0));
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
        stateRef.current.finished && 
        <View style={styles.container}>
          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
          > */}
            
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <FontAwesomeIcon icon={faCheckCircle} size={45} style={{color:'grey',marginBottom:10}}/>
              <Text style={styles.modalText}>
                Wohooo !! You have successfully completed the event.</Text>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  navigation.navigate('TrackMenu',{screen:'EventSummary',params:{
                                                                                
                                                                                  myid : stateRef.current.myid, 
                                                                                  eventId: eventid
                                                                                }
                                                                                
                                                                              });
                }}
              >
                <Text style={styles.textStyle}>View My Statistics for the event</Text>
              </TouchableHighlight>
            </View>
          </View>

{/*           
        </Modal> */}
      </View>
      )

    }
    return (
        (!stateRef.current.finished && render_event_map()) || 
        (stateRef.current.finished && create_finish_alert())
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
        backgroundColor: "#F83FFF",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "black",
        // opacity: 0.3,

    },
    stats: {
      marginVertical: 5,
      color: 'white',
      fontSize: 18,
    },
    notStarted:{
      color: 'red',
      fontSize: 20,
      marginBottom:30,
      marginLeft:10,
      fontWeight:'bold',
      textDecorationLine:'underline'
    }
  });
  
  export default Track;