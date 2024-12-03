from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

games = None

def get_steam_games():
    global games
    if games is None:
        games = requests.get(f"https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json").json()
    return games["applist"]["apps"]

def get_gameid(game:str):
    games = requests.get(f"https://store.steampowered.com/api/storesearch/?term={game}&l=english&cc=us").json()
    for steamgame in games["items"]:
        if steamgame["name"].lower() == game.lower():
            requested_game_id = steamgame["id"]
    return requested_game_id

def get_game_info(id:int):
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
    gameid = get_gameid(gameName)
    print(gameid)
    return {"data": get_game_review(gameid)}

@app.post("/gameinfo", tags=["postinfo"])
async def post_data(game:dict) -> dict:
    gameName = {}
    gameName.append(game)
    return {
        "data": "data successfully posted"
    }