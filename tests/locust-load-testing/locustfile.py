import random
from locust import HttpUser, task, between
import json

class EventAPIUser(HttpUser):
    wait_time = between(1, 2.5)  # Time between tasks for each user
    ACCESS_TOKEN = None
    CONFIG = None

    # On start, each simulated user will get its access token
    def on_start(self):
        # Read the config once
        with open("config.json", "r") as f:
            self.CONFIG = json.load(f)

        credentials = {
            "email": "sylvestre.franceschi@gmail.com",
            "password": "Azerty01!"
        }
        
        # Try signing in first
        response = self.client.post("/auth/signin", json=credentials)
        
        if response.status_code == 200 or response.status_code == 201:
            self.ACCESS_TOKEN = response.json()["data"]["access_token"]
        else:
            # If signin fails, try signing up
            signUpCredentials = {
                "firstname": "Sylvestre",
                "lastname": "Franceschi",
                "email": "sylvestre.franceschi@gmail.com",
                "password": "Azerty01!"
            }
            response = self.client.post("/auth/signup", json=signUpCredentials)
            if response.status_code == 200 or response.status_code == 201:
                self.ACCESS_TOKEN = response.json()["data"]["access_token"]

    @task
    def create_event(self):
        if self.ACCESS_TOKEN and self.CONFIG:  # Ensure we have an access token and config
            headers = {
                "Authorization": f"Bearer {self.ACCESS_TOKEN}",
                "Content-Type": "application/json"
            }
            
            name = random.choice(self.CONFIG["names"])
            body = random.choice(self.CONFIG["bodies"])
            
            payload = {
                "name": name,
                "body": body
            }
            
            self.client.post("/event", headers=headers, json=payload)  # self.host is used implicitly
