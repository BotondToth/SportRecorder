import React, { useState } from 'react';
import {
    Text,
    Button,
    Card,
    Input,
    Select,
    SelectItem,
    IndexPath
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const data = ['Running', 'Cycling', 'Walking'];

export const CreateWorkoutForm = (props: any) => {
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const workoutType = data[selectedIndex.row];
    const [duration, setDuration] = useState('0');
    const [distance, setDistance] = useState('0');
    const [calories, setCalories] = useState('0');

    const onSubmit = async () => {
        const workout = {
            title,
            description,
            workoutType,
            duration: parseInt(duration),
            distance: parseInt(distance),
            calories: parseInt(calories)
        };
        const token = await AsyncStorage.getItem('access-token');
        let config = {
            headers: {
                Authorization: token
            }
        };

        props.onFinish();
        await axios
            .post('http://localhost:8080/workout', workout, config)
            .then(props.onFinish());
    };

    const Header = (props: any) => (
        <View {...props}>
            <Text category="h6">SportTracking</Text>
            <Text category="s1"> Add new workout </Text>
        </View>
    );

    const Footer = (props: any) => (
        <View {...props} style={[props.style, styles.footerContainer]}>
            <Button
                style={styles.footerControl}
                size="small"
                status="basic"
                onPress={onSubmit}
            >
                Save
            </Button>
        </View>
    );

    const renderOption = (key: number, title: string) => (
        <SelectItem key={key} title={title} />
    );

    return (
        <Card
            disabled={true}
            style={styles.card}
            header={Header}
            footer={Footer}
        >
            <Input
                style={styles.field}
                value={title}
                label="Workout title"
                placeholder="The name of your workout"
                caption="You should name your new workout here"
                secureTextEntry={false}
                onChangeText={(nextValue) => setTitle(nextValue)}
            />
            <Input
                style={styles.field}
                value={description}
                label="Workout description"
                placeholder="The description of your workout"
                caption="You should give a short summary of your workout here"
                secureTextEntry={false}
                onChangeText={(nextValue) => setDescription(nextValue)}
            />
            <Select
                label="Workout type"
                placeholder="The type of your workout"
                caption="You should select the type of workout here"
                style={styles.field}
                value={workoutType}
                selectedIndex={selectedIndex}
                // @ts-ignore
                onSelect={(index) => setSelectedIndex(index)}
            >
                {data.map((element, idx) => renderOption(idx, element))}
            </Select>
            <Input
                style={styles.field}
                value={duration}
                label="Workout duration"
                placeholder="The duration of your workout in minutes"
                caption="You should add the length of your workout here"
                secureTextEntry={false}
                onChangeText={(nextValue) => setDuration(nextValue)}
            />
            <Input
                style={styles.field}
                value={distance}
                label="Workout distance"
                placeholder="The distance of your workout in kilometres"
                caption="You should add the distance of your workout here"
                secureTextEntry={false}
                onChangeText={(nextValue) => setDistance(nextValue)}
            />
            <Input
                style={styles.field}
                value={calories}
                label="Burnt calories"
                placeholder="The calories you burnt during your workout"
                caption="You should add the calories you burnt here"
                secureTextEntry={false}
                onChangeText={(nextValue) => setCalories(nextValue)}
            />
        </Card>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    footerControl: {
        marginHorizontal: 2,
    },
    field: {
        marginBottom: 20,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
