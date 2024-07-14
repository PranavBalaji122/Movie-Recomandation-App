import api from "../api";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Button } from "@mui/material";
import MovieTemplate from "./movieTemplate";
import { useState, useEffect } from "react";
import { API_KEY } from "../constants";
import axios from "axios";


function getMovieRecomandation () {
    const [MovieDate, setMovieDate] = useState([])
    const [MovieDescription, setMovieDescription] = useState([])
    const [MovieGenre, setMovieGenre] = useState([])
    const [moviesName, setMoviesName] = useState([]);
    const [moviesImg, setMoviesImg] = useState([])
    const [movieIDArrayForTemplate, setMovieIDArrayForTemplate] = useState([])
    const [noMoreRecomondations , setNoMoreRecomondations] = useState(false)
    const getMovies  = async () => {
        try{
            let moviesArrayName = []
            let movieDate = []
            let movieDescription =[]
            let movieGenre =[]
            let movieID = []
            const res = await api.get("GetRecomendation/")
            for(let i =0; i<res.data.length;i++){
                movieID.push(res.data[i].id)
                moviesArrayName.push(res.data[i].name); 
                movieDate.push(res.data[i].date)
                movieDescription.push(res.data[i].description)
                movieGenre.push(res.data[i].genere)
            }
            if(res.data.length ==0){
                setNoMoreRecomondations(true)
            }
            console.log(res)
            setMovieIDArrayForTemplate(movieID)
            setMovieDate(movieDate)
            setMovieDescription(movieDescription)
            setMovieGenre(movieGenre)
            setMoviesName(moviesArrayName)
            if (moviesArrayName.length > 0) {
                fetchMoviePoster(moviesArrayName);
            } else {
                console.log("No movies found for the user.");
            }

        }catch(error){
            console.log(error)
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


     





    return(
        <div>
            <div className="dashboard">
                <div className="topShelf">
                    <h1 className="title">Get New Moive Recomandation!</h1>
                    <Button onClick={getMovies}>Get Recomandation</Button>
                </div>
                {noMoreRecomondations && (
                    <div style={{paddingTop: '20px'}}>
                        No More Recomondations. Please update your moive library for new recomandations.
                    </div>
                )}
                <div className="movieList">
                    {moviesName.map((movie, index) => (
                        <MovieTemplate
                            key={index} 
                            name={movie} 
                            movieImage = {moviesImg[index]}
                            Date_Relesaed = {MovieDate[index]}
                            description = {MovieDescription[index]}
                            genre = {MovieGenre[index]}
                            isRecomondMovie = {true}
                            id = {movieIDArrayForTemplate[index]}
                            
                        />))}
                </div>
            </div>
        </div>
    )
}


export default getMovieRecomandation
