import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

const TYPE_COLOR = {
  normal: "#A8A878",
  water: "#6890F0",
  ice: "#86D1F3",
  grass: "#78c850",
  fire: "#F08030",
  dragon: "#7038F8",
  electric: "#F8D030",
  bug: "#A8B820",
  fairy: "#EE99AC",
  ground: "#E0C068",
  rock: "#B8A038",
  steel: "#42BD94",
  poison: "#A040A0",
  ghost: "#705898",
  dark: "#5A5979",
  flying: "#4A677D",
  fighting: "#994025",
  psychic: "#F85888",
};

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [showLoadMore, setSholLoadMore] = useState(true);

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

  const searchPokemon = async (pokemon) => {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await fetch(url);
    return await response.json();
  };

  const onSearchHandler = async (pokemon) => {
    if (!pokemon) {
      return;
    }

    const result = await searchPokemon(pokemon);
    setSholLoadMore(false);

    setPokemon([result]);
  };

  const onChangeHandler = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  useEffect(() => {
    getPokemon();
  }, [offset]);

  const onClickMore = () => {
    setOffset(offset + 20);
  };

  console.log(pokemon);

  return (
    <div className="App">
      <h1>Pokedex</h1>
      <input
        type="text"
        onChange={onChangeHandler}
        placeholder="Search pokemon..."
      />
      <button onClick={() => onSearchHandler(search)} style={{ marginLeft: 4 }}>
        Search
      </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: 30,
        }}
      >
        {pokemon.map((poke) => (
          <div
            key={poke.id}
            style={{
              width: 160,
              margin: 5,
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              padding: 15,
              alignItems: "center",
              flexDirection: "column",
              background: `${TYPE_COLOR[poke.types[0].type.name]}38`,
            }}
            className="card"
          >
            <img
              src={poke.sprites.other.dream_world.front_default}
              loading="lazy"
              style={{
                width: "50%",
                height: "50%",
              }}
            />
            <p style={{ textTransform: "capitalize", fontWeight: "bold" }}>
              #{poke.id} {poke.name}
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              {poke.types.map((type) => (
                <div
                  key={type.type.name}
                  style={{
                    background: TYPE_COLOR[type.type.name],
                    padding: 4,
                    borderRadius: 6,
                    color: "white",
                    textTransform: "capitalize",
                    fontSize: 12,
                  }}
                >
                  {type.type.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showLoadMore ? <button onClick={onClickMore}>Load more</button> : null}
    </div>
  );
}

export default App;
