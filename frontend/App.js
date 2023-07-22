import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import SpeechToSpeech from './screens/SpeechToSpeech';
import DisplayOutput from './screens/DisplayOutput';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
            <Stack.Screen options={{headerShown: false}} name="SignUp" component={SignUpScreen} />
            <Stack.Screen options={{headerShown: false}} name="SignIn" component={SignInScreen} />
            <Stack.Screen options={{headerShown: false}} name="SpeechToSpeech" component={SpeechToSpeech} />
            <Stack.Screen options={{headerShown: false}} name="DisplayOutput" component={DisplayOutput} />

            
          </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
