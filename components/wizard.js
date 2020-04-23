import React, {Component,useState} from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import {Button,Text,Toast} from 'native-base'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import { View,StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DestinationPicker from './destinationPicker'



const defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flex: 1,
      justifyContent: 'center'
    }
  };



const Wizard = () => {

    const [date,setDate] = useState(new Date())
    const [mode, setMode] = useState('datetime');
    const [show, setShow] = useState(false)
    const [event, setEvent] = useState(null)
    const [distance, setDistance] = useState(null)
    const [errors,setErrors] = useState(false)

    const eventItems = [{ label: 'Marathon', value: 'Marathon' },{ label: 'Cyclathon', value: 'Cyclathon' }]
    const distItems = [{ label: '5K', value: '5K' },{ label: '10K', value: '10K' },{ label: '21K', value: '21K' },{ label: '42K', value: '42K' }]

    const onChange = (date) => {
        setShow(false)
        setDate(date)
        
    }
    const onCancel = () => {
        setShow(false);
    }

    const onDateNext = () => {
        if (date==null || event==null || distance==null){
            setErrors(true)
            Toast.show({text:"Please fill up all fields before proceeding",buttonText:"Okay",duration:3000})
        }
        else{
            setErrors(false)
        }
    }
    return (
        <View style={{flex: 1}}>
            <ProgressSteps>
                <ProgressStep label="Date and time" scrollViewProps={defaultScrollViewProps} onNext={onDateNext} errors={errors}>
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
                   
                </ProgressStep>
                <ProgressStep label="Second Step" scrollViewProps={defaultScrollViewProps}>
                    {/* <View style={{ alignItems: 'center' }}> */}
                        <DestinationPicker/>
                    {/* </View> */}
                </ProgressStep>
                <ProgressStep label="Third Step" scrollViewProps={defaultScrollViewProps}>
                    <View style={{ alignItems: 'center' }}>
                        <Text>This is the content within step 3!</Text>
                    </View>
                </ProgressStep>
            </ProgressSteps>
        </View>
    )
}


const styles = StyleSheet.create({
    button:{
        width:'60%',
        height:50,
        alignSelf:'center',
        margin:10,
    },
    picker: {
        width:'60%',
        height:50,
        alignSelf:'center',
        margin:10,
        color:'white',
        
    }
})

export default Wizard;