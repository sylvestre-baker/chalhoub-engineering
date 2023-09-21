from locust.env import Environment
from locust.log import setup_logging

from locustfile import EventAPIUser

# Setting up logging
setup_logging("INFO", None)

# Define user classes for simulation
user_classes = [EventAPIUser]

# Create a locust environment
env = Environment(user_classes=user_classes)
env.create_local_runner()
env.host = "http://localhost:8001"

def save_current_stats_to_csv(file_name):
    with open(file_name, 'w') as f:
        f.write(env.runner.stats.history)

# Scenario 1: User Spike
env.runner.start(100, spawn_rate=10)  # Rapid influx of 100 users
env.runner.greenlet.join(timeout=60)  # Duration of 60 seconds
save_current_stats_to_csv("results/rush_stats.csv")

# Scenario 2: Steady Load
env.runner.start(50, spawn_rate=5)  # 50 users arriving at a steady rate
env.runner.greenlet.join(timeout=300)  # Duration of 5 minutes
save_current_stats_to_csv("results/stable_stats.csv")

# Scenario 3: Gradually Increasing Load
for i in range(1, 6):  # Increasing the load every minute
    env.runner.start(i*10, spawn_rate=5)  # Increase by 10 users each minute
    env.runner.greenlet.join(timeout=60)  # Each loop lasts 1 minute
save_current_stats_to_csv("results/increasing_stats.csv")

# Scenario 4: Long Session Users
env.runner.start(30, spawn_rate=3)  # 30 users over an extended period
env.runner.greenlet.join(timeout=1200)  # Duration of 20 minutes
save_current_stats_to_csv("results/long_session_stats.csv")

# Save overall stats and stop all processes
save_current_stats_to_csv("results/stats.csv")
env.runner.quit()
