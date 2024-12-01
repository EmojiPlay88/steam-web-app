import Button from "react-bootstrap/Button";
import { useState } from "react";
import inputValue from "./Get_games.js";

export default function Get_review(){
    const [gameName, setGameName] = useState("");
    const [review, setReview] = useState("");
    const handleSubmit = (event) => {
        setGameName(inputValue);
        fetch("http://localhost:8000/gameinfo", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(gameName)
        });
        const response = fetch("http://localhost:8000/steamreview", {method:"GET"});
        const reviewJson = response.json();
        setReview(reviewJson.data);
    }
    return(
        <Button onClick={handleSubmit}>Get your random review</Button>
    );
}