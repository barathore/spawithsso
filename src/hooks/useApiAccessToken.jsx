import { useCallback } from 'react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal, useMsalAuthentication } from "@azure/msal-react";

const useApiAccessToken = (msalRequest) => {
    const { instance } = useMsal();
    const { result, error: msalError } = useMsalAuthentication(InteractionType.Popup, {
        ...msalRequest,
        account: instance.getActiveAccount(),
        redirectUri: '/redirect'
    });

    const execute = async () => {
        let accessToken = '';
        if (result) {
          accessToken = result.accessToken;
        }
        return accessToken;
    };
    return { execute: useCallback(execute, [result, msalError]) };
};
export default useApiAccessToken;