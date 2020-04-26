import React, {useState} from 'react';
import {Picker, Text, StyleSheet, View, TextInput, Button, TouchableOpacity, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default class createevent extends React.Component {

  
  state = {
    eventname: "",
    eventtype: "",
    description: "",
    start: "",
    finish: "",
    date: "",
    time: ""
  }

  onPressButton() {
  firestore()
      .collection('Events')
      .add({
        name: this.state.eventname,
        type: this.state.eventtype,
        description: this.state.description,
        start: this.state.start,
        finish: this.state.finish,
        date: this.state.date,
        time: this.state.time,
      })
      .then(() => {
        console.log('Event Created!');
      });

  Alert.alert(
    'Successful!',
    'Event has been created',
  );

  }

  render() {

    const { name, type, description, start, finish, date, time } = this.state

    return(
        <View style={styles.eventform}>
          <Text style={styles.header}>Create An Event </Text>

          <TextInput 
            style={styles.textinput} 
            placeholder="Event Name" 
            value={name}
            onChangeText={value => this.setState({ eventname: value })}
            underlineColorAndroid={'transparent'} />

          <TextInput 
            style={styles.textinput} 
            placeholder="Event Type" 
            value={type} 
            onChangeText={value => this.setState({ eventtype: value })}
            underlineColorAndroid={'transparent'} />

          <TextInput 
            style={styles.textinput} 
            placeholder="Add a Description" 
            value={description}
            onChangeText={value => this.setState({ description: value })}
            underlineColorAndroid={'transparent'} />

          <TextInput 
            style={styles.textinput} 
            placeholder="Starting Location" 
            value={start}
            onChangeText={value => this.setState({ start: value })}
            underlineColorAndroid={'transparent'} />

          <TextInput 
            style={styles.textinput} 
            placeholder="Finish Location" 
            value={finish}
            onChangeText={value => this.setState({ finish: value })}
            underlineColorAndroid={'transparent'} />

          <TextInput 
            style={styles.textinput} 
            placeholder="Date" 
            value={date}
            onChangeText={value => this.setState({ date: value })}
            underlineColorAndroid={'transparent'} />

          <TextInput 
            style={styles.textinput} 
            placeholder="Time" 
            value={time}
            onChangeText={value => this.setState({ time: value })}
            underlineColorAndroid={'transparent'} />

          <TouchableOpacity onPress={this.onPressButton.bind(this)} style={styles.button}>
            <Text style={styles.buttontxt}> Create Event </Text>
          </TouchableOpacity>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  eventform: {
      alignSelf: 'stretch',
      backgroundColor: '#ffffff',
      padding: 20,
  },
  header: {
      alignItems: 'center',
      fontSize: 24,
      color: '#bbb',
      marginBottom: 30,
      paddingTop: 15,
      borderBottomColor: '#199187',
      borderBottomWidth: 1,
  },
  textinput: {
    alignSelf: 'stretch',
    height:40,
    marginBottom: 20,
    color: '#59cbbd',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',
    marginTop: 30,
  },
  buttontxt: {
    color: '#fff',
    fontWeight: 'bold',
  }
},);
