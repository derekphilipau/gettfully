# gettfully

## About

This project is a proof of concept for an Elasticsearch-powered Getty Vocabularies faceted search. The goal is to provide a simple, fast, and easy to use search interface for the Getty Vocabularies.

## Website

[https://gettfully.vercel.app/](https://gettfully.vercel.app/)

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

Currently Imported:

- **TERM.out**: The term table contains the various vocabulary entries (‘names’ in ULAN) for each subject record. One term for each subject must be declared 'preferred' (column 'preferred' = 'P') to form the subject record's overall title or label. Each subject record must have one and only one preferred term.
- **BIOGRAPHY.out**: The biography table contains the biographical information of subject records.
- **NATIONALITY.out**: The nationality table contains the nationality information of subject records.

TBD:

- **SUBJECT.out**: While not directly related to the term or biography, this table provides essential subject-related status information and notes. It can be useful for context and linking.
- **PLACE.out**: This might be useful if you are interested in including geographical context in your Elasticsearch documents, as it contains descriptions of places.

#### Local Development Insecure Elasticsearch

Run Elasticsearch in a Docker container:

The `/docker` folder contains a `docker-compose` file for running the Elasticsearch stack locally. (No secruity, only suitable for local development.)

1. `cd docker`
2. `docker compose up`.

Once running, elasticsearch & kibana should be up and running at:

1. Elasticsearch: http://0.0.0.0:9200/
2. Kibana: http://0.0.0.0:5601/app/home#/

## TODO

This is just a proof of concept. If there is interest, I will add more features, facets, and additional vocabularies.
