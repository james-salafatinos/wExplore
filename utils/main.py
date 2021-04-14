from scrape import getData
import sys
import networkx as nx
from data_generator import filter_nodes, compute_embeddings, generate_data
import json

print("Hello, in main.py")

if __name__ == "__main__":
    print("Hello, in main.main.py")

    # Extract data
    try:
        getData(
            start_link=sys.argv[1],
            first_leaf_limit=500,
            second_leaf_limit=500,
            output_location='data/history.gexf')
    except Exception as e:
        print("Error in getting data...", e)

    # Parse/Prepare Data
    print('ABOUT TO START PARSING THE DATA FOR SIGMA.JS')
    try:

        try:
            G = nx.read_gexf('./data/history.gexf')
            G = filter_nodes(G, level=1)
        except Exception as e:
            print("error at reading in G and filtering...", e)
        try:
            embeddings = compute_embeddings(G)
        except Exception as e:
            print("error at generating embeddings...", e)
        # print(embeddings)
        try:
            converted_data_for_sigmajs = generate_data(G, embeddings)
        except Exception as e:
            print("error at converting for sigmajs..", e)
        # print(converted_data_for_sigmajs)
        try:
            with open('./src/network/data.json', 'w') as f:
                json.dump(converted_data_for_sigmajs, f)
        except Exception as e:
            print("error at actually dumping sigmajs the json..", e)

    except Exception as e:
        print("Error in sending to data.json...", e)
