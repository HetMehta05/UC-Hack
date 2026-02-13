import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './Screens/SplashScreen';
import SignUpScreen from './Screens/AuthPages/SignupPage';
import LoginScreen from './Screens/AuthPages/LoginScreen';
import DepartmentScreen from './Screens/departmentScreen';
import selectDoctorScreenCardiologist from "../MediQ/Screens/Department/selectDoctorScreenCardiologist";
import selectDoctorScreenDentist from "../MediQ/Screens/Department/selectDoctorScreenDentist";
import selectDoctorScreenEnt from "../MediQ/Screens/Department/selectDoctorScreenEnt";
import selectDoctorScreenNeurology from "../MediQ/Screens/Department/selectDoctorScreenNeurology";
import selectDoctorScreenOrthopedic from "../MediQ/Screens/Department/selectDoctorScreenOrthopedic";
import SelectDoctorScreen from './Screens/Department/selectDoctorScreenPulmonologist';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={DepartmentScreen}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name="cardio"
          component={selectDoctorScreenCardiologist}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="dentist"
          component={selectDoctorScreenDentist}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ent"
          component={selectDoctorScreenEnt}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="neuro"
          component={selectDoctorScreenNeurology}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ortho"
          component={selectDoctorScreenOrthopedic}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pulmono"
          component={SelectDoctorScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
