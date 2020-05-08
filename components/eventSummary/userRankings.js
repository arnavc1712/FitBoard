import React,{useState,useEffect} from 'react'
import firestore from '@react-native-firebase/firestore';
import {View,StyleSheet,Image,FlatList,Text} from 'react-native'
import {Left,Right} from 'native-base'

const oddRowColor = "white";
const evenRowColor = "#f2f5f7";


const renderRow = (name,rank, time) => {
    return (
    <View style={[styles.row, { backgroundColor: 'white' }]}>
            <View style={styles.left}>
                <Text
                    style={[
                        styles.rank,
                        styles.singleDidget
                    ]}
                >
                {rank+1}
                </Text>
                <Image
                source={{uri:'https://gravatar.com/avatar/4ba68791d1b4fd930b6c4ef84b197293?s=400&d=robohash&r=x'}}
                style={[styles.avatar]}
                />
                <Text style={[styles.label]} numberOfLines={1}>
                    {name.split('@')[0]}
                </Text>
                <Right>
                    <Text style={styles.time}>{time}</Text>
                </Right>

            </View>
      </View>
    )
}

const getTotalTime = (hour,min,sec) => {
    return ((hour*3600) + (min*60) + sec)
}

const UserRankings = ({route}) => {
    // const eventId = route.params.eventid
    const {eventId,myid} = route.params
    const [rankings,setRankings] = useState([])
    useEffect(()=>{
        const subscriber = firestore().collection("Events").doc(eventId).onSnapshot(documentSnapshot => 
            {
                console.log(documentSnapshot.data())
                let rankings = documentSnapshot.data().rankings
                rankings.sort((a, b) => {
                    let [hour_a,minute_a,sec_a] = a.time.split(":")
                    let [hour_b,minute_b,sec_b] = b.time.split(":")
                    let a_time = getTotalTime(parseInt(hour_a),parseInt(minute_a),parseInt(sec_a))
                    let b_time = getTotalTime(parseInt(hour_b),parseInt(minute_b),parseInt(sec_b))

                    if(a_time > b_time){
                        return 1
                    }
                    else{
                        return -1
                    }
                }
                )
                rankings = rankings.filter(obj=>obj.user!=null && obj.position!=null)
                setRankings(rankings)
                
            })
        return subscriber
    },[])

    return(
        <View>
            {rankings.map((obj,index) => 
                renderRow(obj.user,index, obj.time))
                }
        </View>
    )
}


const styles = StyleSheet.create({
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        marginRight: 10
      },
      rank: {
        fontSize: 17,
        fontWeight: "bold",
        marginRight: 5
      },
      singleDidget: {
        paddingLeft: 16,
        paddingRight: 6
      },
      doubleDidget: {
        paddingLeft: 10,
        paddingRight: 2
      },
      row: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: "#d6d7da"
      },
      label: {
        fontSize: 18,
        flex: 1,
        paddingRight: 80
      },
      left: {
        flexDirection: "row",
        alignItems: "center"
    },
    time:{
        marginRight:30,
        fontSize:16,
        color:'#b0003a',
        fontWeight:'bold',
        fontFamily:'roboto'
    }
})


export default UserRankings;