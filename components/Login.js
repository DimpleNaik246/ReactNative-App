import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { loginAction } from './UserReducer';
import { LoginManager, Profile, AccessToken } from 'react-native-fbsdk-next';
import { IconButton, TextInput as PaperInput, Button as PaperButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { colors } = useTheme();

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('Home');
    }
  }, [isLoggedIn, navigation]);

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

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("User Info:", userInfo);

      dispatch(loginAction({ email: userInfo.user.email, authMethod: 'Google' }));

      Alert.alert('Success', 'Signed in with Google!', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-In Cancelled', 'You cancelled the sign-in process.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-In In Progress', 'Sign-in is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available', 'Google Play Services are not available or outdated.');
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    }
  };

  const onFacebookButtonPress = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      const profile = await Profile.getCurrentProfile();
      if (profile) {
        dispatch(loginAction({ email: profile.email, password: null, authMethod: 'Facebook' }));
        Alert.alert('Success', 'Signed in with Facebook!', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
      }
    } catch (error) {
      console.log('Login failed with error: ' + error);
      Alert.alert('Error', error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <PaperInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        theme={{ colors: { primary: colors.primary } }}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <PaperInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={{ colors: { primary: colors.primary } }}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <PaperButton mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </PaperButton>

      <PaperButton mode="contained" onPress={handleSignUp} style={[styles.button, styles.signupButton]}>
        Sign Up
      </PaperButton>

      <View style={styles.socialButtonsContainer}>
        <IconButton
          icon="google"
          color="#ffffff"
          size={24}
          onPress={onGoogleButtonPress}
          style={styles.socialButton}
        />

        <Text style={styles.orText}>OR</Text>

        <IconButton
          icon="facebook"
          color="#ffffff"
          size={24}
          onPress={onFacebookButtonPress}
          style={styles.socialButton}
        />
      </View>

      <PaperButton mode="outlined" onPress={signOut} style={styles.signOutButton}>
        Sign Out
      </PaperButton>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
  signupButton: {
    backgroundColor: '#03dac6',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  socialButton: {
    marginHorizontal: 10,
  },
  orText: {
    color: '#333',
    fontSize: 16,
    marginHorizontal: 10,
  },
  signOutButton: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default Login;
