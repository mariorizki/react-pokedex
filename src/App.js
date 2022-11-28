import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');

  const getPokemon = async () => {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

    const res = await fetch(`${baseUrl}?offset=${offset}&limit=20`);

    const data = await res.json();

    // console.log(data.results);

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });

    const results = await Promise.all(promises);

    setPokemon([...pokemon, ...results]);
  };

  const searchPokemon = async (pokemon) => {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await fetch(url);
    return await response.json();
  };

  const onSearchHandler = async (pokemon) => {
    if (!pokemon) {
      return getPokemon();
    }

    const result = await searchPokemon(pokemon);

    setPokemon([result]);
  };

  const onChangeHandler = (e) => {
    setSearch(e.target.value.toLowerCase());
  };
  console.log(search);

  useEffect(() => {
    getPokemon();
  }, [offset]);

  const onClickMore = () => {
    setOffset(offset + 50);
  };

  return (
    <div className="App">
      <input type="text" onChange={onChangeHandler} />
      <button onClick={() => onSearchHandler(search)}>Search</button>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: 50,
        }}
      >
        {pokemon.map((poke) => (
          <div key={poke.id} style={{ width: 200 }}>
            <img src={poke.sprites.front_default} />
            <p style={{ textTransform: 'capitalize' }}>{poke.name}</p>
          </div>
        ))}
      </div>
      <button onClick={onClickMore}>Load more</button>
    </div>
  );
}

export default App;
