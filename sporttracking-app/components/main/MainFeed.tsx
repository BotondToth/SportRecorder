import React, { useState } from 'react';
import {
  Divider, List, ListItem, Spinner, Text,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Workout } from '../../types';

const styles = StyleSheet.create({
  postsHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  mainFeedTitle: {
    padding: 15,
    backgroundColor: 'white',
  },
});

export const MainFeed = () => {
  const [posts, setPosts] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const renderPosts = ({ item }: { item: Workout }) => (
    <ListItem
      title={item.title}
      description={item.description}
      // accessoryLeft={renderIcon}
      // onPress={() => onWorkOutPress(item)}
    />
  );

  return (
    <>
      <View style={styles.postsHeader}>
        <Text category="h5" style={styles.mainFeedTitle}>
          Main Feed
        </Text>
      </View>
      {isLoading
        ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <Spinner size="giant" />
          </View>
        )
        : (
          <List
            data={posts}
            ItemSeparatorComponent={Divider}
            renderItem={renderPosts}
          />
        )}
    </>
  );
};
