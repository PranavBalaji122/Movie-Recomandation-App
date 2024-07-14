import React from "react";
import "./css/movieTemplate.css"
import { useState, useEffect, useRef} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import api from "../api";


function movieTemplate(props){
    const [popupOpen, setPopupOpen] = useState(false);
    const [trashClickedState, setTrashClickedState] = useState(false)
    const { name, genre, description, movieImage, Date_Relesaed, id} = props;
    const popupRef = useRef(null);
    const searchBarRef = useRef(null);



    useEffect(() => {
        document.addEventListener("keydown", handleEscKey);
        document.addEventListener("mousedown", handleClickOutside);
        
    }, []);


    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const trashClicked = () =>{
        setTrashClickedState(!trashClickedState)
    }


    const handleEscKey = (event) =>{
        if(event.key === 'Escape')
            closePopup()
    }


    const handleClickOutside = (event) => {
        if (
            popupRef.current &&
            !popupRef.current.contains(event.target) && 
            searchBarRef.current &&
            !searchBarRef.current.contains(event.target) 
        ) {
            closePopup();
        }
    };
    

    const handleMovieDeletion = async () => {
        console.log("hi")
        try{
            console.log(id)
            const res4 = await api.put("DeleteMoviesInCollection/", {
                moviesInColelction: id.toString()
            });
            window.location.reload();
        }catch(error){
            console.log(error)
        }

    };
    
    
    return(
        <div>
            <div className={"movieTemplateContainer"}>
                <div className="reactiveDiv">
                    <img src={movieImage} className="movieImageClass" onClick={openPopup}></img>
                    <div className="textContainer">
                        <h3 className="movieName">{name}</h3>
                        <DeleteIcon className="deleteIcon"  onClick={trashClicked}/>
                </div>
                </div>
                {trashClickedState && (
                     <div className="trashPopupContainer">
                        <div className="trashPopup" ref={popupRef}>
                            <div className="trashPopupContent" >
                                <span>Are you sure you want to delete the selected movie: <strong>{name}</strong>?</span>
                                <div className="trashPopupButtons">
                                    <button className="cancelDeleteButton" onClick={trashClicked}>Cancel</button>
                                    <button className="confirmDeleteButton" onClick={handleMovieDeletion}>Delete</button>
                                </div>
                            </div>
                        </div>
                 </div>
                )}
                {popupOpen && ( 
                    <div className="popupContainer">
                        <div className="popup" ref={popupRef}>
                            <img src={movieImage} className="movieImageClassPopUp" onClick={openPopup}></img>
                            <div className="content" ref={popupRef}>
                                <h2>{name}</h2>
                                <span><p className='boldText'>Genre: </p>{genre}</span>
                                <span><p className='boldText'>Description: </p>{description}</span>
                                <span><p className='boldText'>Date-Released: </p>{Date_Relesaed}</span>
                                <p></p>
                                <button onClick={closePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}


export default movieTemplate;