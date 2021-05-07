import networkx as nx
from fa2 import ForceAtlas2
import pandas as pd
from matplotlib import cm
import numpy as np


def normalize(a_list):
    a = a_list
    amin, amax = min(a), max(a)
    for i, val in enumerate(a):
        # Avoid division by zero
        try:
            a[i] = (val-amin) / (amax-amin)
        except:
            a[i] = .1
            print('Tried to divide by zero')
    return a


# def remove_node(node):
#     remove = True
#     if node == '(identifier)':
#         remove = False
#     elif node == 'Wayback Machine':
#         remove = False
#     else:
#         remove = True
#     return remove


def filter_nodes(G, level=1):
    print('Starting to filter nodes....')

    if level == 0:
        return G
    else:
        print("Starting total nodes, edges:", len(G.nodes), len(G.edges))
        nodes_to_remove = []
        for each_node in G.nodes:
            if '(identifier)' in each_node:
                nodes_to_remove.append(each_node)
            if 'Wayback Machine' in each_node:
                nodes_to_remove.append(each_node)
            if 'Wikidata' in each_node:
                nodes_to_remove.append(each_node)

        remove = [node for node, degree in dict(
            G.in_degree()).items() if degree < 5]
        remove2 = [node for node in G.nodes if
                   '(identifier)' in node]

        G.remove_nodes_from(remove)
        G.remove_nodes_from(remove2)
        G.remove_nodes_from(nodes_to_remove)

        B = sorted(G.degree, key=lambda x: x[1], reverse=False)
        print("First entry in the filtered and sorted by degree graph, ", B[0])

        # Removes the last 5% of nodes that have a small degree
        small_degree_nodes = [node[0]
                              for node in B[:int(.05*len(B) // 1)]]
        print("Ending total nodes, edges:", len(G.nodes), len(G.edges))
        G.remove_nodes_from(small_degree_nodes)
        return G


def get_page_rank_and_colors(G):
    """
    Takes a networkx Graph and returns the color by page rank dictionary by node.
    Ex: {'FL Studio':0.0031,
         'DAW': 0.0001}

    Page rank will always add up to 1 for the entire array.
    """
    print('Getting node color and size maps....')

    PR = nx.algorithms.link_analysis.pagerank_alg.pagerank(G)
    # cum_sum_page_rank = np.cumsum(pd.Series(PR).sort_values())
    list_of_PR = pd.Series(PR).sort_values()

    color_values_from_PR = normalize(list_of_PR)

    cmap = cm.get_cmap('winter_r', 12)

    node_color_map = {}
    size_map = {}
    for k, v in dict(color_values_from_PR).items():
        rgba = list(map((lambda x: int(x*255//1)), [*cmap(v)]))
        rgba_str = f'rgb({rgba[0]},{rgba[1]},{rgba[2]})'
        node_color_map[k] = rgba_str
        size_map[k] = max(1, 1 + np.log1p(v*100))

    return node_color_map, size_map


def compute_embeddings(G):
    print('Computting embeddings...')
    forceatlas2 = ForceAtlas2(
        # Behavior alternatives
        outboundAttractionDistribution=False,  # Dissuade hubs
        linLogMode=False,  # NOT IMPLEMENTED
        adjustSizes=False,  # Prevent overlap (NOT IMPLEMENTED)
        edgeWeightInfluence=1.0,

        # Performance
        jitterTolerance=1.0,  # Tolerance
        barnesHutOptimize=True,
        barnesHutTheta=1.2,
        multiThreaded=False,  # NOT IMPLEMENTED

        # Tuning
        scalingRatio=7.0,
        strongGravityMode=False,
        gravity=.2,

        # Log
        verbose=True)

    positions = forceatlas2.forceatlas2_networkx_layout(
        G, pos=None, iterations=100)

    return positions


def convert_one_node(color_map, size_map, label='default', x=0, y=0, _id=0, attributes={}):
    _dict = {
        "label": label,
        "x": x,
        "y": y,
        "id": _id,
        "attributes": attributes,
        "color": color_map[label],
        "size": size_map[label],
    }
    return _dict


def convert_one_edge(source='default', target='default', _id=0, attributes={}, color="rgb(192,192,192)", size=1):
    _dict = {
        "source": source,
        "target": target,
        "id": _id,
        "attributes": attributes,
        "color": color,
        "size": size,
    }
    return _dict


def generate_data(G, pos, color_map, size_map):
    print('Writing Data to Json...')

    def convert(G, pos):
        from networkx.readwrite import json_graph
        json_G = json_graph.node_link_data(G)

        nodes = []
        edges = []
        for node in json_G['nodes']:
            x, y = pos[node['id']]
            converted_node = convert_one_node(label=node['label'],
                                              x=x,
                                              y=y,
                                              _id=node['id'],
                                              color_map=color_map,
                                              size_map=size_map)
            nodes.append(converted_node)
        for edge in json_G['links']:
            converted_edge = convert_one_edge(source=edge['source'],
                                              target=edge['target'],
                                              _id=edge['id'])
            edges.append(converted_edge)

        return {'nodes': nodes, 'edges': edges}

    converted_data = convert(G, pos)
    return converted_data
