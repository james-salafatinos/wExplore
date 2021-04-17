import networkx as nx
from fa2 import ForceAtlas2


def filter_nodes(G, level=1):
    print('In filter nodes....')

    if level == 0:
        return G
    else:

        # READ FIRST: <10 means remove anything with a dgree less than 10
        remove = [node for node, degree in dict(
            G.degree()).items() if degree < 5]
        remove2 = [node for node in G.nodes if '(identifier)' in node]
        G.remove_nodes_from(remove)
        G.remove_nodes_from(remove2)
        B = sorted(G.degree, key=lambda x: x[1], reverse=False)
        print("First entry in the filtered and sorted by degree graph, ", B[0])
        return G


def get_page_rank_and_colors(G):
    """
    Takes a networkx Graph and returns the color by page rank dictionary by node.
    Ex: {'FL Studio':0.0031,
         'DAW': 0.0001}

    Page rank will always add up to 1 for the entire array.
    """
    import pandas as pd
    from matplotlib import cm
    import numpy as np

    PR = nx.algorithms.link_analysis.pagerank_alg.pagerank(G)
    #cum_sum_page_rank = np.cumsum(pd.Series(PR).sort_values())
    list_of_PR = pd.Series(PR).sort_values()

    def normalize(a_list):
        a = a_list
        amin, amax = min(a), max(a)
        for i, val in enumerate(a):
            a[i] = (val-amin) / (amax-amin)
        return a

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
        scalingRatio=5.0,
        strongGravityMode=False,
        gravity=1,

        # Log
        verbose=True)

    positions = forceatlas2.forceatlas2_networkx_layout(
        G, pos=None, iterations=500)

    return positions


def generate_data(G, pos, color_map, size_map):
    def convert_one_node(label='default', x=0, y=0, _id=0, attributes={}, color="rgb(192,192,192)", size=10):
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

    def convert(G, pos):
        print("in Convert")
        from networkx.readwrite import json_graph
        json_G = json_graph.node_link_data(G)
        print("After node_link_data")

        nodes = []
        edges = []
        for node in json_G['nodes']:
            x, y = pos[node['id']]
            converted_node = convert_one_node(label=node['label'],
                                              x=x,
                                              y=y,
                                              _id=node['id'])
            nodes.append(converted_node)
        print("After node")
        for edge in json_G['links']:
            converted_edge = convert_one_edge(source=edge['source'],
                                              target=edge['target'],
                                              _id=edge['id'])
            edges.append(converted_edge)

        return {'nodes': nodes, 'edges': edges}

    converted_data = convert(G, pos)
    return converted_data
