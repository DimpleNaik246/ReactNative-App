import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { logOut } from './UserReducer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function HomePage() {
    const email = useSelector((state) => state.user.email);
    const imageInp = useSelector((state) => state.user.imageInp);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        if (!email) {
            navigation.navigate('SignUp');
        }
    }, [email, navigation]); 

    const handleLogOut = () => {
        dispatch(logOut(email));
        navigation.navigate('Login');
    };

    const navigateToTodo = () => {
        navigation.navigate('TodoList');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Home Page</Text>
            </View>
            <View style={styles.content}>
                {email ? (
                    <>
                        {imageInp ? (
                            <FastImage source={{ uri: imageInp }} style={styles.image} />
                        ) : (
                            <Text style={styles.placeholderText}>No image uploaded.</Text>
                        )}
                        <Text style={styles.welcomeText}>Welcome, {email}!</Text>
                    </>
                ) : (
                    <Text style={styles.placeholderText}>No user logged in.</Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.todoButton]} onPress={navigateToTodo}>
                    <Icon name="list" size={24} color="white" />
                    <Text style={styles.buttonText}>Go to Todo List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogOut}>
                    <Icon name="logout" size={24} color="white" />
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        alignItems: 'center',
        paddingVertical: 20,
    },
    header: {
        width: '100%',
        backgroundColor: '#6200ea',
        paddingVertical: 20,
        alignItems: 'center',
        marginBottom: 20,
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
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
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
    buttonContainer: {
        width: '90%',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todoButton: {
        backgroundColor: '#6200ea', // Color matching the login button
    },
    logoutButton: {
        backgroundColor: '#03dac6', // Color matching the sign-up button
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default HomePage;
