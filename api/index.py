
import openai

import uvicorn
import json

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from pydantic import BaseSettings
from pydantic import BaseModel

from fastapi import FastAPI

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

class Settings(BaseSettings):
    OPENAI_API_KEY: str = 'OPENAI_API_KEY'

    class Config:
        env_file = '.env'

class Place(BaseModel):
    city: str

settings = Settings()
openai.api_key = settings.OPENAI_API_KEY



app = FastAPI()
#templates = Jinja2Templates(directory="templates")
#app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success", "message": "VIAJAH - FastAPI BE  with Next.js OK!"}

@app.post("/api/place")
async def query(place: Place):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=generate_message(place),
        temperature=1,
    )

    result = response.choices[0]['message']['content']
    print(result)
    return result

def generate_message(place):
    message='quais sao os top 3 melhores lugares para se visitar em {c}. faça em ordem da melhor rota possivel. forneca uma breve descricao ou curiosidade de cada lugar. Responda apenas no formato json: rotas[{{\"lugar\": \"\",\"descricao\": \"\"}}]'.format(c=place)
    messages=[{"role": "user", "content": message}]
    return messages

# @app.post("/api/query", response_class=HTMLResponse)
# async def index(request: Request, city: str= Form(...)):
   # response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Suggest three names for places to visit in Paris"}])
    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     messages=generate_message(place),
    #     #prompt=generate_prompt(city),
    #     temperature=1,
    # )
    # result = response.choices[0]['message']['content']
    # print(result)
    # return result
   # return templates.TemplateResponse("index.html", {"request": request, "result": result})


