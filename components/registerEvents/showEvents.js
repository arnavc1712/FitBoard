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



const ShowEvents = () => {
    const [events,setEvents] = useState([])
    const [user,setUser] = useState(null)

    const [source,setSource] = useState({})
    const [destination,setDestination] = useState({})
    const [waypoints,setWaypoints] = useState([])
    const [visible,setVisible] = useState(false)
    const [currEvent,setCurrEvent] = useState(undefined)

    const [UnregisterDialogVisible,setUnregisterDialogVisible] = useState(false)
    const [RegisterDialogVisible,setRegisterDialogVisible] = useState(false)
    const eventColl = firestore().collection('Events')

    useEffect(()=>{

        const subscriber = auth().onAuthStateChanged((user)=>setUser(user))

        const getEvents = async() => {
            try{
            const allEvents = await firestore().collection('Events').get();
            setEvents(allEvents.docs)
            
            }
            catch(error){
                console.log(error)
            }
        }

        getEvents()
        // console.log(events)
        return subscriber

    },[])
    

    const showRoute = (event) => {
        setSource(event.coords)
        setDestination(event.destination)
        setWaypoints(event.waypoints)
        setVisible(true)

    }

    const onRegister = async () => {
        try{
            // setDialogVisible(true)
            const eventId = currEvent.id
            let registeredUsers = currEvent._data.registeredUsers
            if (!registeredUsers.includes(user["email"])){
                registeredUsers.push(user["email"])
            }

            await eventColl.doc(eventId).update({registeredUsers:registeredUsers})
            setRegisterDialogVisible(false)
            Toast.show({text:"Successfully Registered",buttonText:"Okay",duration:3000})
        }
        catch(error){
            console.log(error)
        }
    }


    const onUnregister = async () => {
        try{
            const eventId = currEvent.id
            let registeredUsers = currEvent._data.registeredUsers
            if (registeredUsers.includes(user["email"])){
                const index = registeredUsers.indexOf(user["email"]);
                registeredUsers.splice(index,1)

            }

            await eventColl.doc(eventId).update({registeredUsers:registeredUsers})
            setUnregisterDialogVisible(false)
            Toast.show({text:"Successfully Unregistered",buttonText:"Okay",duration:3000})
        }
        catch(error){
            console.log(error)
        }
    }
    // console.log(events)
    
    return (
        <Container>
            <View>
                {events!=null && events.length>0 && <DeckSwiper
                dataSource={events}
                renderItem={item =>
                    <Card style={{ elevation: 5 }}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{uri:placePhoto(item._data.photoReference)}} />
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
                            {/* <Container> */}
                                <Left style={{flex:1}}><Text style={{fontSize:12}}>{item._data.registeredUsers.length} Participant(s)</Text></Left>

                                <Right style={{flex:1}}>
                                    {item._data.registeredUsers.includes(user["email"]) &&
                                        <Button bordered rounded danger onPress={()=>{setUnregisterDialogVisible(true);setCurrEvent(item)}}><Text>Unregister</Text></Button>}
                                    {!item._data.registeredUsers.includes(user["email"]) &&
                                        <Button bordered rounded onPress={()=>{setRegisterDialogVisible(true);setCurrEvent(item)}}><Text>Register</Text></Button>}
                                    
                                </Right>
                            {/* </Container> */}
                        </CardItem>
                    
                    </Card>
                }
                />}
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
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
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
    }
})

export default ShowEvents