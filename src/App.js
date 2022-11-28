import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);

  const getPokemon = async () => {
    const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

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

  useEffect(() => {
    getPokemon();
  }, [offset]);

  const onClickMore = () => {
    setOffset(offset + 50);
  };

  console.log(pokemon);
  return (
    <div className="App">
      {pokemon.map((poke) => (
        <div key={poke.id}>
          <img src={poke.sprites.front_default} />
          <p>{poke.name}</p>
        </div>
      ))}
      <button onClick={onClickMore}>Load more</button>
    </div>
  );
}

export default App;
