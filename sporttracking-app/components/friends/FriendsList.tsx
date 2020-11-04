import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Icon,
  List,
  ListItem, Modal, Spinner,
  Text,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Friend, User } from '../../types';
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
    maxHeight: 400,
    width: 400,
  },
  usersContainer: {
    maxHeight: 300,
    width: '100%',
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const FriendsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [addNewFriendCardVisible, setAddNewFriendCardVisible] = useState<boolean>(false);
  const client: Client = Client.getInstance();

  const getFriends = async () => {
    setIsLoading(true);
    const response = await client.sendRequest('friends');
    setIsLoading(false);
    setFriends(response.data);
  };

  const getUsers = async () => {
    setIsLoading(true);
    const response = await client.sendRequest('users');
    setIsLoading(false);
    setUsers(response.data);
  };

  useEffect(() => {
    getFriends();
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
    await getFriends();
    setAddNewFriendCardVisible(false);
  };

  const followFriend = async (id: string) => {
    await client.sendRequest('friends', { friendId: id });
    await getFriends();
    setAddNewFriendCardVisible(false);
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
    const isAlreadyFollowed = friends.filter((friend) => friend.friendId === id);

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

  const renderFriends = ({ item }: any) => (
    <ListItem
      title={item.friend.fullName}
      accessoryLeft={renderProfilePicture}
      accessoryRight={() => renderUnfollowButton(item.id)}
    />
  );

  const renderUsers = ({ item }: any) => (
    <ListItem
      title={item.fullName}
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
            <View style={styles.loading}>
              <Spinner size="giant" />
            </View>
          ) : (
            <List
              style={styles.container}
              data={friends}
              ItemSeparatorComponent={Divider}
              renderItem={renderFriends}
            />
          )
}
      </Card>
    </>
  );
};
