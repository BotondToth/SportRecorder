import React from 'react';
import { Card, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';

const RegisterLinkFooter = ({ navigation }: Props) => {
    return (
        <View style={styles.registerLink}>
            <Text>You don't have an account yet? Click</Text>
            <Text
                status="primary"
                onPress={() => navigation.navigate('Register')}
            >
                here
            </Text>
        </View>
    );
};

export const LoginForm = ({ navigation }: Props) => {
    const Header = (props: any) => (
        <View {...props}>
            <Text category="h6">SportTracking</Text>
        </View>
    );

    const Footer = (props: any) => (
        <View {...props} style={[props.style, styles.footerContainer]}></View>
    );

    return (
        <>
            <Card
                disabled={true}
                style={styles.card}
                header={Header}
                footer={Footer}
            >
                <Text category="s2">Implement a form here</Text>

                {
                    // TODO: IMPLEMENT ME
                }
            </Card>
            <RegisterLinkFooter navigation={navigation} />
        </>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 0
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    footerControl: {
        marginHorizontal: 2
    },
    registerLink: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
        backgroundColor: 'white'
    }
});
