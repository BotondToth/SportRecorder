import React, { useEffect, useState } from 'react';
import {
	Avatar,
	Button,
	Card,
	Divider,
	Icon,
	List,
	ListItem,
	Text,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

const getFriends = () => {
	let friendList = [];
	for (let i = 1; i <= 10; i++) {
		friendList.push({
			title: 'Friend',
			id: i
		});
	}
	return friendList;
};

export const FriendsList = () => {
	const [friends, setFriends] = useState<{ id: number, title: string }[]>([]);

	useEffect(() => {
		setFriends(getFriends());
	}, []);

	const unfollowFriend = (id: number) => {
		setFriends(friends.filter((friend) => friend.id !== id));
	};

	const renderUnfollowButton = (id: number) => (
		<Button size="tiny" onPress={() => unfollowFriend(id)}>
			Unfollow
		</Button>
	);

	const renderProfilePicture = (props: any) => (
		<Icon {...props} name="person" />
	);

	const renderListItem = ({ item }: any) => (
		<ListItem
			title={item.title + '' + item.id}
			accessoryLeft={renderProfilePicture}
			accessoryRight={() => renderUnfollowButton(item.id)}
		/>
	);

	const Header = (props: any) => (
		<View {...props}>
			<Text category="h6">My Friends</Text>
		</View>
	);

	return (
		<Card header={Header} style={styles.card} disabled={true}>
			<List
				style={styles.container}
				data={friends}
				ItemSeparatorComponent={Divider}
				renderItem={renderListItem}
			/>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		maxHeight: 400,

	},
	card: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
