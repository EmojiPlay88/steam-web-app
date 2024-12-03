import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Get_games from './Get_games';
import {Get_review} from './Get_games.js';
import './App.css';
import Review from "./Review";
import GameDropdown from "./GameDropdown";

import { useEffect, useState } from "react";

function App(){

    const [chosenGame, setChosenGame] = useState("");

    useEffect(() => {
        document.title = "Random Steam Review Generator";
    })

    const selectGame=(title) => {
        console.log("App select game: " + title)
        setChosenGame(title);
    }

    return (
        <>
    <Container>
        <Row>
          <Col> <h1>Random Steam Review generator</h1></Col>
        </Row>
        <Row>
            <Col> {chosenGame}</Col>
        </Row>
        <Row>
            <GameDropdown onSelect={selectGame}/>
        </Row>
        <Row>
            <Review gameTitle={chosenGame}/>
        </Row>
    </Container>
        </>



    );
}

export default App;