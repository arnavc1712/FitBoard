import React, {Component,useState} from 'react';
import { View,StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Button,Text,Toast} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons';
import customStyles from '../../styles.json'






const EventDetailPicker = ({event,setEvent,distance,setDistance,date,setDate}) => {

    const [show, setShow] = useState(false)
    const [mode, setMode] = useState('datetime');

    const eventItems = [{ label: 'Marathon', value: 'Marathon' },{ label: 'Cyclathon', value: 'Cyclathon' }]
    const distItems = [{ label: '1K', value: '1K' },{ label: '2K', value: '5K' },{ label: '5K', value: '5K' },{ label: '10K', value: '10K' },{ label: '21K', value: '21K' },{ label: '42K', value: '42K' }]
    
    const onChange = (date) => {
        setShow(false)
        setDate(date) 
    }

    const onCancel = () => {
        setShow(false);
    }

    return (
        <React.Fragment>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.picker}>
                    <RNPickerSelect 
                        onValueChange={(value) => {setEvent(value)}}
                        value={event}
                        placeholder={{
                            label: 'Select Event',
                            value: null,
                            color: 'red',
                        }}
                        // style={{backgroundColor:'red'}}
                        items={eventItems}
                        Icon={() => {
                            return <Ionicons  name="md-arrow-down" stylesize={12} color="gray" />
                        }}
                    />
                </View>

                <View style={styles.picker}>
                    <RNPickerSelect 
                        onValueChange={(value) => setDistance(value)}
                        placeholder={{
                            label: 'Select Distance',
                            value: null,
                            color: 'red',
                        }}
                        value={distance}
                        items={distItems}
                        Icon={() => {
                            return <Ionicons  name="md-arrow-down" stylesize={24} color="gray" />
                        }}
                        />
                </View>

                <Button full rounded style={styles.button} onPress={()=>{setShow(true)}}><Text style={{fontSize:12}}> Pick Date and Time </Text></Button>
                    
            </View>
                    
            <DateTimePickerModal
                isVisible={show}
                value={date}
                mode={mode}
                minimumDate={new Date()}
                display="default"
                onConfirm={onChange}
                onCancel = {onCancel}
            />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    button:{
        width:'60%',
        height:50,
        alignSelf:'center',
        margin:10,
        backgroundColor:customStyles.solidButton.color
    },
    picker: {
        width:'60%',
        height:50,
        alignSelf:'center',
        margin:10,
        color:'white',
        
    }
})

export default EventDetailPicker;