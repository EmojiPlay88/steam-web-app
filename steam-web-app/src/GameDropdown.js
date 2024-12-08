import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";


export default function GameDropdown(props) {
    const [games, setGames] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchInfo, setSearchInfo] = useState("");

    const setDefaultGames = async () => {
        console.log('setDefaultGames')
        axios.get(`http://localhost:8000/steamgames`)
            .then(res => {
                let gamesLoaded = res.data.data;
                gamesLoaded = gamesLoaded.filter(game => game.name && game.name.trim() !== '');
                console.log(gamesLoaded);
                console.log("size: " +  gamesLoaded);
                setGames( gamesLoaded );
                console.log(gamesLoaded);

            })
            .catch(error => {
                console.error('Error fetching default games:', error);
                setGames([]);
            });

    }

    const fetchGames = async () => {
        if(inputValue.length < 3){
            setGames([]);
        }else{
            console.log(inputValue);
            await axios.post(`http://localhost:8000/searchinfo`,
                JSON.stringify({"search": inputValue}), {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const search = await axios.get(`http://localhost:8000/steamgame`);
            setSearchInfo(search.data.data.items);
            const matchedGames = searchInfo.filter((game) =>
                game.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            const uniqueGames = [];
            const seenNames = new Set();
            for (const game of matchedGames) {
                console.log(game.name);
                if (!seenNames.has(game.name.toLowerCase())) {
                    uniqueGames.push(game);
                    seenNames.add(game.name.toLowerCase());
                }
                if (uniqueGames.length === 100) break;
            }
            console.log(uniqueGames);

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
        const selectedValue = event.target.value;
        console.log("Selected game:", selectedValue);
        props.onSelect(selectedValue);

    };

    return (
        <div>
            <Form.Control onChange={onInputChange} value={inputValue} />
            <Form.Select onChange={onSelectHandler} >
                {games.length > 0  && games.map((game) => (
                    <option key={game.name} value={game.name}>
                        {game.name}
                    </option>
                ))}
            </Form.Select>
        </div>
    )
}
