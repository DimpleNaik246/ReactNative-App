import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
 

const NUM_ITEMS = 10;

function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const initialData = [...Array(NUM_ITEMS)].map((_, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${index}`,
    label: String(index),
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
  };
});

export default function DragFunction() {
  const [data, setData] = useState(initialData);

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
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView>
        <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
    />
    </GestureHandlerRootView>
    
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
