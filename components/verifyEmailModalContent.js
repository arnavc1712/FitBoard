import React, { Component, useState, useEffect } from 'react';

import {Text,Button} from 'native-base';

import {
  StyleSheet,
  View
} from 'react-native';

const VerifyEmailContent = (props) => {

    return(
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Please Verify your Email</Text>
        <Button full rounded testID={'close-button'} onPress={props.onPress} btnTextSize={12} style={{backgroundColor:'white',width:'auto'}}><Text style={{color:'#009688'}}>Verify Email Id</Text></Button>
      </View>
  )
};

const styles = StyleSheet.create({
 content: {
    alignSelf:'center',
    backgroundColor: '#009688',
    padding: 50,
    // height:'20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: 'rgba(0, 0, 0, 0.1)',

  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 10,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    color:'white'
  },
});

export default VerifyEmailContent;