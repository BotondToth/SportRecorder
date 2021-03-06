import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Icon,
  List,
  ListItem, Modal,
  Text,
} from '@ui-kitten/components';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Friendship, User } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { Client } from '../../api';

const styles = StyleSheet.create({
  usersModal: { width: '75%' },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  searchButton: {
    marginTop: 10,
    width: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    marginTop: 50,
    maxHeight: Dimensions.get('window').height * 0.75,
    width: Dimensions.get('window').width * 0.75,
  },
  usersContainer: {
    maxHeight: Dimensions.get('window').height * 0.50,
    width: Dimensions.get('window').width * 0.50,
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
  footerControl: { marginHorizontal: 2 },
});

export const FriendsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [addNewFriendCardVisible, setAddNewFriendCardVisible] = useState<boolean>(false);
  const client: Client = Client.getInstance();

  const getFriendships = async () => {
    setIsLoading(true);
    const response = await client.sendRequest<Friendship[]>('friends');
    setIsLoading(false);
    setFriendships(response.data);
  };

  const getUsers = async () => {
    setIsLoading(true);
    const response = await client.sendRequest<User[]>('users');
    setIsLoading(false);
    setUsers(response.data);
  };

  useEffect(() => {
    getFriendships();
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AllUsersCardHeader = (props: any) => (
    <View {...props}>
      <Text category="h6">Find new friends!</Text>
    </View>
  );

  const AllUsersCardFooter = (props: any) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        style={styles.footerControl}
        size="small"
        onPress={() => setAddNewFriendCardVisible(false)}
      >
        Close
      </Button>
    </View>
  );

  const unfollowFriend = async (id: string) => {
    await client.sendRequest(`friends?friendshipId=${id}`, null, true);
    setAddNewFriendCardVisible(false);
    await getFriendships();
  };

  const followFriend = async (friendId: string) => {
    await client.sendRequest('friends', { friendId });
    setAddNewFriendCardVisible(false);
    await getFriendships();
  };

  const renderUnfollowButton = (id: string) => (
    <Button status="danger" size="tiny" onPress={async () => await unfollowFriend(id)}>
      Unfollow
    </Button>
  );

  const renderFollowButton = (id: string) => (
    <Button status="primary" size="tiny" onPress={async () => await followFriend(id)}>
      Follow
    </Button>
  );

  const renderUserActionButton = (id: string) => {
    const isAlreadyFollowed = friendships.filter((friendship) => friendship.friend.id === id);

    return (
      isAlreadyFollowed.length > 0 ? (
        renderUnfollowButton(isAlreadyFollowed[0].id)
      ) : (
        renderFollowButton(id)
      )
    );
  };

  const renderProfilePicture = (props: any) => (
    <Icon {...props} name="person" />
  );

  const renderSearchIcon = (props: any) => (
    <Icon {...props} name="search" />
  );

  const renderFriends = ({ item }: {item: Friendship}) => (
    <ListItem
      title={item.friend.username}
      accessoryLeft={renderProfilePicture}
      accessoryRight={() => renderUnfollowButton(item.id)}
    />
  );

  const renderUsers = ({ item }: any) => (
    <ListItem
      title={item.username}
      accessoryLeft={renderProfilePicture}
      accessoryRight={() => renderUserActionButton(item.id)}
    />
  );

  const Header = (props: any) => (
    <View {...props}>
      <Text category="h6">My Friends</Text>
      <Button
        appearance="outline"
        style={styles.searchButton}
        size="small"
        accessoryLeft={renderSearchIcon}
        onPress={() => setAddNewFriendCardVisible(true)}
      />
    </View>
  );

  return (
    <>
      <Modal
        nativeID="users-list"
        style={styles.usersModal}
        visible={addNewFriendCardVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setAddNewFriendCardVisible(false);
        }}
      >
        <Card
          disabled
          style={styles.card}
          header={AllUsersCardHeader}
          footer={AllUsersCardFooter}
        >
          <List
            style={styles.usersContainer}
            data={users}
            ItemSeparatorComponent={Divider}
            renderItem={renderUsers}
          />
        </Card>
      </Modal>
      <Card header={Header} style={styles.card} disabled>
        {
          isLoading ? (
            <LoadingSpinner />
          ) : (
            <List
              style={styles.container}
              data={friendships}
              ItemSeparatorComponent={Divider}
              renderItem={renderFriends}
            />
          )
        }
      </Card>
    </>
  );
};
