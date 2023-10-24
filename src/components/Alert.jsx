import React, { useState, useEffect } from 'react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { HubConnectionBuilder, HubConnectionState, HttpTransportType } from '@microsoft/signalr';

import { loginRequest } from "../authConfig";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export const Alert = (props) => {
  const [connection, setConnection] = useState();
  const [owner, setOwner] = useState('Owner');
  const [description, setDescription] = useState('Description');
  const [contentState, setContentState] = useState('Notification');

  const { instance } = useMsal();
  const { result} = useMsalAuthentication(InteractionType.Popup, {...loginRequest, account: instance.getActiveAccount() });

  useEffect(() => { 
      const conn = new HubConnectionBuilder()
      .withUrl(
        'https://localhost:44351/hub', {
            accessTokenFactory: () => { 
              let atoken = result.accessToken; 
              return atoken; 
            },
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

      conn.start().then(() => { }).catch((e) => console.log(e));
      conn.on('messageReceived', (message) => { 
          var response = JSON.parse(message);
          setOwner(response.Owner);
          setDescription(response.Description);
      });
      setConnection(conn);
  }, [result]);

  const sendMessageToHub = (message) => {
    if (connection.state === HubConnectionState.Connected) {
        connection.invoke('SendClaimAssignmentToAssignee', 'Basit',message)
                     .then(() => { })
                     .catch((err) => { return console.error(err.toString());});
    }
  };

  const notificationView = (
    <ListGroupItem>
          <label> Description: {description} -  Owner: {owner} </label>
            <ButtonGroup className="todo-view-btn">
                <Button variant="warning" >
                    Accept!
                </Button>
                <Button variant="danger" >
                    UnAvailable!
                </Button>
            </ButtonGroup>
          </ListGroupItem>
  );

  const claimDetailView = (
    <ListGroupItem>
          <label> Description: {description} -  Owner: {owner} </label>
            <ButtonGroup className="todo-view-btn">
                <Button variant="warning" >
                    Accept!
                </Button>
                <Button variant="danger" >
                    UnAvailable!
                </Button>
            </ButtonGroup>
      </ListGroupItem>
  );
  const UnAvailableView = (
    <ListGroupItem>
          <label> Description: {description} -  Owner: {owner} </label>
            <ButtonGroup className="todo-view-btn">
                <Button variant="warning" >
                    Accept!
                </Button>
                <Button variant="danger" >
                    UnAvailable!
                </Button>
            </ButtonGroup>
          </ListGroupItem>
  );

  return (
    <>
      <div className='data-area-div'>
        <ListGroup>
          { (contentState == 'Notification')? notificationView : (contentState == 'Details')? claimDetailView : UnAvailableView }
        </ListGroup>
      </div>
    </>
  );
};