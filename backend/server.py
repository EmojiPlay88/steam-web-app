from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import random

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Search(BaseModel):
    search: str

class Game(BaseModel):
    game: str

games = None

def no_whitespace(string:str):
    if string.find(" ") > 0:
        string = string.replace(" ", "")
    return string

def get_steam_games():
    global games
    if games is None:
        games = requests.get(f"https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json").json()
    return games["applist"]["apps"]

def search_games(game:str):
    game = no_whitespace(game)
    print(f"Game is (searchgames): {game}")
    games = requests.get(f"https://store.steampowered.com/api/storesearch/?term={game}&l=english&cc=us").json()
    return games

def get_game_info(id):
    requested_game_info = requests.get(f"http://store.steampowered.com/api/appdetails?appids={id}").json()
    return requested_game_info

def get_game_review(id:int):
    game_reviews = requests.get(f"https://store.steampowered.com/appreviews/{id}?json=1&filter=all&language=english&day_range365&review_type=all&purchase_type=all&num_per_page=100").json()
    game_reviews = game_reviews["reviews"]
    rnd_review = random.choice(game_reviews)
    return rnd_review

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"Hello":"World"}

@app.get("/steamgames", tags=["games"])
async def get_games() -> dict:
    return {"data": get_steam_games()}

@app.get("/steamreview", tags=["review"])
async def get_review(game_id: int = Query(..., alias="gameId")) -> dict:
    print(game_id)
    gameId = game_id
    if gameId is None:
        return {"data": "the json is emptys"}
        print("json is empty")
    else:
        print(f"Game id: {gameId}")
        gameReview = get_game_review(gameId)
        print(gameReview)
        return {"data": gameReview}

@app.post("/gameinfo")
async def post_data(game: Game):
    if game is None:
        raise HTTPException(status_code=400, detail="The name is empty")
    game_name = game.game
    return {
        "status": "1",
        "game": game_name
    }

@app.get("/steamgame", tags=["games"])
async def get_games() -> dict:
    game_search = search_games(searchInfo)
    return {"data": game_search}

@app.post("/searchinfo", tags=["search"])
async def search_inf(search: Search): #after 3 letters
    if search.search is None:
        raise HTTPException(status_code=400, detail="The search is empty")
    game_search = search_games(search.search)
    print(game_search)
    return {
        "data": game_search
    }
