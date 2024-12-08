import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";


export default function GameDropdown(props) {
    const [games, setGames] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchInfo, setSearchInfo] = useState("");

    const fetchGames = async () => {
        if(inputValue.length < 3){
            setGames([]);
        }else{
            const search = await axios.post(`http://localhost:8000/searchinfo`,
                JSON.stringify({"search": inputValue}), {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            //const search = await axios.get(`http://localhost:8000/steamgame`).
            .catch(error => {
                console.error('Error fetching game info:', error);
            });
            setSearchInfo(search.data.data.items);
            const uniqueGames = [];
            for (const game of searchInfo) {
                uniqueGames.push(game);
                if (uniqueGames.length === 100) break;
            }

            setGames(uniqueGames);
        }
    }
    //
    // useEffect(() => {
    //     setDefaultGames()
    // }, []);

    useEffect(() => {
        fetchGames()
    }, [inputValue]);

    const onInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const onSelectHandler = (event) => {
        console.log(event.target.value);
        console.log(games);
        const game = games.find(game => game.id.toString() === event.target.value);
        console.log("Selected game:", game);
        props.onSelect(game);
    };

    return (
        <div>
            <Form.Control onChange={onInputChange} value={inputValue} />
            <Form.Select onChange={onSelectHandler} >
                {games.map((game) => (
                    <option key={game.id} value={game.id}>
                        {game.name}
                    </option>
                ))}
            </Form.Select>
        </div>
    )
}
