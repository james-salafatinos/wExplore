import requests


def write_to_gexf(list_of_tuple_edges, output_location):
    print('In write_to_gexf...')
    import networkx as nx
    G = nx.DiGraph()
    G.add_edges_from(list_of_tuple_edges)
    nx.write_gexf(G, output_location, encoding='utf-8', version='1.1draft')
    return None


def buildURL(params, url, continue_token=None):
    url = url + "?origin=*"

    if continue_token:
        params['plcontinue'] = continue_token

    for k in params:
        url += "&"+k+"="+str(params[k])
    return url


def getData(start_link, first_leaf_limit, second_leaf_limit, output_location):
    db = {}
    URL = "https://en.wikipedia.org/w/api.php"

    params = {
        'action': "query",
        'format': "json",
        'titles': str(start_link),
        'prop': "links",
        'pllimit': first_leaf_limit,
        'plnamespace': 0,
        'ascii': 2,
    }

    def initial_run(continue_token=None):
        # Request
        r = requests.get(buildURL(params, URL, continue_token=continue_token))
        res = r.json()
        pages = res['query']['pages'].keys()

        # Decide whether to continue
        continue_flag = False
        if 'continue' in res:
            continue_flag = True
            continue_token = res['continue']['plcontinue']

        # Gather links
        for p in pages:
            page_title = res['query']['pages'][p]['title']
            if page_title not in db:
                db[page_title] = []

            links = res['query']['pages'][p]['links']
            for l in links:
                db[page_title].append(l['title'])

        # Decide next state, dependent on continue
        if continue_flag:
            return initial_run(continue_token)
        else:
            return None

    def second_run():

        print("Starting second run...")
        for each_link in list(db.values())[0]:
            params_new = {
                'action': "query",
                'format': "json",
                'titles': str(each_link),
                'prop': "links",
                'pllimit': second_leaf_limit,
                'plnamespace': 0,
                'ascii': 2,
            }

            def internal_second_run(continue_token=None):

                try:
                    print("Starting", "internal_second_run in...",
                          each_link, "with [", continue_token, "]")
                except Exception as e:
                    print("UTF Encoding Error")
                r = requests.get(
                    buildURL(params_new, URL, continue_token=continue_token))
                res = r.json()
                pages = res['query']['pages'].keys()

                # Decide whether to continue
                continue_flag = False
                if 'continue' in res:
                    #print('Continue Flag Tripped for: ', each_link)
                    continue_flag = True
                    continue_token = res['continue']['plcontinue']
                    # print(continue_token)

                try:

                    for p in pages:
                        page_title = res['query']['pages'][p]['title']
                        if page_title not in db:
                            db[page_title] = []

                        links = res['query']['pages'][p]['links']
                        for l in links:
                            db[page_title].append(l['title'])
                except Exception as e:
                    print("Could not add links to the page...,", e)

                # Decide next state, dependent on continue
                if continue_flag:
                    #print('ABOUT TO SEND CONTINUE TOKEN: ', continue_token, 'FOR', each_link)
                    return internal_second_run(continue_token)
                else:
                    return None

            internal_second_run()
        return None

    initial_run()
    second_run()

    in_memory_tuples = []
    for entry in db:
        for value in db[entry]:
            in_memory_tuples.append((entry, value))

    write_to_gexf(in_memory_tuples, output_location)
    return None
