import React, {useEffect, useState, createContext, useContext} from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const GamesContext = createContext({
    games: [], fetchGames: () => {}
})

const InputValueContxt = createContext({
    inputValue: "", setInputValue: () => {}
});

const ReviewContext = createContext({
    review: {}, setReview: () => {}
})
export default function Get_games(){
    const [games, setGames] = useState([])
    const [inputValue, setInputValue] = useState("");
    const fetchGames = async () => {
        const response = await fetch("http://localhost:8000/steamgames")
        const games = await response.json()
        setGames(games.data)
    }
    useEffect(() => {
        fetchGames()
    }, [])

    const filteredGames = () => {
        // Фильтруем игры по введенному тексту
        const matchedGames = games.filter((game) =>
            game.name.toLowerCase().includes(inputValue.toLowerCase())
        );

        // Удаляем дубликаты в первых 25 элементах
        const uniqueGames = [];
        const seenNames = new Set();

        for (const game of matchedGames) {
            if (!seenNames.has(game.name.toLowerCase())) {
                uniqueGames.push(game);
                seenNames.add(game.name.toLowerCase());
            }

            // Как только собрали 25 уникальных игр — выходим из цикла
            if (uniqueGames.length === 100) break;
        }

        // Если уникальных игр меньше 25, добавляем оставшиеся из исходного списка
        for (const game of games) {
            if (uniqueGames.length === 100) break;
            if (!seenNames.has(game.name.toLowerCase())) {
                uniqueGames.push(game);
                seenNames.add(game.name.toLowerCase());
            }
        }

        return uniqueGames;
    };
    return(
        <GamesContext.Provider value={{games, fetchGames}}>
            <InputValueContxt.Provider value={{inputValue, setInputValue}}>
                <Form.Select>
                    {filteredGames().map((game) => (
                        <option key={game.name} value={game.name}>
                            {game.name}
                        </option>
                    ))}
                </Form.Select>
            </InputValueContxt.Provider>
        </GamesContext.Provider>
    )
}

export function Get_review(){
    const { inputValue } = useContext(InputValueContxt);
    const [review, setReview] = useState({})
    const handleSubmit = async (event) => {
        await fetch("http://localhost:8000/gameinfo", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"name": inputValue})
        });
        const response = await fetch("http://localhost:8000/steamreview", {
            method:"GET"
        });
        const reviewJson = await response.json;
        setReview(reviewJson.data);
        return review;
    }
    return(
        <ReviewContext.Provider value={{review, setReview}}>
            <Button onClick={handleSubmit}>Get your random review</Button>
        </ReviewContext.Provider>
    );
}