from scrape import getData
import sys
import networkx as nx
from data_generator import filter_nodes, compute_embeddings, generate_data, get_page_rank_and_colors
import json
import time
import requests
base_url = "http://localhost:8080"

if __name__ == "__main__":
    print("Hello, starting up the python engine in main.py")
    print("Base_url:  ", base_url)

    pull_the_plug = False
    json_written_locally = False
    # Extract data
    try:
        print("Trying to get link data from wikipedia...")
        getData(
            start_link=sys.argv[1],
            first_leaf_limit=500,
            second_leaf_limit=500,
            output_location='data/history.gexf')
    except Exception as e:
        pull_the_plug = True
        print("Error in getting link data from wikipedia...", e)

    # Parse/Prepare Data

    try:
        print('Starting to generate the network calculations...')

        try:
            print('Trying to read data...')
            G = nx.read_gexf('./data/history.gexf')
            G = filter_nodes(G, level=1)
        except Exception as e:
            pull_the_plug = True
            print("Error at reading data...", e)

        try:
            print('Trying to compute embeddings...')
            embeddings = compute_embeddings(G)
        except Exception as e:
            pull_the_plug = True
            print("Eror at generating embeddings...", e)

        try:
            print('Trying to compute color and size maps...')
            color_map, size_map = get_page_rank_and_colors(G)
        except Exception as e:
            pull_the_plug = True
            print("Error at generating color and size maps...", e)

        try:
            print('Trying to architect network visualization json for sigma.js...')
            converted_data_for_sigmajs = generate_data(
                G, embeddings, color_map, size_map)
        except Exception as e:
            pull_the_plug = True
            print("Error at converting network visualization json..", e)

        if not pull_the_plug:
            try:
                print("Trying to open the file and dump the json data...")
                with open('./network/data.json', 'w', encoding='utf-8') as f:
                    json.dump(converted_data_for_sigmajs, f)
                print("Network visualization json dumped...!")
                json_written_locally = True
            except Exception as e:
                print("Error at actually dumping the network visualization json..", e)

        if json_written_locally and not pull_the_plug:
            try:
                print("Trying send GET request to the add-record API endpoint!")
                r = requests.get(base_url+'/api/' + 'add-record')
            except Exception as e:
                print("Error at requesting the add-record API", e)
        else:
            print("Skipped calling the Database...")

    except Exception as e:
        print("Error something is very broken in main.py...", e)
