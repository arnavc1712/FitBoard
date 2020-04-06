import React, { Component } from 'react';
// import Permissions from 'react-native-permissions';
import { Container, Text ,Button,Content,Form,Input,Root,Header,Body,Title,Item as FormItem,Label} from 'native-base';
import {
  StyleSheet 
} from 'react-native';

import Constants from 'expo-constants';




class LoginScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:''
        }

        this.navigation = props.navigation
     
    }


    onLogin() {
        // console.log(this.navigation)
        // console.log(this.props)
        this.navigation.navigate('Home')
    }

    render(){
        return(

            <Container style={{ paddingTop: Constants.statusBarHeight }}>
               <Content padder contentContainerStyle={styles.form}>
                   <Form>
                        <FormItem floatingLabel style={styles.item}>
                          <Label>Email ID</Label>
                          <Input value={this.state.email} onChangeText={val => this.setState({email:val})}/>
                        </FormItem>
                        <FormItem floatingLabel last style={styles.item}>
                          <Label>Password</Label>
                          <Input value={this.state.password} secureTextEntry={true} onChangeText={val => this.setState({password:val})}/>
                        </FormItem>

                          
                        <Button full rounded style={styles.button} onPress={this.onLogin.bind(this)} ><Text> Login </Text></Button>
               
                    </Form>
               </Content>
                
            </Container>
        );
    }
}




const styles = StyleSheet.create({
    form:{
    flex:1,
    justifyContent : 'center'
    },
  item:{
    borderBottomWidth:2,
    borderColor:'#009688'
  },
  button:{
    marginTop:15,
    width:"50%",
    alignSelf:'center',
    backgroundColor:'#009688'
    // flexDirection:'row'
  }

})

export default LoginScreen;