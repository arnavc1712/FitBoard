import React, { Component,useState,useEffect } from 'react';
import { Image,StyleSheet } from 'react-native';
import { Container, Header, View, Toast,DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right,Body, Icon,Button } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import configs from "../../conf.json"
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import MapView, { PROVIDER_GOOGLE,Marker,Callout,AnimatedRegion, Animated } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import Swiper from 'react-native-deck-swiper'

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

const placePhoto = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${configs["mapsDirectionsKey"]}`
}
const ShowEvents = ({navigation,route}) => {
    // const topic = route.params.topic
    const [events,setEvents] = useState([])
    const [user,setUser] = useState(null)
    const [cardIndex,setCardIndex] = useState(0)

    const [source,setSource] = useState({})
    const [destination,setDestination] = useState({})
    const [waypoints,setWaypoints] = useState([])
    const [visible,setVisible] = useState(false)
    const [currEvent,setCurrEvent] = useState(undefined)
    const [userData,setUserData] = useState({})

    const [UnregisterDialogVisible,setUnregisterDialogVisible] = useState(false)
    const [RegisterDialogVisible,setRegisterDialogVisible] = useState(false)
    const eventColl = firestore().collection('Events')
    const userColl = firestore().collection('Users')

    useEffect(()=>{

        const UserSubscriber = auth().onAuthStateChanged(async(currUser)=>{
            setUser(currUser)
            // console.log(currUser)
            let uData = await userColl.doc(currUser["email"]).get()
            setUserData(uData._data)
            // setUserTopics(uData._data.topics)
        })

        // console.log(events)
        return UserSubscriber

    },[])

    useEffect(()=>{
        
        if(user){
            // setUser(user)
            // console.log(userTopics)
            const subscriber = firestore()
                            .collection('Users')
                            .doc(user["email"])
                            .onSnapshot(documentSnapshot => {
                                const participatingEvents= documentSnapshot.data().participatingEvents
                                eventColl.get().then((data)=>{
                                    let eventsData = data.docs
                                    // console.log(eventsData)
                                    
                                    eventsData =  eventsData.filter((event)=>{
                                                                    
                                                                            if(!participatingEvents.includes(event.id) && userData.topics.includes(event._data.topic)){
                                                                                return true
                                                                            }
                                                                            else{
                                                                                return false
                                                                            }
                                                                        })
                                                            
                                    setEvents(eventsData)
                                    // console.log(eventsData)
                                }) 
                                
                            });
            return subscriber;
            }
        

    },[user,userData])
    
    const getNumDays = (date1,date2) => {
        let a = moment(date1)
        let b = moment(date2)
        return a.diff(b,'days')
    }

    const showRoute = (event) => {
        setSource(event.source)
        setDestination(event.destination)
        setWaypoints(event.waypoints)
        setVisible(true)

    }

    const onRegister = async () => {
        try{
            const eventId = currEvent.id
            
            if(user){
                userColl.doc(user["email"]).update({participatingEvents:firestore.FieldValue.arrayUnion(eventId)})
                eventColl.doc(eventId).update({registeredUsers:firestore.FieldValue.arrayUnion(user["email"])})
            }

            await eventColl.doc(eventId).update({registeredUsers:registeredUsers})
            
            messaging()
            .subscribeToTopic(`${eventId}`)
            .then(() => console.log(`Subscribed to topic! ${eventId}`));
            
            // await eventColl.doc(eventId).update({registeredUsers:registeredUsers})
            setRegisterDialogVisible(false)
            Toast.show({text:"Successfully Registered",buttonText:"Okay",duration:3000})
        }
        catch(error){
            console.log(error)
        }
    }





    
    return (
        <Container>
            <View style={styles.container}>
                {events && events.length>0 && <Swiper
                    cards={events}

                    renderCard={(item,index) => {
                        // console.log("Inside Card")
                        // console.log(events)
                        // console.log(item)
                        if(item){
                        return (
                            <Card style={{ elevation: 5 }}>
                                <CardItem>
                                    <Left>
                                        {item._data.type=="Marathon" && <Thumbnail source={require('../../assets/images/running1.png')} />}
                                        {item._data.type=="Cyclathon" && <Thumbnail source={require('../../assets/images/cycling.jpg')} />}
                                        
                                        <Body style={{flex:1}}>
                                            <Text>{item._data.type}</Text>
                                            <Text note>{item._data.distance}</Text>
                                            <Text note style={{fontSize:10}}>{item._data.locationName}</Text>
                                        </Body>
                                        </Left>
                                    <Right>
                                        <Button rounded style={{backgroundColor:'#ec407a'}} onPress={()=>showRoute(item._data)}><Text style={{fontSize:12}}>Show Route</Text></Button>
                                    </Right>
                                </CardItem>
                                <CardItem cardBody>
                                    <Image style={styles.cardImage} source={{uri:placePhoto(item._data.photoReference)}} />
                                </CardItem>
                        
                                <CardItem>
                                        <View style={{flexDirection:'column'}}>
                                            <Text style={{fontSize:12}}>{item._data.registeredUsers?item._data.registeredUsers.length:null} Participant(s)</Text>
                                            {getNumDays(new Date(),item._data.createdAt) ? <Text style={{fontSize:12}}>Created {getNumDays(new Date(),item._data.createdAt)} days ago</Text>:<Text style={{fontSize:12}}>NEW</Text>}
                                            
                                        </View>
                                        

                                        <Right style={{flex:1}}>
                                            {item._data.registeredUsers.includes(user["email"]) &&
                                                <Button bordered rounded danger onPress={()=>{setUnregisterDialogVisible(true);setCurrEvent(item)}}><Text>Unregister</Text></Button>}
                                            {!item._data.registeredUsers.includes(user["email"]) &&
                                                <Button bordered rounded onPress={()=>{setRegisterDialogVisible(true);setCurrEvent(item)}}><Text>Register</Text></Button>}
                                            
                                        </Right>
                                </CardItem>
                    
                    </Card>
                        )
                    }
                    else{
                        return (null)
                    }
                    }}
                    cardIndex={0}
                    infinite={true}
                    
                    backgroundColor={'#FFF'}
                    stackSize= {1}>
                   
                </Swiper>}
            </View>

            <ConfirmDialog
                title="Confirmation"
                message="Are you sure about that?"
                animationType="fade"
                visible={UnregisterDialogVisible}
                onTouchOutside={() => setUnregisterDialogVisible(false)}
                positiveButton={{
                    title: "YES",
                    onPress: () => onUnregister()
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => {setUnregisterDialogVisible(false)}
                }}
            />

            <ConfirmDialog
                title="Confirmation"
                animationType="fade"
                message="Are you sure about that?"
                visible={RegisterDialogVisible}
                onTouchOutside={() => setRegisterDialogVisible(false)}
                positiveButton={{
                    title: "YES",
                    onPress: () => onRegister()
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => {setRegisterDialogVisible(false)}
                }}
            />

            <Modal isVisible={visible} >
                <View style={{ flex: 1 }}>
                    <View style={styles.closeButtonView}>
                        <Button danger style={styles.closeButton} onPress={()=>{setVisible(false)}} rounded>
                            <Icon style={styles.closeButtonIcon} name='close' />
                        </Button>
                    </View>
                    <MapView
                        customMapStyle={mapStyle}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        initialRegion={{
                            latitude: source.latitude,
                            longitude: source.longitude,
                            latitudeDelta: 0.15,
                            longitudeDelta: 0.15,
                        }}
                    >
                
                    <Marker.Animated
                        style={{zIndex:1}}
                        // flat={true}
                        coordinate={source}
                    /> 

                    {waypoints!=null && waypoints.length>0 &&
                        <MapViewDirections
                        origin={source}
                        destination={destination}
                        apikey={configs["mapsDirectionsKey"]}
                        waypoints={waypoints}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                    }

                    {
                        Object.keys(destination).length>0 &&
                        <Marker 
                        coordinate={destination}
                    
                        pinColor="#00B8D4"
                        />
                    }
                
                    </MapView>
                </View>
            </Modal>
        </Container>
    );

}


const styles = StyleSheet.create({
    cardImage:{ 
        height: 300, 
        flex: 1 },
    map: {
        ...StyleSheet.absoluteFillObject,
            position:'absolute',
        },
    closeButtonView:{
        position:'absolute',
        flexDirection:'row',
        top:20,
        left:0,
        zIndex:1
        // right:0
    },
    closeButton:{
        // backgroundColor:'#ec407a',
        marginLeft:16,
        marginRight:16,
    },
    closeButtonIcon:{
        color:'white',
        fontSize:24,
        fontWeight:'400'
    },
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF"
      },
})

export default ShowEvents