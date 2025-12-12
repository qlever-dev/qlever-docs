# Datasets

qlever-control comes with a number of (mostly) ready to go datasets. They can be used to get up and running quickly.
This page contains a reference of all pre-configured datasets.

To get running with a dataset first create a Qleverfile for that dataset with `qlever setup-config`. For example to create a QLeverfile for the [`scientists` dataset](#scientists) run `qlever setup-config scientists`. Then download the data, build the index and run the server as described in the [quickstart](../quickstart.md).

## ToDo

- DBLP Plus is no longer running
- [Yago 3](https://qlever.dev/yago-3) is available on <qlever.dev> but has no QLeverfile
- [Wikimedia Commons](https://qlever.dev/wikimedia-commons) is available on <qlever.dev> but has no QLeverfile
- interesting metrics
    - Execution (Index Size, RAM required)
    - Building (Storage Required, RAM required, duration)

## `dblp`

| Endpoints                                                                             | Number of triples | Index Size | Time to build index |
| ------------------------------------------------------------------------------------- | ----------------- | ---------- | ------------------- |
| [Official (QLever)](https://sparql.dblp.org/), [QLever Demo](https://qlever.dev/dblp) | ~1.5 B            | ~25 GB     | ~30 min             |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.dblp)

[DBLP](https://dblp.org/) is a computer science bibliography. This dataset contains the DBLP dataset with citations from [OpenCitations](https://opencitations.net/).

## `dblp-plus`

?

## `dbpedia`

| Endpoints                                                                                 | Number of triples | Index Size | Time to build index |
| ----------------------------------------------------------------------------------------- | ----------------- | ---------- | ------------------- |
| [Official](https://databus.dbpedia.org/sparql), [QLever Demo](https://qlever.dev/dbpedia) | ~845 M            | N/A        | ~20 min             |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.dbpedia)  
[Dataset](https://databus.dbpedia.org/dbpedia/collections/latest-core)

The [DBpedia](https://databus.dbpedia.org/) dataset contains information extracted from the structured Wikipedia elements like the infoboxes.

## `default`

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.default)  

A minimal QLeverfile that can be used to build a custom configuration for your dataset.

## `dnb`

| Endpoints                                                                          | Number of triples | Index Size | Time to build index |
| ---------------------------------------------------------------------------------- | ----------------- | ---------- | ------------------- |
| [Official (QLever)](https://sparql.dnb.de/), [QLever Demo](https://qlever.dev/dnb) | ~1.5 B            | N/A        | ~5 min              |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.dnb)

The [German National Library (DNB)](https://www.dnb.de/EN/Home/home_node.html) is the central archival library for Germany. The dataset contains information on the publications in the DNB's inventory.

## `fbeasy`

| Endpoints                                | Number of triples | Index Size | Time to build index |
| ---------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/fbeasy) | ~362 M            | N/A        | ~10 min             |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.fbeasy)

FBEasy is a simplified and cleaned version of the [Freebase dataset](#freebase).

## `freebase`

| Endpoints                                  | Number of triples | Index Size | Time to build index |
| ------------------------------------------ | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/freebase) | ~3.1 B            | N/A        | ~4 min              |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.freebase)

## `imdb`

| Endpoints                              | Number of triples | Index Size | Time to build index |
| -------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/imdb) | ~382 M            | ~20 MB     | ~5 m                |

A dataset containing basic movie and ratings information from the film and series database [IMDb](https://www.imdb.com/). The dataset is available at <https://datasets.imdbws.com/>.

## `ohm-planet`

| Endpoints                                    | Number of triples | Index Size | Time to build index |
| -------------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/ohm-planet) | ~5.8 B            | ~60 GB     | ~1 h                |

[Hosted demo](https://qlever.dev/ohm-planet)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.ohm-planet)

!!! warning
    The tool [osm2rdf](https://github.com/ad-freiburg/osm2rdf) is required during the dataset preparation.

The [OpenHistoricalMap](https://www.openhistoricalmap.org/) is a OpenStreeMap like dataset of the world throughout history. The data modelling is similar to the OSM datasets.

## `olympics`

| Endpoints                                  | Number of triples | Index Size | Time to build index |
| ------------------------------------------ | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/olympics) | ~1.8 M            | ~20 MB     | ~10 s               |

[Hosted demo](https://qlever.dev/olympics)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.olympics)

A demo dataset with historic data on the olympic winter and summer games from Athens 1896 to Rio 2016. More information can be found in the [repository of this dataset](http://github.com/wallscope/olympics-rdf).

## `orkg`

| Endpoints                              | Number of triples | Index Size | Time to build index |
| -------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/orkg) | ~3 M              | unknown    | unknown             |

[Hosted demo](https://qlever.dev/orkg)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.orkg)
[Dataset](https://orkg.org/api/rdf/dump)

The [Open Research Knowledge Graph (ORKG)](https://orkg.org/) describes research papers mainly from biology and computer science.

## `osm-country`

!!! warning
    Adjust `CONTINENT` and `COUNTRY` to your needs. All available continents and countries can be found at [Geofabrik](https://download.geofabrik.de/).

!!! warning
    The tool [osm2rdf](https://github.com/ad-freiburg/osm2rdf) is required during the dataset preparation.

A template for running an engine with [OpenStreetMap](https://www.openstreetmap.org/) data for a single country. The data model is identical to the [OSM (planet) dataset](#osm-planet).

## `osm-planet`

| Endpoints                                    | Number of triples | Index Size | Time to build index |
| -------------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/osm-planet) | ~204 B            | ~1.5 TB    | ~20 h               |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.osm-planet)

[OpenStreetMap](https://www.openstreetmap.org/) is an open-source map. This is the complete OpenStreetMap planet dataset including nodes, ways and relations. Any query that can be run with [overpass turbo](https://overpass-turbo.eu/) can also be evaluted using this dataset and QLever. The geometries can be queried using [GeoSPARQL](../geosparql.md).

!!! info
    The `osm-planet` config uses a planet dump from <https://osm2rdf.cs.uni-freiburg.de> that has already been converted to RDF with `osm2rdf`. The derived RDF datasets are always up to date. If you require the most current data or want to convert it yourself, use the `osm-planet-from-pbf` config. This will generate the data directly from the latest dump but will require `osm2rdf`.

## `pubchem`

| Endpoints                                 | Number of triples | Index Size | Time to build index |
| ----------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/pubchem) | ~26 B             | ~350 GB    | ~6 h                |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.pubchem)

PubChem is a database of chemical data.

## `scientists`

| Endpoints                                    | Number of triples | Index Size | Time to build index |
| -------------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/scientists) | ~370 M            | unknown    | ~20 s               |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.scientists)

## `uniprot`

| Endpoints                                 | Number of triples | Index Size | Time to build index |
| ----------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/uniprot) | ~240 B            | ~ 3 TB     | ~40 h               |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.uniprot)

[UniProt](https://www.uniprot.org/) is a database of proteins.

## `vvz`

This dataset is used internally and **not publicly available**. The dataset contains information on the teaching (lectures, lecturers, rooms, examination regulations) at the faculty of engineering at the University Freiburg. In the future this dataset will power the [faculties course catalog](https://vvz.tf.uni-freiburg.de).

## `wikidata`

| Endpoints                                  | Number of triples | Index Size | Time to build index |
| ------------------------------------------ | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/wikidata) | ~ 21 B            | ~500 GB    | ~5 h                |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.wikidata)

[Wikidata](https://www.wikidata.org) is a collaborative knowledge base (think Wikipedia for structured data) under the umbrella of the Wikimedia fundation.

## `wikipathways`

| Endpoints                                      | Number of triples | Index Size | Time to build index |
| ---------------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/wikipathways) | unknown           | unknown    | ~20 s               |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.wikipathways)

[Wikipathways](https://www.wikipathways.org/) is a database of biological pathways. The latest snapshot will be used by default. Set `RELEASE` to a snapshot from <https://data.wikipathways.org/> to used a different snapshot.

## `yago-4`

| Endpoints                                | Number of triples | Index Size | Time to build index |
| ---------------------------------------- | ----------------- | ---------- | ------------------- |
| [QLever Demo](https://qlever.dev/yago-4) | ~2.5 B            | unknown    | ~4 h                |

[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.yago-4)

[Yago-4](https://yago-knowledge.org/) is built on [Wikidata](#wikidata) but simplifies the data. The changes to Wikidata include huma-readable identifiers and different classes and properties.
