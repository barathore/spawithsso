import { InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { loginRequest } from "../authConfig";
import { Alert } from '../components/Alert';

export const Notification = () => {
    const authRequest = { ...loginRequest };

    return (
        <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={authRequest}>
            <Alert/>
        </MsalAuthenticationTemplate>
    );
};
