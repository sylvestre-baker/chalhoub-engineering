#!/bin/bash

# Définissez l'URL de base
HOST_URL="http://localhost:8001"

# Assurez-vous que le dossier results existe
mkdir -p results

# Scénario 1: User Spike
locust -f locustfile.py --headless -u 100 -r 10 -t 60s --csv=results/rush --host $HOST_URL

# Scénario 2: Steady Load
locust -f locustfile.py --headless -u 50 -r 5 -t 300s --csv=results/stable --host $HOST_URL

# Scénario 3: Gradually Increasing Load
for i in {1..5}; do
    locust -f locustfile.py --headless -u $((i*10)) -r 5 -t 60s --csv=results/increasing_step$i --host $HOST_URL
done

# Scénario 4: Long Session Users
locust -f locustfile.py --headless -u 30 -r 3 -t 1200s --csv=results/long_session --host $HOST_URL

echo "All tests have completed and the results are in the 'results' directory."