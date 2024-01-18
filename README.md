# gettfully

## ULAN

[ULAN REL Data Dictionary](https://www.getty.edu/research/tools/vocabularies/ulan/ulan_rel_dd.pdf)

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

Consider using nested object fields for related terms, biographies, and nationalities.
