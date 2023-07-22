import React,  { useState, useEffect }  from 'react'
import { Text, StyleSheet, View, KeyboardAvoidingView, ImageBackground, Image, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import axios from 'axios'

const SignInScreen = () => {

    const navigation = useNavigation();


    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [user_id, setUserid] = useState('');

    const signIn = async (username, password) => {
        try {
          const response = await axios.post('https://192.168.8.120:5001/signin', {
            username: username,
            password: password,
          });
          
          const { user_id } = response;
          
          // Example using useState
          setUserid(user_id);
          
          // Navigate to the next page where you want to use the user ID
          navigation.navigate('SpeechToSpeech');
        } catch (error) {
          console.error(error);
          // Handle error response
        }
      };
      
      const handleSignIn = () => {
        // Get the username and password from the form inputs
        const inputUsername = username;
        const inputPassword = password;

        signIn(inputUsername, inputPassword);

      };


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/wallpaper.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../assets/SpeakEase.png')}
                        style={styles.audioIcon}
                    />

                </View>
                <View style={styles.fieldContainer}>

                <Text style={styles.loginText}>Login</Text>
                <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername}/>
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loginText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    signInButton: {
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 10,
    },
    signInButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginPromptText: {
        fontSize: 14,
        color: '#666666',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer:{
        position: 'absolute',
        top: 330,
        left: 0,
        right: 0,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioIcon: {
        width: 260,
        height: 240,
        marginRight: 5,
        marginLeft: 5,
        marginTop: -220
    },
    fieldContainer:{
        position: 'absolute',
        bottom: 110,
        left: 0,
        right: 0,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default SignInScreen;

