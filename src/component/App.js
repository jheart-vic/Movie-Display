import React, { useReducer, useEffect, useState, createContext } from "react";
import ReactSwitch from "react-switch";
import "./App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";
import BorderExample from "./Spinner";


const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b";


const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};


const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};







const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const ThemeContext = createContext(null);
 const [theme, setTheme] = useState("light");
 const toggleTheme = () => {
  setTheme((mode) => ( mode === "light" ? "dark" : "light"));
};
    useEffect(() => {
    
        fetch(MOVIE_API_URL)
            .then(response => response.json())
            .then(jsonResponse => {
        
            dispatch({
                type: "SEARCH_MOVIES_SUCCESS",
                payload: jsonResponse.Search
        	});
      	});
  	}, []);

    const search = searchValue => {
    	dispatch({
      	type: "SEARCH_MOVIES_REQUEST"
    	});
	
        fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
      	.then(response => response.json())
      	.then(jsonResponse => {
        	if (jsonResponse.Response === "True") {
          	dispatch({
                type: "SEARCH_MOVIES_SUCCESS",
                payload: jsonResponse.Search
          	});
        	} else {
          	dispatch({
                type: "SEARCH_MOVIES_FAILURE",
                error: jsonResponse.Error
          	});
          }
      	});
	  };

    const { movies, errorMessage, loading } = state;

    return (
      <ThemeContext.Provider value={{theme, toggleTheme}}>
    <div className="App" id={theme} >
      <Header text="Movies Arena" />
      <div className="d-flex justify-content-end mt-2 gap-5">
        <small className="switchLabel" >{theme === "light" ? "Dark Mode" : "Light Mode"}</small>
        <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
      </div>
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favourite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <BorderExample />
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
    </ThemeContext.Provider>
  );
};
export default App;