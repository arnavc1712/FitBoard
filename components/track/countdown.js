import React, {Component,useEffect,useState} from 'react';
import {View,StyleSheet,Image} from 'react-native';
import CountDown from 'react-native-countdown-component';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment'

const Countdown = ({navigation,route}) => {

//    console.log("Inside Event stack ", route.params);
    const eventColl = firestore().collection("Events")
    // const [eventData,setEventData] = useState(null)
    const [timer,setTimer] = useState(null)
    const onSetEventTimer = async () => {
        console.log(route.params.eventId)
        let eventData = await eventColl.doc(route.params.eventId).get()
        // console.log(eventData.data().timestamp.toDate)
        let eventStartTime = moment(eventData.data().timestamp.toDate())
        let countdown = eventStartTime.diff(moment(new Date()),'seconds')
        setTimer(parseInt(countdown))
        // setEventStarted(eventData.data().started)
    }
    useEffect(()=>{
        try{
            onSetEventTimer()
        }
        catch(err){
            console.log(err)
        }
        
    },[])

    return (
          <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
            {timer && <CountDown
              until={timer}
              onFinish={() => navigation.navigate("Track")}
            //   onPress={() => alert('hello')}
              style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}
              size={30}
              digitStyle={{backgroundColor: '#FFF'}}
              digitTxtStyle={{color: '#1CC625',fontFamily:'roboto'}}
              timeToShow={['M', 'S']}
              timeLabels={{m: '', s: ''}}
              showSeparator={true}
            />}
          </View>
    )
}

export default Countdown;