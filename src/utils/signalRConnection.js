import { JsonHubProtocol, HubConnectionBuilder, LogLevel  } from '@microsoft/signalr';

const startSignalRConnection = async connection => { try { await connection.start(); } catch (err) { console.error('SignalR Connection Error: ', err); } };
export const setupSignalRConnection = (connectionHub, actionEventMap = {}, getAccessToken) => (dispatch, getState) => {
    const options = {
     logMessageContent: 'Production',
     logger: LogLevel.Error,
     accessTokenFactory: () => getAccessToken(getState())
    };
    
    const connection = new HubConnectionBuilder()
      .withUrl(connectionHub, options)
      .withAutomaticReconnect()
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .build();

    connection.serverTimeoutInMilliseconds = 60000;
    connection.onclose(error => { });
    connection.onreconnecting(error => { });
    connection.onreconnected(connectionId => { });

    startSignalRConnection(connection);

    connection.on('OnEvent', res => {
      const eventHandler = actionEventMap[res.eventType];
      eventHandler && dispatch(eventHandler(res));
    });

    return connection;
  };