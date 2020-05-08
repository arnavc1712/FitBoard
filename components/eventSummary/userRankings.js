import React,{useState,useEffect} from 'react'
import firestore from '@react-native-firebase/firestore';
import {View,StyleSheet,Image,FlatList,Text} from 'react-native'

const oddRowColor = "white";
const evenRowColor = "#f2f5f7";


const renderRow = (name,rank) => {
    return (
    <View style={[styles.row, { backgroundColor: 'white' }]}>
            <View style={styles.left}>
                <Text
                    style={[
                        styles.rank,
                        styles.singleDidget
                    ]}
                >
                {rank}
                </Text>
                <Image
                source={{uri:'https://gravatar.com/avatar/4ba68791d1b4fd930b6c4ef84b197293?s=400&d=robohash&r=x'}}
                style={[styles.avatar]}
                />
                <Text style={[styles.label]} numberOfLines={1}>
                    {name}
                </Text>

            </View>
      </View>
    )
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
                rankings.sort((a, b) => (parseInt(a.position) > parseInt(b.position)) ? 1 : -1)
                rankings = rankings.filter(obj=>obj.user!=null && obj.position!=null)
                setRankings(rankings)
                
            })
        return subscriber
    },[])

    return(
        <View>
            {rankings.map(obj => 
                renderRow(obj.user,obj.position))
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
        fontSize: 17,
        flex: 1,
        paddingRight: 80
      },
      left: {
        flexDirection: "row",
        alignItems: "center"
    },
})


export default UserRankings;