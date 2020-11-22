import axios, { CancelToken } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export class Client {
  private static BASE_URL: string = 'http://localhost:8080';
  private static instance: Client;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor () {
  }

  public static getInstance (): Client {
    if (!Client.instance) {
      Client.instance = new Client();
    }
    return Client.instance;
  }

  public sendRequest = async <T = any>(
    target: string,
    body: any = null,
    isItDeleteRequest: boolean = false,
    cancel?: CancelToken,
  ) => {
    const url = `${Client.BASE_URL}/${target}`;
    const token = await AsyncStorage.getItem('access-token');
    const config = {
      headers: { Authorization: token },
      cancelToken: cancel,
    };

    if (isItDeleteRequest) {
      return await axios.delete<T>(url, config);
    }
    if (body) {
      return await axios.post<T>(url, body, config);
    }
    return await axios.get<T>(url, config);
  };
}
