import React, { useEffect, useState } from 'react';
import {
  Document, Image, Page, PDFDownloadLink, Text, View, StyleSheet,
} from '@react-pdf/renderer';
import MyPicture from '../../assets/statistics.png';
import { User } from '../../types';
import { Client } from '../../api';

const HORIZONTAL_LINE = '_'.repeat(57);

const client: Client = Client.getInstance();

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
  },
  image: {
    marginTop: 220,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  content: {
    marginTop: 5,
    marginBottom: 15,
  },
  appellation: {
    position: 'absolute',
    left: 0,
  },
  name: {
    position: 'absolute',
    right: 0,
  },
});

export const StatisticsPdf = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const setUserName = async () => {
      const user = await client.sendRequest<User>('currentUser');
      setName(user.data.fullName);
    };

    setUserName();
  });

  return (
    <Document>
      <Page style={styles.body}>
        <View>
          <Text style={styles.title}>
            Summary for hour
          </Text>
          <Image style={styles.image} src={MyPicture} />
        </View>
        <View break>
          <Text style={styles.title} break>
            Summary for day
          </Text>
          <Image style={styles.image} src={MyPicture} />
        </View>
        <View>
          <Text style={styles.title} break>
            Summary for month
          </Text>
          <Image style={styles.image} src={MyPicture} />
        </View>
        <View style={styles.footer} fixed>
          <Text>
            {HORIZONTAL_LINE}
          </Text>
          <View style={styles.content}>
            <Text style={styles.appellation}>
              SportTracking
            </Text>
            <Text style={styles.name}>
              {name}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const ExportPdf = () => (
  <div style={{ textAlign: 'center' }}>
    Click&nbsp;
    <PDFDownloadLink document={<StatisticsPdf />} fileName="statistics.pdf">
      {({ loading }) => (loading ? 'here' : 'here')}
    </PDFDownloadLink>
    &nbsp;to download pdf.
  </div>
);
