import React, { useState } from 'react';
import { Avatar, Button, Card, Divider, Icon, List, ListItem, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';

export const FriendsList = ({ navigation }: Props) => {
    const getFriends = () => {
        let friendList = [];
        for (let i = 1; i <= 10; i++) {
            friendList.push({
                title: 'Friend',
                id: i,
            });
        }
        return friendList;
    }

    const [friends, setFriends] = useState(getFriends());

    const unfollowFriend = (id: number) => {
        setFriends(friends.filter(friend => friend.id !== id))
    };

    const renderUnfollowButton = (id: number) => (
        <Button
            size='tiny'
            onPress={() => unfollowFriend(id)}
        >
            Unfollow
        </Button>
    );

    const renderProfilePicture = (props: any) => (
        <Avatar
            {...props}
            style={[props.style, { tintColor: null }]}
            source={require('../assets/default_profile_picture.png')}
        />
        //<Icon {...props} name='person'/> // TODO: make Icon work and use it instead of Avatar
    );

    const renderListItem = ({ item, index } : any) => (
        <ListItem
            title={`${item.title} ${item.id}`}
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
        <Card
            header={Header}
            style={styles.card}
        >
            <List
                style={styles.container}
                data={friends}
                ItemSeparatorComponent={Divider}
                renderItem={renderListItem}
            />
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 400,
        width: 700,
    },
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});