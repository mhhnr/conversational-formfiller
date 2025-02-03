import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import { useAuth0 } from '@auth0/auth0-react';

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();

  return (
    <header className="main-header">
      <nav>
        <ul>
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Form Filler
            </Link>
          </li>
          <li>
            <Link 
              to="/women-casual-jeans"
              className={location.pathname === '/women-casual-jeans' ? 'active' : ''}
            >
              Women Casual Jeans
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <Link 
                  to="/profile"
                  className={location.pathname === '/profile' ? 'active' : ''}
                >
                  Profile
                </Link>
              </li>

              <li>
                <button 
                  className="auth-button"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <li>
              <button 
                className="auth-button"
                onClick={() => loginWithPopup()}
              >
                Sign In
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};