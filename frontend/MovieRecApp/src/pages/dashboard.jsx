import AccountBoxIcon from '@mui/icons-material/AccountBox';
import "./css/dashboard.css";
import MovieTemplate from "./movieTemplate";
import api from "../api";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { API_KEY } from '../constants';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';



function Dashboard() {
    const [movies, setMovies] = useState([]);
    const [moviesImg, setMoviesImg] = useState([])
    const [MovieDate, setMovieDate] = useState([])
    const [MovieDescription, setMovieDescription] = useState([])
    const [MovieGenre, setMovieGenre] = useState([])
    const [popupOpen, setPopupOpen] = useState(false);
    const [movieIDArrayForTemplate, setMovieIDArrayForTemplate] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const popupRef = useRef(null);
    const searchBarRef = useRef(null);


    useEffect(() => {
        handleUsersMovies();
        document.addEventListener("keydown", handleEscKey);
        document.addEventListener("mousedown", handleClickOutside);
    }, []);
   
    const handleUsersMovies = async ()=>{
        try{
            const res = await api.get('getUserByID/'+localStorage.getItem("ID")+"/");
            const moviesIDArray = res.data.profile.moviesInColelction.split(", ").map(movie => movie.trim());
            let moviesArray = []
            let movieDate = []
            let movieDescription =[]
            let movieGenre =[]
            for(let i=0 ; i <moviesIDArray.length; i++){
                const movieRes = await api.get('getMovieByID/' + moviesIDArray[i] + "/");
                moviesArray.push(movieRes.data.name); 
                movieDate.push(movieRes.data.date)
                movieDescription.push(movieRes.data.description)
                movieGenre.push(movieRes.data.genere)
            }
            setMovieIDArrayForTemplate(moviesIDArray)
            setMovieDate(movieDate)
            setMovieDescription(movieDescription)
            setMovies(moviesArray)
            setMovieGenre(movieGenre)
            if (moviesArray.length > 0) {
                fetchMoviePoster(moviesArray);
            } else {
                console.log("No movies found for the user.");
            }
        }catch(error){
            console.error("Error fetching user movies:", error);
        }
    }
    
    const fetchMoviePoster = async (moviesArray) => {
        
        const urls = [];

        try {
            for (let i = 0; i < moviesArray.length; i++) {
                const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(moviesArray[i])}`;
                const searchResponse = await axios.get(searchUrl);
                const movieId = searchResponse.data.results[0]?.id;

                if (movieId) {
                    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
                    const detailsResponse = await axios.get(detailsUrl);
                    const posterPath = detailsResponse.data.poster_path;
                    const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
                    urls.push(imageUrl);
                } else {
                    console.log(`Movie '${moviesArray[i]}' not found.`);
                    urls.push(null);        
                }
            }
            setMoviesImg(urls);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    


    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            try {
                const res3 = await api.get("movies/?search=" + query);
                console.log("Search results:", res3.data); 
                setSearchResults(res3.data); 
            } catch (error) {
                console.error("Error searching movies:", error);
            }
        } else {
            setSearchResults([]); 
        }
    };
    
    const handleMovieSelection = async (movie) => {
        console.log("Selected movie:", movie);
        console.log("hi")
        try{
            const res4 = await api.put("UpdateMovieCollection/", {
                moviesInColelction: movie.id.toString()
            });
            window.location.reload();
        }catch(error){
            console.log(error)
        }

    };


    const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            closePopup()
        }
    };
    
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target) && searchBarRef.current && !searchBarRef.current.contains(event.target)) {
            closePopup();
        }
    };



    return (
        <div className="dashboard">
            <div className="topShelf">
                <h1 className="title">Movie Library</h1>
                <AccountBoxIcon className="profileIcon"/>
            </div>
            <div className="movieList">
                {movies.map((movie, index) => (
                    <MovieTemplate
                        key={index} 
                        name={movie} 
                        movieImage = {moviesImg[index]}
                        Date_Relesaed = {MovieDate[index]}
                        description = {MovieDescription[index]}
                        genre = {MovieGenre[index]}
                        id = {movieIDArrayForTemplate[index]}
                        
                    />
                ))}
                <div className="movieTemplateContainerAddNewMovie" onClick={openPopup}>
                    <div className="reactiveDivAddNewMovie">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/500px-Plus_symbol.svg.png" className="movieImageClassForAddNewMovie" alt="Add New Movie" />
                        <h3 className="AddNewMovieMovieName">Add New Movie</h3>
                    </div>
                </div>
            </div>
            <div className='addNewMovieContainer' onClick={openPopup}>
                <AddCircleIcon/>
            </div>
            {popupOpen && (
                <div className='popupContainer'>
                    <div className="popup" ref={popupRef}>
                        <div className="contentForAddingMovie">
                            <div className='searchBarAndSearchIcon'>
                                <input
                                    type="text"
                                    className="searchBar" 
                                    placeholder="Search movies..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    ref={searchBarRef}
                                />
                                <SearchIcon className='searchIconForAddingMovie'/>
                            </div>
                            {searchResults.slice(0,20).map((movie, index) => (
                                <div key={index} className="searchResult" onClick={() => handleMovieSelection(movie)}>
                                    <div>
                                        <h3>{movie.name}</h3>
                                        <span><p className='boldText'>Description:</p>{movie.description}</span>
                                        <span><p className='boldText'>Release Date:</p>{movie.date}</span>
                                        <span><p className='boldText'>Genere: </p>{movie.genere}</span>
                                    </div>
                                    <div>
                                       {/*  */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <button onClick={closePopup}>Close</button>  */}
                    </div>
                </div>
            )}
        </div>
    );
}


export default Dashboard;
