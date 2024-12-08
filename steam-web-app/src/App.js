import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import Review from "./Review";
import GameDropdown from "./GameDropdown";
import ReviewSubmit from "./ReiviewSubmit";

import { useEffect, useState } from "react";

function App(){

    const [chosenGame, setChosenGame] = useState("");
    const [gameReview, setGameReview] = useState("");

    useEffect(() => {
        document.title = "Random Steam Review Generator";
    })

    const selectGame=(title) => {
        setChosenGame(title);
    }

    const displayReview = (review) => {
        console.log(review);
        setGameReview(review);
    }

    return (
        <>
    <Container>
        <Row>
          <Col> <h1>Random Steam Review generator</h1></Col>
        </Row>
        <Row>
            <Col><h3>{chosenGame.name}</h3></Col>
        </Row>
        <Row>
            <Col><Review review={gameReview}/></Col>
        </Row>
        <Row>
            <GameDropdown onSelect={selectGame}/>
        </Row>
        <Row>
            <ReviewSubmit onClick={displayReview} game={chosenGame}/>
        </Row>
    </Container>
        </>



    );
}

export default App;