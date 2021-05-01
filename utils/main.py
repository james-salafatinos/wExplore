from scrape import getData
import sys
import networkx as nx
from data_generator import filter_nodes, compute_embeddings, generate_data, get_page_rank_and_colors
import json
import time
import requests
#base_url = "https://8080-cs-291019621083-default.cs-us-central1-mtyn.cloudshell.dev"
base_url = "https://wexplore-311823.uc.r.appspot.com"
print("Hello, in main.py")

if __name__ == "__main__":
    print("Hello, starting up the python engine in main.py")
    print("Base_url:  ", base_url)

    pull_the_plug = False
    json_written_locally = False

    success_log = {}

    # Extract data
    try:
        print("1. Trying to get link data from wikipedia...")

        getData(
            start_link=sys.argv[1],
            first_leaf_limit=500,
            second_leaf_limit=500,
            output_location='data/history.gexf')
        print("[x] SUCCESS")
        success_log['1. Trying to get link data from wikipedia...'] = 'SUCCESS'
    except Exception as e:
        pull_the_plug = True
        print("Error in getting link data from wikipedia...", e)
        success_log['Getting link data from wikipedia'] = 'FAIL'

    # Parse/Prepare Data

    try:
        print('2. Trying to read data...')

        G = nx.read_gexf('./data/history.gexf')
        G = filter_nodes(G, level=1)

        print("[x] SUCCESS")
        success_log['2. Trying to read data...'] = 'SUCCESS'
    except Exception as e:
        pull_the_plug = True
        print("Error at reading data...", e)
        success_log['2. Trying to read data...'] = 'FAIL'

    try:
        print('3. Trying to compute embeddings...')

        embeddings = compute_embeddings(G)

        print("[x] SUCCESS")
        success_log['3. Trying to compute embeddings...'] = 'SUCCESS'
    except Exception as e:
        pull_the_plug = True
        print("Eror at generating embeddings...", e)
        success_log['3. Trying to compute embeddings...'] = 'FAIL'

    try:
        print('4. Trying to compute color and size maps...')

        color_map, size_map = get_page_rank_and_colors(G)

        print("[x] SUCCESS")
        success_log['4. Trying to compute color and size maps...'] = 'SUCCESS'
    except Exception as e:
        pull_the_plug = True
        print("Error at generating color and size maps...", e)
        success_log['4. Trying to compute color and size maps...'] = 'FAIL'

    try:
        print('5. Trying to architect network visualization json for sigma.js...')

        converted_data_for_sigmajs = generate_data(
            G, embeddings, color_map, size_map)

        print("[x] SUCCESS")
        success_log['5. Trying to architect network visualization json for sigma.js...'] = 'SUCCESS'
    except Exception as e:
        pull_the_plug = True
        print("Error at converting network visualization json..", e)
        success_log['5. Trying to architect network visualization json for sigma.js...'] = 'FAIL'

    if not pull_the_plug:
        try:
            print("6. Trying to open the file and dump the json data...")
            with open('./network/data.json', 'w', encoding='utf-8') as f:
                json.dump(converted_data_for_sigmajs, f)

            json_written_locally = True
            print("[x] SUCCESS")
            success_log['6. Trying to open the file and dump the json data...'] = 'SUCCESS'
        except Exception as e:
            print("Error at actually dumping the network visualization json..", e)
            success_log['6. Trying to open the file and dump the json data...'] = 'FAIL'

    if json_written_locally and not pull_the_plug:
        try:
            print("7. Trying send GET request to the add-record API endpoint...")
            print('Attempting with: ', base_url+'/api/' + 'add-record')
            r = requests.get(base_url+'/api/' + 'add-record')
            print(r)
            print("[x] SUCCESS")
            success_log['7. Trying send GET request to the add-record API endpoint...'] = 'SUCCESS'
        except Exception as e:
            print("Error at requesting the add-record API", e)
            success_log['7. Trying send GET request to the add-record API endpoint...'] = 'FAIL'
    else:
        print("Skipped calling the Database...")

    # Print Results
    for k, v in success_log.items():
        print(k, v, '\n')
