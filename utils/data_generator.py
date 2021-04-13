import networkx as nx
from fa2 import ForceAtlas2


def filter_nodes(G, level=0):
    if level == 0:
        return G
    else:
        remove = [node for node, degree in dict(
            G.degree()).items() if degree > 100]
        remove2 = [node for node, degree in dict(
            G.degree()).items() if degree < 20]
        G.remove_nodes_from(remove)
        G.remove_nodes_from(remove2)
        return G


def compute_embeddings(G):
    forceatlas2 = ForceAtlas2(
        # Behavior alternatives
        outboundAttractionDistribution=True,  # Dissuade hubs
        linLogMode=False,  # NOT IMPLEMENTED
        adjustSizes=False,  # Prevent overlap (NOT IMPLEMENTED)
        edgeWeightInfluence=1.0,

        # Performance
        jitterTolerance=1.0,  # Tolerance
        barnesHutOptimize=True,
        barnesHutTheta=1.2,
        multiThreaded=False,  # NOT IMPLEMENTED

        # Tuning
        scalingRatio=2.0,
        strongGravityMode=False,
        gravity=1.0,

        # Log
        verbose=True)

    positions = forceatlas2.forceatlas2_networkx_layout(
        G, pos=None, iterations=2000)

    return positions


def generate_data(G, pos):
    def convert_one_node(label='default', x=0, y=0, _id=0, attributes={}, color="rgb(192,192,192)", size=50):
        _dict = {
            "label": label,
            "x": x,
            "y": y,
            "id": _id,
            "attributes": attributes,
            "color": color,
            "size": size,
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
