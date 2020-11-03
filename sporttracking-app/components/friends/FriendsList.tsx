import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Icon,
  List,
  ListItem, Modal, Spinner,
  Text,
} from "@ui-kitten/components";
import { StyleSheet, View } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { Friend, User } from "../../types";

export const FriendsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [addNewFriendCardVisible, setAddNewFriendCardVisible] = useState<boolean>(false);

  const getFriends = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('access-token');
    let config = {
      headers: {
        Authorization: token
      }
    };

    await axios
      .get('http://localhost:8080/friends', config)
      .then((res) => {
        setIsLoading(false);
        setFriends(res.data);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const getUsers = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('access-token');
    let config = {
      headers: {
        Authorization: token
      }
    };

    await axios
      .get('http://localhost:8080/users', config)
      .then((res) => {
        setIsLoading(false);
        setUsers(res.data);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    // TODO: it runs every time when bottom tab changes
    getFriends();
    getUsers();
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
    const token = await AsyncStorage.getItem('access-token');
    let config = {
      headers: {
        Authorization: token
      }
    };

    await axios
      .delete(`http://localhost:8080/friends?friendshipId=${id}`, config)
      .then(async () => {
        setAddNewFriendCardVisible(false);
        await getFriends();
      });
  };

  const followFriend = async (id: string) => {
    const friendDto = { friendId: id };
    const token = await AsyncStorage.getItem('access-token');
    let config = {
      headers: {
        Authorization: token
      }
    };

    await axios
      .post('http://localhost:8080/friends', friendDto, config)
      .then(() => {
        setAddNewFriendCardVisible(false);
        getFriends();
      })
  };

  const renderUnfollowButton = (id: string) => (
    <Button status="danger" size="tiny" onPress={async () => await unfollowFriend(id)}>
      Unfollow
    </Button>
  );

  const renderUserActionButton = (id: string) => {
    const isAlreadyFollowed = friends.filter(friend => friend.friendId === id);

    return (
      isAlreadyFollowed.length > 0 ? (
        <Button status="danger" size="tiny" onPress={() => unfollowFriend(isAlreadyFollowed[0].id)}>
          Unfollow
        </Button>
      ) : (
        <Button status="primary" size="tiny" onPress={() => followFriend(id)}>
          Follow
        </Button>
      )
    )
  };

  const renderProfilePicture = (props: any) => (
    <Icon {...props} name="person" />
  );

  const renderSearchIcon = (props: any) => (
    <Icon {...props} name="search" />
  );

  const renderListItem = ({ item }: any) => (
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
      <Button appearance='ghost' style={styles.searchButton} size="small" accessoryLeft={renderSearchIcon} onPress={() => setAddNewFriendCardVisible(true)}/>
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
          disabled={true}
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
      <Card header={Header} style={styles.card} disabled={true}>
        {
          isLoading ? <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Spinner size='giant' />
            </View> :
            <List
              style={styles.container}
              data={friends}
              ItemSeparatorComponent={Divider}
              renderItem={renderListItem}
            />
        }
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  usersModal: {
    width: '75%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchButton: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: 'blue',
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
  footerControl: {
    marginHorizontal: 2,
  },
});
