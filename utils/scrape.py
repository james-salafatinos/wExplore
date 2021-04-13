import requests


def write_to_gexf(list_of_tuple_edges, output_location):
    print('In write_to_gexf...')
    import networkx as nx
    G = nx.DiGraph()
    G.add_edges_from(list_of_tuple_edges)
    nx.write_gexf(G, output_location, encoding='utf-8',
                  prettyprint=True, version='1.1draft')
    return None


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

    def buildURL(params, url):
        url = url + "?origin=*"
        for k in params:
            url += "&"+k+"="+str(params[k])
        return url

    def initial_run():
        r = requests.get(buildURL(params, URL))
        res = r.json()
        pages = res['query']['pages'].keys()
        for p in pages:
            page_title = res['query']['pages'][p]['title']
            db[page_title] = []
            links = res['query']['pages'][p]['links']
            for l in links:
                db[page_title].append(l['title'])

        print('Done with Initial Run')
        return None

    def second_run():
        for each_link in list(db.values())[0]:
            params_new = {
                'action': "query",
                'format': "json",
                'titles': str(each_link),
                'prop': "links",
                'pllimit': second_leaf_limit,
                'ascii': 2,
            }
            try:
                r = requests.get(buildURL(params_new, URL))
                res = r.json()
                pages = res['query']['pages'].keys()
                try:
                    for p in pages:
                        page_title = res['query']['pages'][p]['title']
                        db[page_title] = []
                        try:
                            links = res['query']['pages'][p]['links']
                            for l in links:
                                db[page_title].append(l['title'])
                        except:
                            print("Error on link, inside, inside:", each_link)

                    print("On Second run, done with link:", each_link)
                except:
                    print("Error on link, inside:", each_link)

            except:
                print("Error on link, outer:", each_link)
        return None

    initial_run()
    second_run()

    in_memory_tuples = []
    for entry in db:
        for value in db[entry]:
            in_memory_tuples.append((entry, value))

    write_to_gexf(in_memory_tuples, output_location)
    return None
