import React from 'react';
import { Avatar, Button, Card, Divider, List, ListItem, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';

export const FriendsList = ({ navigation }: Props) => {
    const getFriendsOfUser = (user: any) => {
        return new Array(10).fill({
            title: 'Friend',
        });
    };

    const renderUnfollowButton = () => (
        <Button size='tiny'>Unfollow</Button>
    );

    const renderProfilePicture = (props: any) => (
        <Avatar
            {...props}
            style={[props.style, { tintColor: null }]}
            source={require('../assets/default_profile_picture.png')}
        />
    );

    const renderListItem = ({ item, index } : any) => (
        <ListItem
            title={`${item.title} ${index + 1}`}
            accessoryLeft={renderProfilePicture}
            accessoryRight={renderUnfollowButton}
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
                data={getFriendsOfUser(null)}
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