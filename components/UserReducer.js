import { Alert } from "react-native";

const initialState = {
    email: '',
    dob: '',
    imageInp: '',
    isLoggedIn: false,
    users: [
        { email: 'dimple.naik2003@gmail.com', password: 'simple' },
        { email: 'example@gmail.com', password: 'example1' },
    ]
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'LOGIN':
            console.log(action.payload);
            if (action.payload.email.authMethod === 'Google' || action.payload.email.authMethod === 'Facebook') {
                return {
                    ...state,
                    email: action.payload.email.email,
                    isLoggedIn: true,
                };
            } else {
                const user = state.users.find(user => user.email === action.payload.email);

                if (user) {
                    if (user.password === action.payload.password) {
                        return {
                            ...state,
                            email: action.payload.email,
                            isLoggedIn: true,
                        };
                    } else {
                        Alert.alert('Incorrect Password');
                        return state;
                    }
                } else {
                    Alert.alert('User not found, please register first');
                    return state;
                }
            }


        case 'REGISTER':
            const existingUser = state.users.find(user => user.email === action.payload.email);
            if (existingUser) {
                Alert.alert('User already exists');
                return state;
            }

            return {
                ...state,
                users: [...state.users, { email: action.payload.email, password: action.payload.password }],
                email: action.payload.email,
                dob: action.payload.dob,
                imageInp: action.payload.imageInp,
                isLoggedIn: true,
            };

        case 'LOGOUT':
            console.log(`User with ${action.payload.email} has logged out!`);
            return {
                ...state,
                email: '',
                dob: '',
                imageInp: '',
                isLoggedIn: false,
            };

        case 'SET_DOB':
            return {
                ...state,
                dob: action.payload.dob,
            };

        case 'SET_IMAGE':
            return {
                ...state,
                imageInp: action.payload.imageInp,
            };

        case 'GOOGLE_SIGN_IN':
            return {
                ...state,
                email: action.payload.email,
                isLoggedIn: true,
            };

        default:
            return state;
    }
};

export const loginAction = (email, password=null, authMethod = 'Email') => ({
    type: 'LOGIN',
    payload: { email, password, authMethod },
});

export const registerAction = (email, password, dob, imageInp) => ({
    type: 'REGISTER',
    payload: { email, password, dob, imageInp },
});

export const logOut = (email) => ({
    type: 'LOGOUT',
    payload: { email },
});

export const setDobAction = (dob) => ({
    type: 'SET_DOB',
    payload: { dob },
});

export const setImageAction = (imageInp) => ({
    type: 'SET_IMAGE',
    payload: { imageInp },
});

export const googleSignInAction = (email) => ({
    type: 'GOOGLE_SIGN_IN',
    payload: { email },
});

export default UserReducer;
