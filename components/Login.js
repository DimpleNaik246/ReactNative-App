import React, { useState, useEffect } from 'react';
import { Button, Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginAction } from './UserReducer';
import {useSelector} from 'react-redux';


const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);


  useEffect(() => {
    if (!isLoggedIn) {
        setEmail('');
        setPassword('');
    }
}, [isLoggedIn]);

  const validateForm = async () => {
    const schema = Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Password too short').required('Required'),
    });

    try {
      await schema.validate({ email, password }, { abortEarly: false });
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

  const handleLogin = async () => {
    const isValid = await validateForm();
    if (isValid) {
      dispatch(loginAction(email, password));
      navigation.navigate('Home');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={handleSignUp}>
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#03dac6',
  },
});

export default Login;
