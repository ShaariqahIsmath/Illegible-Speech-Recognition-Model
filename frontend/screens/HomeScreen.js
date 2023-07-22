import React from 'react'
import { Text, StyleSheet, View, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'


const HomeScreen = () => {

    const navigation = useNavigation();
    const handleRegisterButtonClick = () => {
        navigation.navigate('SignUp');
    };

    const handleSignInButtonClick = () =>{
        navigation.navigate('SignIn')
    }

    const handleGetStartedButtonClick = () =>{
        navigation.navigate('SpeechToSpeech')
    }



    return (
        <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Use 'height' for Android
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <ImageBackground
                source={require('../assets/wallpaper.png')}
                style={styles.backgroundImage}
            >

                <View style={styles.buttonContainer}>
                    <Image
                        source={require('../assets/SpeakEase.png')}
                        style={styles.audioIcon}
                    />
                    <TouchableOpacity
                        style={styles.button}
                    onPress={handleGetStartedButtonClick}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.signButton}
                        onPress={handleRegisterButtonClick}
                    >
                        <Text style={styles.buttonText} >Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signButton}
                    onPress={handleSignInButtonClick}
                    >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>


                </View>


            </ImageBackground>
        </KeyboardAvoidingView>
    )

}

export default HomeScreen





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
    buttonContainer: {
        position: 'absolute',
        bottom: 150,
        left: 0,
        right: 0,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginVertical: 10,
        marginHorizontal: 5,
        flex: 1,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 50,
    },
    signButton: {
        marginVertical: 10,
        marginHorizontal: 5,
        flex: 1,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 65,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    audioIcon: {
        width: 230,
        height: 230,
        marginRight: 5,
        marginLeft: 5,
        marginBottom: 10
    },
});

