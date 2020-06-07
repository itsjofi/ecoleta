import React from 'react';

//UI
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi';
import { SuccessOverlay, Dropzone, Map } from '../../components';

//ASSETS
import logo from '../../static/assets/logo.svg';

//ROUTER
import { Link, useHistory } from 'react-router-dom';

//STATIC
import { textLabels } from '../../static/textLabels';

//API
import api from '../../services/api';
import axios from 'axios';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface UF {
  name: string;
  initials: string;
}

interface IBGEUFData {
  nome: string;
  sigla: string;
}

interface IBGECitieData {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const { createPoint } = textLabels;
  const [items, setItems] = React.useState<Item[]>([]);
  const [states, setStates] = React.useState<UF[]>([]);
  const [selectedState, setSelectedState] = React.useState({
    name: '',
    initials: '',
  });
  const [cities, setCities] = React.useState<string[]>([]);
  const [selectedCity, setSelectedCity] = React.useState('');
  const [formValues, setFormValues] = React.useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [markerPosition, setMarkerPosition] = React.useState<[number, number]>([
    0,
    0,
  ]);
  const [snackbar, toggleSnackbar] = React.useState({
    activated: false,
    message: '',
  });
  const [selectedFile, setSelectedFile] = React.useState<File>();

  const history = useHistory();

  React.useEffect(() => {
    api
      .get('/items')
      .then((res) => {
        if (res.data) {
          setItems(res.data);
        }
      })
      .catch((err) => err);
  }, []);

  React.useEffect(() => {
    axios
      .get<IBGEUFData[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((res) => {
        const ufNameAndInitials = res.data.map((state) => ({
          name: state.nome,
          initials: state.sigla,
        }));

        setStates(ufNameAndInitials);
      })
      .catch((err) => err);
  }, []);

  React.useEffect(() => {
    if (selectedState.initials.length > 0) {
      axios
        .get<IBGECitieData[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState.initials}/municipios`
        )
        .then((res) => {
          const cityName = res.data.map((citie) => citie.nome);

          setCities(cityName);
        })
        .catch((err) => err);
    }
  }, [selectedState]);

  function handleStateChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (event.target.value) {
      let value = event.target.value;
      let getOnlyInitials = value.substr(value.length - 2);
      setSelectedState({
        name: value,
        initials: getOnlyInitials,
      });
    }
  }

  function handleCityChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems((prevState) => [...prevState, id]);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formValues;
    const uf = selectedState.initials;
    const city = selectedCity;
    const [latitude, longitude] = markerPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api
      .post('points', data)
      .then((res) => {
        toggleSnackbar({
          activated: true,
          message: 'Cadastro concluído!',
        });
        setTimeout(() => {
          toggleSnackbar({
            activated: false,
            message: '',
          });
          history.push('/');
        }, 2000);
      })
      .catch((err) => err);
  }

  return (
    <div id="page-create-point">
      {snackbar.activated && <SuccessOverlay message={snackbar.message} />}
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          {createPoint.goBack}
        </Link>
      </header>
      <form onSubmit={onSubmit}>
        <h1 style={{ maxWidth: '350px' }}>{createPoint.title}</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>{createPoint.data}</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">{createPoint.inputs.name}</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">{createPoint.inputs.email}</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">{createPoint.inputs.whats}</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>{createPoint.address}</h2>
            <span>{createPoint.selectAddress}</span>
          </legend>

          <Map
            setMarkerPosition={setMarkerPosition}
            markerPosition={markerPosition}
          />

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">{createPoint.uf}</label>
              <select
                name="uf"
                id="uf"
                onChange={handleStateChange}
                value={selectedState.name}
              >
                <option value="0">{createPoint.ufPlaceHolder}</option>
                {states.map((state, index) => (
                  <option
                    value={`${state.name} - ${state.initials}`}
                    key={index}
                  >{`${state.name} - ${state.initials}`}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">{createPoint.city}</label>
              <select
                name="city"
                id="city"
                onChange={handleCityChange}
                value={selectedCity}
              >
                <option value="0">{createPoint.cityPlaceHolder}</option>
                {cities.map((citie, index) => (
                  <option value={citie} key={index}>
                    {citie}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>{createPoint.items}</h2>
            <span>{createPoint.selectItems}</span>
          </legend>

          <ul className="items-grid">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">{createPoint.btn}</button>
      </form>
    </div>
  );
};

export default CreatePoint;
