import MenuIcon from '@mui/icons-material/Menu';
import React, { useState , useEffect} from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import SettingsIcon from '@mui/icons-material/Settings';
import './css/navbar.css';
import Logo from '../assets/LOGO_NEW_NEW.png'
import PersonIcon from '@mui/icons-material/Person';
import api from "../api";
import PollIcon from '@mui/icons-material/Poll';
import { NavLink, Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import MoiveRecomendation from './getMovieRecomandation'



function Navbar() {
  const [clicked, setClicked] = useState(false);
  const [email, setEmail] = useState('');
  const [activeComponent, setActiveComponent] = useState('dashboard');

  
  const regex = /^[^@]*/; 

  useEffect(() => {
    getName();
  }, []);
  const handleHidden = () => {
    setClicked(!clicked)
  };

  const handleNavigate = (address) => {
    
  };

  const getName = async (e) =>{
    try{
      const res = await api.get('getUserByID/'+localStorage.getItem("ID")+"/");
      const extracted = res.data.username.match(/^[^@]*/)[0]; 
      setEmail(extracted);

    }catch(error){
      console.log(error)
    }
   
  }
  const renderComponent = () => {
    switch(activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'movies':
        // return <Movies />;
      case 'Recomend Movies':
        return <MoiveRecomendation/>
      case 'settings':
        // return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  

  return (
    <div>
      <div className='navBarMainContianer'>
      {clicked ? (
        <div className='navBarHidden'>
          <div className='menuIconDivHidden'>
            <MenuIcon className='menuIconHamburgerButtonClicked' onClick={handleHidden} />
          </div>
          <ul className='navlinks'>
            <li>
              <a>
                <HomeIcon className='iconsForNavBar' />
              </a>
            </li>
            <li>
              <a>
                <MovieCreationIcon className='iconsForNavBar' />
              </a>
            </li>
            <li>
              <a>
                <ChatIcon className='iconsForNavBar' />
              </a>
            </li>
            <li>
              <a>
                <SettingsIcon className='iconsForNavBar' />
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <div className='navBarShown'>
          <div className='menuIconDiv'>
            <img src={Logo}></img>
            {/* <MenuIcon className='menuIconHamburgerButton' onClick={handleHidden} /> */}
          </div>
          <ul className='navlinks'>
            <li>
              <a onClick={() => setActiveComponent('dashboard')}>
                <HomeIcon className='iconsForNavBar' />
                <p>Dashboard</p>
              </a>
            </li>
            <li>
              <a>
                <MovieCreationIcon className='iconsForNavBar' />
                <p>Movies</p>
              </a>
            </li>
            <li>
              <a onClick={() => setActiveComponent('Recomend Movies')}>
                <PollIcon className='iconsForNavBar' />
                <p>Recomend Movies</p>
              </a>
            </li>
            <li>
              <a>
                <SettingsIcon className='iconsForNavBar' />
                <p>Settings</p>
              </a>
            </li>
          </ul>
          <div className='profileView'>
            <a>
                <PersonIcon/>
                <p>{email}</p>
            </a>
          </div>
        </div>
      )}
      </div>
      <div className="contentContainer">
             {renderComponent()}
      </div>
    </div>
  );
}

export default Navbar;
