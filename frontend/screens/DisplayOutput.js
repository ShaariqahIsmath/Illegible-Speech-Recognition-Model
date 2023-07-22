import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Audio } from 'expo-av';


const DisplayOutput = ({route}) => {

    const { output_id, text, audio_url } = route.params;

    const [transcript, setTranscript] = useState('');
    const [sound, setSound] = useState(null);

    console.log(audio_url)
    
    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync( 
            { uri: audio_url}
        );
        setSound(sound);
    
        console.log('Playing Sound');
        await sound.playAsync();
      }
    
      React.useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);
    
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/wallpaper.png')}
          style={styles.backgroundImage}
        >
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/SpeakEase.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.dottedArea}>
            <Text style={styles.text}>{text}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={playSound}>
            <Text style={styles.buttonText}>Read</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
    
};


const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    dottedArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 380,
        height: 250,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
        borderColor: 'black',
        marginBottom: 20,
        top: 83
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    button: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 45,
        top: 70
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer:{
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo:{
        width: 250,
        height: 240,
        marginRight: 5,
        marginLeft: 5,
        marginTop: 20
      }
});


export default DisplayOutput