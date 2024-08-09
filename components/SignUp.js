import React, { useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import { registerAction } from './UserReducer';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [dob, setDob] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [imageInp, setImageInp] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const validateForm = async () => {
        const schema = Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().min(6, 'Password too short').required('Required'),
            dob: Yup.date().required('Date of birth is required')
        });

        try {
            await schema.validate({ email, password, dob }, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach((error) => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
            return false;
        }
    };

    const handleSignUp = async () => {
        const isValid = await validateForm();
        if (isValid) {
            try {
                dispatch(registerAction(email, password, dob, imageInp));
                Alert.alert('Success', `Registered with:\nEmail: ${email}\nDate of Birth: ${dob.toDateString()}`);
                navigation.navigate('Login');
            } catch (error) {
                console.error('Error during sign up:', error);
                Alert.alert('Error', 'An error occurred during sign-up. Please try again.');
            }
        }
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        setDob(date);
        hideDatePicker();
    };

    const selectImage = () => {
        launchImageLibrary({}, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', 'An error occurred while picking the image.');
            } else {
                const uri = response.assets[0].uri;
                setImageInp(uri);
            }
        }).catch(error => {
            console.error('Error during image selection:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <Text style={styles.label}>Date of Birth:</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
                <Text style={styles.dateText}>{dob.toDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
                modal
                open={isDatePickerVisible}
                date={dob}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            <TouchableOpacity style={styles.imagePickerButton} onPress={selectImage}>
                <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
            {imageInp ? (
                <FastImage source={{ uri: imageInp }} style={styles.image} />
            ) : null}

            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        color: 'black',
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    dateInput: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    imagePickerButton: {
        backgroundColor: '#6200ea',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    signupButton: {
        backgroundColor: '#03dac6',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 15,
        alignSelf: 'center',
        borderRadius: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
});

export default SignUp;
