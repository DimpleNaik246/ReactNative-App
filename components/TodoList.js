import React, { useState } from "react";
import { Button, FlatList, TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, toggleTodo } from "./Action";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const TodoList = () => {
    const [text, setText] = useState('');
    const todos = useSelector((state) => state.todos.todos);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const navigation = useNavigation();


    useEffect(() => {
        setData(todos);
    }, [todos])

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem,
                        { backgroundColor: isActive ? "red" : item.backgroundColor },
                    ]}
                >
                    <Text style={styles.text}>
                        {item.text}
                    </Text>
                    <Button title="Delete" onPress={() => dispatch(deleteTodo(item.id))} />
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Add new Todo"
                style={{ borderBottomWidth: 1, marginBottom: 10, color: 'black' }}
            />
            <Button title="Add Todo" onPress={() => { dispatch(addTodo(text)); setText(''); }} />

            <GestureHandlerRootView>
                <DraggableFlatList
                    data={data}
                    onDragEnd={({ data }) => setData(data)}  
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            </GestureHandlerRootView>


            <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    rowItem: {
        padding: 20,
        marginVertical: 5,
        backgroundColor: '#f9c2ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    text: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default TodoList;
