import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import HomePage from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import store from "./components/Store";
import { Provider } from 'react-redux';
import TodoList from "./components/TodoList";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from "./components/Store";
import { NotificationService } from "./components/PushNotification";

function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const onNotification = (notification) => {
      console.log('Notification received:', notification);
    };

    NotificationService.configure(onNotification);

    
    NotificationService.localNotification('Notification here!', "Notification generated using push-notification");
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="TodoList" component={TodoList} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App;
