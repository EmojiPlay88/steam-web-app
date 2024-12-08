import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import axios from "axios";

export default function ReviewSubmit (props) {
    const [review, setReview] = useState("")
    const handleSubmit = async (event) => {
        console.log(props.gameTitle);
        await axios.post("http://localhost:8000/gameinfo",
            JSON.stringify({"name": props.gameTitle}),{
            headers: {
                "Content-Type": "application/json"
            }
        });
        const response = await axios.get("http://localhost:8000/steamreview");
        setReview(response.data.data);
        props.onClick(review);
    }
    return(
        <div>
            <Button onClick={handleSubmit}>Get your random review</Button>
        </div>
    );
}