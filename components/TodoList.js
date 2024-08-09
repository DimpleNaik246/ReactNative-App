import React, { useState, useEffect } from "react";
import { Button, TextInput, TouchableOpacity, View, Text, StyleSheet, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, toggleTodo, setTodos, updateTodo } from "./Action";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';

const TodoList = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTodo, setCurrentTodo] = useState(null);
    const [updatedText, setUpdatedText] = useState('');
    const todos = useSelector((state) => state.todos);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const navigation = useNavigation();
    const ref = firestore().collection('todos');

    useEffect(() => {
        const unsubscribe = ref.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { text, completed } = doc.data();
                list.push({
                    id: doc.id,
                    text,
                    completed,
                });
            });
            setData(list);
            dispatch(setTodos(list));
            if (loading) {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [loading]);

    const handleAddTodo = async () => {
        if (!text.trim()) return;
        try {
            const newDocRef = await ref.add({
                text,
                completed: false,
            });
            const newTodo = {
                id: newDocRef.id,
                text,
                completed: false,
            };
            dispatch(addTodo(newTodo));
            setText('');
        } catch (error) {
            console.error('Error adding todo: ', error);
        }
    };

    const handleToggleTodo = async (id, currentStatus) => {
        try {
            await ref.doc(id).update({ completed: !currentStatus });
            dispatch(toggleTodo({
                id,
            }));
        } catch (error) {
            console.error('Error toggling todo: ', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            if (!id) {
                alert("ID is not set");
                return;
            }
            await ref.doc(id).delete();
            dispatch(deleteTodo({
                id,
            }));
        } catch (error) {
            console.error('Error deleting todo: ', error);
        }
    };

    const handleUpdateTodo = async () => {
        if (!updatedText.trim()) return;
        try {
            await ref.doc(currentTodo.id).update({ text: updatedText });
            dispatch(updateTodo({
                id: currentTodo.id,
                text: updatedText
            }));
            setUpdatedText('');
            setModalVisible(false);
        } catch (error) {
            console.error('Error updating todo: ', error);
        }
    };

    const openUpdateModal = (todo) => {
        setCurrentTodo(todo);
        setUpdatedText(todo.text);
        setModalVisible(true);
    };

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem,
                        { backgroundColor: isActive ? "lightcoral" : "#ffffff" },
                    ]}
                >
                    <Text style={styles.text}>{item.text}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTodo(item.id)}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => handleToggleTodo(item.id, item.completed)}
                        >
                            <Text style={styles.toggleButtonText}>
                                {item.completed ? 'Unmark' : 'Mark'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={() => openUpdateModal(item)}
                        >
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Add new Todo"
                style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
                <Text style={styles.addButtonText}>Add Todo</Text>
            </TouchableOpacity>

            <GestureHandlerRootView>
                <DraggableFlatList
                    data={data}
                    onDragEnd={({ data }) => setData(data)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            </GestureHandlerRootView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            value={updatedText}
                            onChangeText={setUpdatedText}
                            placeholder="Update Todo"
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateTodo}>
                            <Text style={styles.updateButtonText}>Update Todo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f7f7f7',
        flex: 1,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        padding: 10,
        fontSize: 16,
        color: 'black',
    },
    addButton: {
        backgroundColor: '#5cb85c',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rowItem: {
        padding: 20,
        marginVertical: 5,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    text: {
        color: "black",
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    toggleButton: {
        backgroundColor: '#5bc0de',
        padding: 10,
        borderRadius: 5,
    },
    toggleButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    updateButton: {
        backgroundColor: '#f0ad4e',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 15,
        paddingVertical: 10,
        backgroundColor: '#0275d8',
        borderRadius: 5,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default TodoList;
