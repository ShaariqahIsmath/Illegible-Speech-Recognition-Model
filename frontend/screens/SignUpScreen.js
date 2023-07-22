import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, KeyboardAvoidingView, ImageBackground, Image, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import axios from 'axios'

const SignUpScreen = () => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  // const handleButtonClick = () => {
  //     navigation.navigate('Home');
  // };



  const signUp = async (userData) => {
    try {
      const url = 'http://192.168.8.120:5001/signup';

      const params = new URLSearchParams();
      Object.entries(userData).forEach(([key, value]) => {
        params.append(key, value);
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),

      });
      console.log(userData)

      if (response.ok) {
        console.log(response)
        navigation.navigate('Home')
        return response.text();
      } else {
        throw new Error('Sign up failed');
      }
    } catch (error) {
      throw error;
    }
  };


  const handleSignUp = async () => {
    const formData = {
      email: email,
      username: username,
      password: password,
    };

    try {
      const response = await signUp(JSON.stringify(formData));
      console.log(response); // Handle the response accordingly
    } catch (error) {
      console.error(error); // Handle the error accordingly
    }
  };



  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Use 'height' for Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <View style={styles.container}>
        <ImageBackground source={require('../assets/wallpaper.png')} style={styles.backgroundImage}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/SpeakEase.png')}
              style={styles.audioIcon}
            />
          </View>


          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>CREATE ACCOUNT</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
            />

            <TouchableOpacity style={styles.signUpButton}>
              <Text style={styles.signUpButtonText} onPress={handleSignUp}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ImageBackground>
      </View>

    </KeyboardAvoidingView>
  )

}

export default SignUpScreen





const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#050505',
    top: 5,
    marginLeft: 20,
    marginBottom: 30


  },
  audioIcon: {
    width: 250,
    height: 240,
    marginRight: 5,
    marginLeft: 5,
    marginTop: -190
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 90,
    paddingVertical: 10
  },
  iconContainer: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButton: {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  fieldContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})