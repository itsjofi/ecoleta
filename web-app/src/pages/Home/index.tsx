import React from 'react';

//UI
import './styles.css';
import { FiLogIn } from 'react-icons/fi'

//ASSETS
import logo from '../../static/assets/logo.svg';

//STATIC
import { textLabels } from '../../static/textLabels';

//ROUTER
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const { home } = textLabels;

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>
        <main>
          <h1>{home.title}</h1>
          <p>{home.subtitle}</p>
          <Link to="/create-point" >
            <span>
              <FiLogIn />
            </span>
            <strong>
              {home.btn}
            </strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
