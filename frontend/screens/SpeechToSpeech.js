import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';

const SpeechToSpeech = () => {
    const [audioFile, setAudioFile] = useState(null);
    const [output_id, setOutputId] = useState('');
    const [text, setText] = useState('');
    const [audio_url, setAudioUrl] = useState('')


    const navigation = useNavigation();

        const handleTranscribeButtonClick = () => {
        navigation.navigate('Home');
    };

    const outputIdRef = React.useRef('');
    const textRef = React.useRef('');
    const audioUrlRef = React.useRef('');
    
    const callSpeechRecognitionAPI = async () => {
      try {
        const formData = new FormData();
        formData.append('audio', audioFile); // Add the audio file to the FormData
    
        const response = await fetch('http://192.168.8.120:5001/speech-recognition', {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log(data);
    
          outputIdRef.current = data.output_id;
          textRef.current = data.text;
          audioUrlRef.current = data.audio_url;

 
        }
    
        // Navigate to the next screen where you want to use the stored values
        navigation.navigate('DisplayOutput', {output_id: outputIdRef.current, text: textRef.current, audio_url:audioUrlRef.current} );
      } catch (error) {
        console.error(error);
      }
    };
    
    React.useEffect(() => {
      setOutputId(outputIdRef.current);
      setText(textRef.current);
      setAudioUrl(audioUrlRef.current);

    }, []);
    
    

    const handleFileSelection = async () => {
        try {
            const { type, uri } = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
            if (type === 'success') {
                const fileExtension = uri.split('.').pop().toLowerCase();
                let fileType = '';
                if (fileExtension === 'wav') {
                    fileType = 'audio/wav';
                } else if (fileExtension === 'mp3') {
                    fileType = 'audio/mpeg';
                }
                const selectedAudioFile = {
                    uri,
                    name: uri.split('/').pop(), // Set the file name
                    type: fileType, // Set the file type based on the extension
                };
                setAudioFile(selectedAudioFile);
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
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
                        style={styles.logo}
                    />
                </View>
                <View style={styles.containerBorder}>
                    <Image
                        source={require('../assets/aud_icon2.jpg')}
                        style={styles.audioIcon}
                    />
                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>MP3 or WAV</Text>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handleFileSelection}
                        >
                            <Text style={styles.buttonText}>Upload Audio</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.transcribeButton, { opacity: audioFile ? 1 : 0.5 }]}
                    onPress={callSpeechRecognitionAPI}
                    disabled={!audioFile}
                >
                    <Text style={styles.buttonText}>Transcribe</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBorder: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 380,
        height: 250,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
        borderColor: 'black',
        marginBottom: 50,
        top: 155
    },
    audioIcon: {
        width: 85,
        height: 100,
        marginRight: -65,
        marginLeft: 5,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    uploadButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    transcribeButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 45,
        marginBottom: 5,
        top: 110
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconContainer:{
        position: 'absolute',
        top: 300,
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
        marginTop: -185
      }
});

export default SpeechToSpeech;
