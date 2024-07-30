import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { logOut } from './UserReducer';
import { useNavigation } from '@react-navigation/native';

function HomePage() {
    const email = useSelector((state) => state.user.email);
    const imageInp = useSelector((state) => state.user.imageInp);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const [loading, setLoading] = useState(true);

    useEffect(() =>{
        if(!email) {
            navigation.navigate('SignUp');
            
        } 
    }, [email, navigation]);

    const handleLogOut = () => {
        dispatch(logOut(email));
        navigation.navigate('Login');
    };

    const navigateToTodo = () => {
        navigation.navigate('TodoList');
    }

   

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Home Page</Text>
            </View>
            <View style={styles.content}>
                {email ? (
                    <>
                        <Text style={styles.welcomeText}>Welcome, {email}!</Text>
                        {imageInp ? (
                            <FastImage source={{ uri: imageInp }} style={styles.image} />
                        ) : (
                            <Text style={styles.placeholderText}>No image uploaded.</Text>
                        )}
                    </>
                ) : (
                    <Text style={styles.placeholderText}>No user logged in.</Text>
                    
                )}
            </View>
            <Button title='Go to Todo List' onPress={navigateToTodo}></Button>
            <Button title="LogOut" onPress={handleLogOut} style={styles.button}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        backgroundColor: '#6200ea',
        padding: 20,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    placeholderText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#6200ea',
        marginTop: 20,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    button: {
        backgroundColor: '#6200ea',
        paddingVertical: 15,
        borderRadius: 10,
        // marginTop: 10,
      },
});

export default HomePage;
