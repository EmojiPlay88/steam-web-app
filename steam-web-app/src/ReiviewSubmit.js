import Button from "react-bootstrap/Button";
import React, {useState} from "react";

export default function ReviewSubmit (props) {
    const [review, setReview] = useState("")
    const handleSubmit = async (event) => {
        console.log(props.gameTitle);
        await fetch("http://localhost:8000/gameinfo", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"name": props.gameTitle})
        });
        const response = await fetch("http://localhost:8000/steamreview", {
            method:"GET"
        });
        const reviewJson = await response.json();
        setReview(reviewJson.data);
        props.onClick(review);
    }
    return(
        <div>
            <Button onClick={handleSubmit}>Get your random review</Button>
        </div>
    );
}