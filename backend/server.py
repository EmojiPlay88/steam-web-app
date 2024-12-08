from fastapi import FastAPI, HTTPException
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

class Review(BaseModel):
    review: str

games = None
gameName = None
searchInfo = None
steamGame = None

def get_steam_games():
    global games
    if games is None:
        games = requests.get(f"https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json").json()
    return games["applist"]["apps"]

def get_gameid(game:str):
    requested_game_id = None
    games = requests.get(f"https://store.steampowered.com/api/storesearch/?term={game}&l=english&cc=us").json()
    for steamgame in games["items"]:
        if steamgame["name"].lower() == game.lower():
            requested_game_id = steamgame["id"]
    return requested_game_id

def search_games(game:str):
    if game.find(" ") > 0:
        game = game.replace(" ", "")
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
async def get_review() -> dict:
    if gameName is None:
        return {"data": "the json is emptys"}
        print("json is empty")
    else:
        gameid = get_gameid(gameName)
        gameReview = get_game_review(gameid)
        print(gameReview)
        return {"data": gameReview}

@app.post("/gameinfo", tags=["postinfo"])
async def post_data(game:dict) -> dict:
    global gameName
    if game["name"] is None:
        raise HTTPException(status_code=400, detail="The name is empty")
    gameName = game["name"]
    return {
        "data": "data successfully posted"
    }

@app.get("/steamgame", tags=["games"])
async def get_games() -> dict:
    game_search = search_games(searchInfo)
    return {"data": game_search}

@app.post("/searchinfo", tags=["search"])
async def search_inf(search: Search):
    if search is None:
        raise HTTPException(status_code=400, detail="The search is empty")
    global searchInfo
    searchInfo = search.search
    return {
        "data": "search info successfully posted"
    }
