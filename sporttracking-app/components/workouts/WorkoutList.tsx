import React, { useEffect, useState } from 'react';
import {
    Text,
    Button,
    List,
    Divider,
    Card,
    ListItem,
    Modal,
    Icon
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export const WorkoutList = () => {
    const [workoutInDetail, setWorkoutInDetail] = useState(undefined);
    const [data, setData] = useState([]);

    const getWorkouts = async (): Promise<any> => {
        const token = await AsyncStorage.getItem('access-token');
        let config = {
            headers: {
                Authorization: token
            }
        };

        return await axios
            .get('http://localhost:8080/workouts', config)
            .then((res) => {
                return res.data;
            });
    };

    const renderIcon = (props: any) => (
        <Icon {...props} name="person-done-outline" />
    );

    // @ts-ignore
    useEffect(async () => {
        const fetchData = async () => {
            const result = await getWorkouts();
            setData(result);
        };

        fetchData();
    }, [setData]);

    const onWorkOutPress = (workout: any) => {
        setWorkoutInDetail(workout);
    };

    // @ts-ignore
    const renderItem = ({ item }) => (
        <ListItem
            title={`${item.title}`}
            description={`${item.description}`}
            accessoryLeft={renderIcon}
            onPress={() => onWorkOutPress(item)}
        />
    );

    const WorkoutDetailHeader = (props: any) => (
        <View {...props}>
            <Text category="h6">Workout Details</Text>
        </View>
    );

    const WorkoutDetailFooter = (props: any) => (
        <View {...props} style={[props.style, styles.footerContainer]}>
            <Button
                style={styles.footerControl}
                size="small"
                onPress={() => setWorkoutInDetail(undefined)}
            >
                Close
            </Button>
        </View>
    );

    return (
        <>
            {workoutInDetail && (
                <Modal
                    style={styles.modal}
                    visible={!!workoutInDetail}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setWorkoutInDetail(undefined)}
                >
                    <Card
                        status="primary"
                        disabled={true}
                        header={WorkoutDetailHeader}
                        footer={WorkoutDetailFooter}
                    >
                        <Text category="s1">Title</Text>
                        <Text style={styles.lowerLine}>
                            {workoutInDetail.title}
                        </Text>

                        <Text category="s1">Description</Text>
                        <Text style={styles.lowerLine}>
                            {workoutInDetail.description}
                        </Text>

                        <Text category="s1">Type</Text>
                        <Text style={styles.lowerLine}>
                            {workoutInDetail.type}
                        </Text>

                        <Text category="s1">Duration</Text>
                        <Text style={styles.lowerLine}>
                            {workoutInDetail.duration}
                        </Text>

                        <Text category="s1">Distance</Text>
                        <Text style={styles.lowerLine}>
                            {workoutInDetail.distance} km
                        </Text>

                        <Text category="s1">Calories</Text>
                        <Text style={styles.lowerLine}>
                            {workoutInDetail.calories} kcal
                        </Text>
                    </Card>
                </Modal>
            )}
            <List
                data={data}
                ItemSeparatorComponent={Divider}
                renderItem={renderItem}
            />
        </>
    );
};

const styles = StyleSheet.create({
    modal: {
        width: '75%',
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    footerControl: {
        marginHorizontal: 2,
    },
    lowerLine: {
        marginBottom: 20,
    }
});
