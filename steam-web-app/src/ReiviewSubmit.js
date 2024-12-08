import Button from "react-bootstrap/Button";
import React from "react";
import axios from "axios";

export default function ReviewSubmit (props) {
    const handleSubmit = async (event) => {
        axios.get(`http://localhost:8000/steamreview?gameId=${props.game.id}`)
            .then(response => {
                console.log(response.data.data);
                props.onClick(response.data.data);
        });
    }
    return(
        <div>
            <Button onClick={handleSubmit}>Get your random review</Button>
        </div>
    );
}