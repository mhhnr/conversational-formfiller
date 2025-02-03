import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const domain = "digitalkiosk.cic-demo-platform.auth0app.com";
  const clientId = "lxlkrXbSmpTha6GJvD9SfxHuoFdkhrpN";

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || '/baby-boot-jean');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        display: 'popup'
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}; 