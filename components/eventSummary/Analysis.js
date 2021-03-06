import React, { Component, useState, useEffect, Fragment } from 'react';
import { Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label,Toast, Grid, Col} from 'native-base';
import {
  StyleSheet ,
  View
} from 'react-native';
import { Container, Card, CardItem, Thumbnail, Icon, Left, Right } from 'native-base';
import { Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';
import configs from "../../conf.json"
import {getDistance} from '../track/getDistanceOfUsers';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCoffee,faCheck,faTimesCircle, faCheckCircle,faMapMarkerAlt,faAward,faCalendar,faClock, faRoad, faList} from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import moment from 'moment'
library.add(faAward);

import {
    LineChart
  } from 'react-native-chart-kit'

const placePhoto = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${configs["mapsDirectionsKey"]}`
}



const linedata = (data) => {
  let arr = [];
  let delta = parseInt(10);
  for (let i = 0; i < data.length; i=i+delta) {
    arr.push(data[i]);
  }
    return {
        datasets: [
          {
            data: arr,
            strokeWidth: 6, // optional
          },
        ],
    }
};


  const getDate = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }


  const getLineGraph = (data, ysuffix) => {
    return <LineChart
            data={linedata(data)}
            width={Dimensions.get('window').width-20} // from react-native
            height={200}
            yAxisSuffix={ysuffix}
            xAxisInterval={100}
            fromZero={true}
            chartConfig={{
            backgroundColor: '#000',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            withInnerLines: false,
            withOuterLines: false,
            withVerticalLabels: false,
            withHorizontalLabels: false,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => "#ec407a",
            style: {
                borderRadius: 5,
                padding:5
            }
            }}
            bezier
            style={{
                marginVertical: 5,
                borderRadius: 5,    
            }}
    />
  }
  
const Analysis= ({ route, navigation }) => {
    // console.log("inside event summary", route.params);
    console.log(route.params)
    const { myid, eventId } = route.params;
    const [eventData,setEventData] = useState(null)
    const [speed,setEventSpeed] = useState(null);
    const [distance, setDistance] = useState(null);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    // for (var i=0;i<40;++i) speed[i]=i;
    const eventsColl = firestore().collection('Events');
    const currEventColl = firestore().collection(eventId);
    const currEventDoc = myid;

    useEffect( ()=>{

        const populateEventDetail = () => {
            let query = eventsColl.doc(eventId).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No Event document');
                    } else {
                    console.log('Got Event data:', doc.data());
                    setEventData(doc.data())
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        }

        const getAllDistances = () => {
            //getDistanceTravelledForAllUsers
            getDistance(eventId)
            .then((distance_ranking) =>{
                if(!distance_ranking) return;
                console.log("Got Total Distance ", distance_ranking);
                console.log("Got Position ", distance_ranking.indexOf(myid)+1)
                setCurrentPosition(distance_ranking.indexOf(myid)+1);
                setTotalPlayers(distance_ranking.length);
            })
        }

        const getUserStats = () => {
            currEventColl.doc(currEventDoc)
            .get()
            .then(doc => {
                console.log("User Stats", doc.data());
                let data = doc.data();
                setEventSpeed(data.speed);
                setDistance(data.distance);
            })
        }

        populateEventDetail();
        getAllDistances();
        getUserStats();
        return;
    },[])

    return(

        <Container>
            {eventData && speed && distance &&
          <Card>
            <CardItem style={{marginTop:20, marginBottom: 90,}}>
            <Body> 
              <Grid>
                <Col style={{width:70, marginRight: 20}}>
                <Thumbnail source={{uri: placePhoto(eventData.photoReference)}}/>
                </Col>
                <Col style={{width:160}}>
                  <Text note style={{fontSize:16, marginBottom:5}}><FontAwesomeIcon icon={faAward} size={17} style={{color:'#2196f3',marginBottom:10,alignSelf:'center'}}/> {currentPosition} / {totalPlayers}</Text>
                  <Text note style={{fontSize:16, marginBottom:5}}><FontAwesomeIcon icon={faCalendar} size={17} style={{color:'#2196f3',marginBottom:10,alignSelf:'center'}}/> {moment(eventData.timestamp.toDate()).format("Do MMM YYYY")}</Text>
                  <Text note style={{fontSize:16, marginBottom:5}}><FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={{color:'#2196f3',marginBottom:10,alignSelf:'center'}}/> {eventData.locationName}</Text>

                </Col> 
                <Col style={{width:160}}>
                  <Text note style={{fontSize:16, marginBottom:5}}><FontAwesomeIcon icon={faClock} size={17} style={{color:'#2196f3',marginBottom:10,alignSelf:'center'}}/> {moment(eventData.timestamp.toDate()).format("hh:mm a ([MST])")}</Text>
                  <Text note style={{fontSize:16, marginBottom:5}}><FontAwesomeIcon icon={faRoad} size={17} style={{color:'#2196f3',marginBottom:10,alignSelf:'center'}}/> {eventData.distance}</Text>
                  <Text note style={{fontSize:16, marginBottom:5}}><FontAwesomeIcon icon={faList} size={17} style={{color:'#2196f3',marginBottom:10,alignSelf:'center'}}/> {eventData.type}</Text>
                </Col>   
                </Grid> 
                </Body>
            </CardItem>
            <CardItem cardBody style={{marginLeft:5, marginRight:5, marginTop: 10}}>
            <View>
                <Text style={{fontSize:20,fontWeight:"bold", color:"#F0200F", marginBottom:5}}>
                    SPEED
                </Text>
                {getLineGraph(speed, "k/h")}
            </View>
            </CardItem>
            <CardItem cardBody style={{marginLeft:5, marginRight:5}}>
            <View>
                <Text style={{fontSize:20,fontWeight:"bold", color:"#F0200F", marginBottom: 5}}>
                 DISTANCE
                </Text>
                {getLineGraph(distance,"km")}
            </View>
            </CardItem>
          </Card>
          }

      </Container>
    );
}
const styles = StyleSheet.create({

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
export default Analysis;