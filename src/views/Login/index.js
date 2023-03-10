import { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { useHistory, useLocation } from "react-router-dom";

import { isAuthenticated as isAuthenticatedAtom, spotifyRefreshToken as spotifyRefreshTokenAtom, spotifyTokenResponse as spotifyTokenResponseAtom } from "../../recoil/auth/atoms";
import { spotifyAuthCall } from "../../utils";
import homeImage from "../../assets/images/music.jpg";
import "./style.css";
import { Player } from '@lottiefiles/react-lottie-player';

const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_SPOTIFY_CALLBACK_HOST}&scope=user-read-private`;

export default function Login() {
  const location = useLocation();
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedAtom);
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useRecoilState(spotifyRefreshTokenAtom);
  const [spotifyTokenResponse, setSpotifyTokenResponse] = useRecoilState(spotifyTokenResponseAtom);

  const authenticateUser = useCallback(async (code) => {
    try {
      let response;
    
      if (spotifyRefreshToken)
        response = await spotifyAuthCall({ refresh_token: spotifyRefreshToken, grant_type: "refresh_token" });
      else
        response = await spotifyAuthCall({ code, grant_type: "authorization_code" });
      
      if (response.access_token) {
        setSpotifyRefreshToken(response?.refresh_token);
        setSpotifyTokenResponse(response);
        setIsAuthenticated(true);
        
        window.location.replace("/home");
        //history.replace("/home");
      } else {
        throw new Error("Usuario no fue logeado");
      }
    } catch (error) {
      setIsAuthenticated(true);
    }
  }, [setSpotifyRefreshToken, setSpotifyTokenResponse, setIsAuthenticated, spotifyRefreshToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const spotifyCode = urlParams.get("code");
    
    if (spotifyCode || isAuthenticated) authenticateUser(spotifyCode);
  }, [location.search]);

  const handleLoginClick = () => {
    window.location.replace(spotifyUrl);
  };

  return (
    <div className="home-container">
      <div className="home-left-child">
        <div className="home-animation">
        <Player
          src='https://assets7.lottiefiles.com/packages/lf20_euaveaxu.json'
          className="player"
          loop
          autoplay
        />
      </div>
        <h3>Bienvenido de nuevo</h3>
        <h6>identif??cate para encontrar tu m??sica favorita</h6>
        <button onClick={handleLoginClick}>Iniciar sesi??n</button>
      </div>
      <div className="home-right-child" style={{ backgroundImage: `url(${homeImage})` }} />
    </div>
  );
}