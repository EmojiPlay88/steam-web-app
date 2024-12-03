import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Get_games from './Get_games';
import {Get_review} from './Get_games.js';
import './App.css';
import Review from "./Review";

import { useEffect, useState } from "react";

function App(){
    useEffect(() => {
        document.title = "Random Steam Review Generator";
    })

    return ( 
    <Container>
        <Row>
          <Col> <h1>Random Steam Review generator</h1></Col>
        </Row>
        <Row>
            <Col> <Review /></Col>
        </Row>
        <Row>
          <Col className="gameInput"><Get_games /></Col>
        </Row>
        <Row>
            <Get_review />
        </Row>
    </Container>



    );
}

export default App;