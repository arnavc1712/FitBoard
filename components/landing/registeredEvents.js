import React,{useState,useEffect} from 'react'
import {List,ListItem,Left,Right,Text,Icon,Button,Toast} from 'native-base'
import {View,StyleSheet} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import EventScreen from './eventInfo';
import Modal from 'react-native-modal';

const RegisteredEvents = ({user, navigation}) => {
    const eventColl = firestore().collection('Events')
    const userColl = firestore().collection('Users')
    const [userData,setUserData] = useState(null)
    const [currEvent,setCurrEvent] = useState({})
    const [eventList,setEventList] = useState([])
    const [showModal,setShowModal] = useState(false)


    const getUserEvents = async () => {
        try{
            const userData = await userColl.doc(user["email"]).get()
            // console.log(userData)
            return userData._data.participatingEvents
        }
        catch(error){
            console.log(error)
            return []
        }
        
    }

   
    const getEvents = async () => {
        try{
            const participatingEvents = await getUserEvents()
            let eventsData = await eventColl.get()
            eventsData = eventsData.docs
            // console.log(participatingEvents.includes(eventsData[0].id))
            eventsData = eventsData.filter(event=>participatingEvents.includes(event.id))
           
            
            setEventList(eventsData)
            // const eventsData = await eventColl.getAll(participatingEvents)
            
        }
        catch(error){
            console.log(error)
            
        }
            
    }


    useEffect(()=>{
        
        if(user){
            // setUser(user)
            const subscriber = firestore()
                           .collection('Users')
                            .doc(user["email"])
                            .onSnapshot(documentSnapshot => {
                                setUserData(documentSnapshot.data())
                                const participatingEvents= documentSnapshot.data().participatingEvents
                                eventColl.get().then((data)=>{
                                    let eventsData = data.docs
                                    eventsData =  eventsData.filter(event=>participatingEvents.includes(event.id))
                                    setEventList(eventsData)
                                }) 
                                
                            });
            return subscriber;
            }
        

    },[user])

  

    const onUnregister = async (event) => {
        try{
            const eventId = event.id
            
            if(user){
                userColl.doc(user["email"]).update({participatingEvents:firestore.FieldValue.arrayRemove(eventId)})
                eventColl.doc(eventId).update({registeredUsers:firestore.FieldValue.arrayRemove(user["email"])})
            }
            // await eventColl.doc(eventId).update({registeredUsers:registeredUsers})
            setShowModal(false)
            Toast.show({text:"Successfully Unregistered",buttonText:"Okay",duration:3000})
        }
        catch(error){
            console.log(error)
        }
    }

    const onView = (event) => {
        setShowModal(true)
        setCurrEvent(event)
    }

    const onStart = (event) => {
        console.log("Event start clicked ", event);
        navigation.navigate('TrackMenu',{screen:'Track', params:{eventId: event.id}});
        
    }

    // useEffect(()=>{
    //     console.log(eventList)
    // },[eventList])

    return(
        <View>
            <List>
                <ListItem itemHeader first style={styles.listHeader}>
                <Text style={styles.listHeaderText}>UPCOMING EVENTS</Text>
                </ListItem>

                {eventList.map(event => 
                <ListItem>
                    <Left>
                        <Text>{event._data.type} ({event._data.distance})</Text>
                    </Left>
                    <Right style={{flex:1}}>
    
                    { !event._data.started &&
                    <Button style={styles.button} bordered rounded onPress={()=>onView(event)}><Text>View</Text></Button>
                    }
                    {event._data.started &&
                    <Button style={styles.button} bordered rounded onPress={()=>onStart(event)}><Text>Participate</Text></Button>
                    }
                    </Right>
                </ListItem>
                )}

                
            </List>

            <Modal
            isVisible={showModal}
            onBackdropPress={()=>setShowModal(false)}
            backdropColor="#FFF"
            backdropOpacity={1}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}>
                <EventScreen event={currEvent} onUnregister={onUnregister}/>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    listHeader:{
        justifyContent:'center'
    },
    listHeaderText:{
        fontSize:20,
        fontWeight:'bold'
    }
})

export default RegisteredEvents