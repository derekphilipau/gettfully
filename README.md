# gettfully

## About

This project is a proof of concept for an Elasticsearch-powered Getty Vocabularies faceted search. The goal is to provide a simple, fast, and easy to use search interface for the Getty Vocabularies.

## Website

[https://getty.musefully.org/](https://getty.musefully.org/)

## Design

### Import

This project uses the Getty Relational Table formats (available in Downloads links below). The relational data exports seem to be more consistently updated than the XML exports.

Relational data files are imported into Elasticsearch using the [Elasticsearch Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html).

Each vocabulary is represented by a separate Elasticsearch index, e.g. `ulan-subjects`, `aat-subjects`, etc.

## Getty Vocabularies

The Getty Vocabularies contain structured terminology for art, architecture, decorative arts and other material culture, archival materials, visual surrogates, and bibliographic materials. Compliant with international standards, they provide authoritative information for catalogers, researchers, and data providers.

### The Getty Union List of Artist Names (ULAN)

The Union List of Artist Names ® (ULAN), the Art & Architecture Thesaurus ® (AAT), the Getty Thesaurus of Geographic Names ® (TGN). the Cultural Objects Name Authority ® (CONA), and the Iconography Authority ™ (IA) are structured resources that can be used to improve access to information about art, architecture, and other material culture. The Vocabularies are not simply 'value vocabularies,' but knowledge bases. Through rich metadata and links, the Getty Vocabularies provide powerful conduits for knowledge creation, complex research, and discovery for digital art history and related disciplines.

[ULAN Online Search](https://www.getty.edu/research/tools/vocabularies/ulan/index.html)
[ULAN REL Data Dictionary](https://www.getty.edu/research/tools/vocabularies/ulan/ulan_rel_dd.pdf)
[ULAN Downloads](http://ulandownloads.getty.edu/)

### The Getty Art & Architecture Thesaurus (AAT)

AAT is a thesaurus containing generic terms in several languages, relationships, sources, and scope notes for agents, work types, roles, materials, styles, cultures, and techniques related to art, architecture, and other cultural heritage (e.g., amphora, oil paint, olieverf, acetolysis, sintering, orthographic drawings, Olmeca, Rinascimento, Buddhism, watercolors, asa-no-ha-toji, sralais).

[AAT Online Search](https://www.getty.edu/research/tools/vocabularies/aat/index.html)
[AAT REL Data Dictionary](https://www.getty.edu/research/tools/vocabularies/aat/aat_rel_dd.pdf)
[AAT Downloads](http://aatdownloads.getty.edu/)

## Development

### Download & Install

Fork/download this project and run `npm i` to install dependencies.

Then, run the development server with `npm run dev` and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you have not yet loaded the Elasticsearch data, you should see an error on the search page that the index does not exist.

#### Local Development Insecure Elasticsearch

Run Elasticsearch in a Docker container:

The `/docker` folder contains a `docker-compose` file for running the Elasticsearch stack locally. (No secruity, only suitable for local development.)

1. `cd docker`
2. `docker compose up`.

Once running, elasticsearch & kibana should be up and running at:

1. Elasticsearch: http://0.0.0.0:9200/
2. Kibana: http://0.0.0.0:5601/app/home#/

### Environment Variables

Once you have a running Elasticsearch service, you can add the connection details to the environment variables.

For local development, add a local `.env.local` file in the root directory. If `ELASTICSEARCH_USE_CLOUD` is "true", the Elastic Cloud vars will be used, otherwise the \_HOST, \_PROTOCOL, \_PORT, \_CA_FILE, and \_API_KEY vars will be used. You may need to copy the http_ca.crt from the Elasticsearch Docker container to a local directory like `./secrets`.

```
ELASTICSEARCH_USE_CLOUD=false
ELASTICSEARCH_CLOUD_ID=elastic-my-museum:dXMtY3VudHJhbDEuZ4NwLmNsb1VkLmVzLmlvOjQ0MyQ5ZEhiNWQ2NDM0NTB0ODgwOGE1MGVkZDViYzhjM2QwMSRjNmE2M2IwMmE3NDQ0YzU1YWU2YTg4YjI2ZTU5MzZmMg==
ELASTICSEARCH_CLOUD_USERNAME=elastic
ELASTICSEARCH_CLOUD_PASSWORD=changeme
ELASTICSEARCH_LOCAL_NODE=http://localhost:9200
ELASTICSEARCH_BULK_LIMIT=2000
```

### Load Vocabulary Data

## Loading the data

Go to the Getty download links above and download the REL relational data files for the vocabularies you want to load. Unzip the files and place them in the `/data/[vocab]/` directory, e.g. `/data/ulan/ulan_rel_0124`.

Two data-loading commands are available:

- `npm run load:ulan` - Load the ULAN vocabulary
- `npm run load:aat` - Load the AAT vocabulary

The import script will load data from the REL files in the data directory into Elasticsearch indices. **_Warning: This will modify Elasticsearch indices._**

## TODO

This is just a proof of concept. If there is interest, I will add more features, facets, and additional vocabularies.
