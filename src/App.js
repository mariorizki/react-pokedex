import "./App.css";
import { useEffect, useState } from "react";
import AppRouter from "./AppRouter";

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
    <>
      <AppRouter />
      <div className="App">
        <form onSubmit={onSearchHandler(search)}>
          <input
            type="text"
            onChange={onChangeHandler}
            placeholder="Search pokemon..."
            class="outline-none bg-slate-100 px-3 py-1 rounded-2xl my-4"
          />
        </form>
        <button
          onClick={() => onSearchHandler(search)}
          style={{ marginLeft: 4 }}
        >
          Search
        </button>
        <div class="flex flex-wrap p-3 justify-center gap-3">
          {pokemon.map((poke) => (
            <div
              key={poke.id}
              class="w-40 h-48 flex justify-center items-center flex-col px-2 py-5 rounded-md gap-2 cursor-pointer"
              style={{
                background: `${TYPE_COLOR[poke.types[0].type.name]}38`,
              }}
            >
              <img
                src={poke.sprites.other.dream_world.front_default}
                loading="lazy"
                class="w-[50%] h-[50%]"
              />
              <p class="capitalize font-medium text-slate-600">
                #{poke.id} {poke.name}
              </p>
              <div style={{ display: "flex", gap: 4 }}>
                {poke.types.map((type) => (
                  <div
                    key={type.type.name}
                    class="text-xs px-4 py-1 rounded-sm text-slate-100 capitalize"
                    style={{
                      background: TYPE_COLOR[type.type.name],
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
    </>
  );
}

export default App;
