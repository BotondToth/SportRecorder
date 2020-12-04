import axios, { CancelToken } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { User } from 'types';

export class Client {
  private static BASE_URL: string = 'http://localhost:8080';
  private static user: User = undefined;
  private static instance: Client;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor () {}

  public static getInstance (): Client {
    if (!Client.instance) {
      Client.instance = new Client();
    }
    return Client.instance;
  }

  public getCurrentUser = async () => {
    if (!Client.user) {
      const user = await Client.instance.sendRequest<User>('currentUser');
      Client.user = user.data;
    }
    return Client.user;
  };

  public deleteCurrentUser = () => {
    Client.user = undefined;
  };

  public sendRequest = async <T = any>(
    target: string,
    body: any = null,
    isItDeleteRequest: boolean = false,
    cancel?: CancelToken,
    // eslint-disable-next-line consistent-return
  ) => {
    const url = `${Client.BASE_URL}/${target}`;
    const token = await AsyncStorage.getItem('access-token');
    const config = {
      headers: { Authorization: token },
      cancelToken: cancel,
    };

    if (isItDeleteRequest) {
      try {
        return await axios.delete<T>(url, config);
      } catch (error) {
        if (error.response.status === 403) {
          await AsyncStorage.clear();
          window.location.reload();
        }
      }
    }
    if (body) {
      try {
        return await axios.post<T>(url, body, config);
      } catch (error) {
        if (error.response.status === 403) {
          await AsyncStorage.clear();
          window.location.reload();
        }
      }
    }
    try {
      return await axios.get<T>(url, config);
    } catch (error) {
      if (error.response.status === 403) {
        await AsyncStorage.clear();
        window.location.reload();
      }
    }
  };
}
