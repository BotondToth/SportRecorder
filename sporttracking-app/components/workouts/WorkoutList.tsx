import React, { useEffect, useState } from 'react';
import {
	Text,
	Button,
	List,
	Divider,
	Card,
	ListItem,
	Modal,
	Icon,
	Spinner,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { CreateWorkoutForm } from "./CreateWorkoutForm";
import Workout from '../../Interfaces/workout';

export const WorkoutList = () => {
	const [workoutInDetail, setWorkoutInDetail] = useState<Workout | undefined>(undefined);
	const [data, setData] = useState<Workout[]>([]);
	const [workoutFormVisible, setWorkoutFormVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const getWorkouts = async () => {
		setIsLoading(true);
		const token = await AsyncStorage.getItem('access-token');
		let config = {
			headers: {
				Authorization: token
			}
		};

		await axios
			.get('http://localhost:8080/workouts', config)
			.then((res) => {
				setIsLoading(false);
				setData(res.data);
			})
			.catch(error => {
				setIsLoading(false);
				console.log(error);
			});
	};

	const deleteWorkout = async (workoutId: string): Promise<any> => {

		const token = await AsyncStorage.getItem('access-token');
		let config = {
			headers: {
				Authorization: token
			}
		};
		return await axios
			.delete(`http://localhost:8080/workout/${workoutId}`, config)
			.then((res) => {
				return res.data;
			}).catch(err => {
				console.log(err);
			});
	}

	const renderIcon = (props: any) => (
		<Icon {...props} name="person-done-outline" />
	);

	useEffect(() => {
		getWorkouts();
	}, []);

	const onWorkOutPress = (workout: Workout) => {
		setWorkoutInDetail(workout);
	};

	const renderItem = ({ item }: { item: Workout }) => (
		<ListItem
			title={item.title}
			description={item.description}
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
				style={styles.deleteButton}
				size="small"
				onPress={async () => {
					await deleteWorkout(workoutInDetail!.id)
					setWorkoutInDetail(undefined)
					getWorkouts()
				}}
			>
				Delete
            </Button>
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
			<View style={styles.workoutHeader}>
				{workoutFormVisible && (
					<Modal
						style={styles.modal}
						visible={workoutFormVisible}
						backdropStyle={styles.backdrop}
						onBackdropPress={() => {
							setWorkoutFormVisible(false);
						}}
					>
						<CreateWorkoutForm
							onFinish={async () => {
								setWorkoutFormVisible(false);
								getWorkouts();
							}}
						/>
					</Modal>
				)}
				<Text category="h5" style={styles.workoutTitle}>
					Workout history
                </Text>
				<Button
					style={styles.addWorkoutButton}
					size="small"
					onPress={() => setWorkoutFormVisible(true)}
				>
					Add new workout
                </Button>
			</View>
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
			{isLoading
				? <View style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
					<Spinner size='giant' />
				</View>
				: <List
					data={data}
					ItemSeparatorComponent={Divider}
					renderItem={renderItem}
				/>}
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
	},
	workoutHeader: {
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 30,
	},
	workoutTitle: {
		padding: 15,
		backgroundColor: 'white',
	},
	addWorkoutButton: {
		padding: 10,
		width: 200,
	},
	deleteButton: {
		marginHorizontal: 5,
		backgroundColor: 'red',
		borderColor: 'red',
	},
});
