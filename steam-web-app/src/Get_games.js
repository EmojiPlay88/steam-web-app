import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form';

const GamesContext = React.createContext({
    games: [], fetchGames: () => {}
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
            if (uniqueGames.length === 30) break;
        }

        // Если уникальных игр меньше 25, добавляем оставшиеся из исходного списка
        for (const game of games) {
            if (uniqueGames.length === 30) break;
            if (!seenNames.has(game.name.toLowerCase())) {
                uniqueGames.push(game);
                seenNames.add(game.name.toLowerCase());
            }
        }

        return uniqueGames;
    };
    return(
        <GamesContext.Provider value={{games, fetchGames}}>
            <Form.Select>
                {filteredGames().map((game) => (
                    <option key={game.name} value={game.name} />
                ))}
            </Form.Select>
        </GamesContext.Provider>
    )
}