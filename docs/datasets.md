# Datasets

qlever-control comes with a number of (mostly) ready to go datasets. They can be used to get up and running quickly.
This page contains a reference of all pre-configured datasets.

To get running with a dataset first create a Qleverfile for that dataset with `qlever setup-config <dataset key>`. Then download the data, build the index and run the server as described in the [quickstart](../quickstart.md)

## ToDo

- DBLP Plus is no longer running
- [Yago 3](https://qlever.dev/yago-3) is available on <qlever.dev> but has no QLeverfile
- [Wikimedia Commons](https://qlever.dev/wikimedia-commons) is available on <qlever.dev> but has no QLeverfile

## DBLP

| Key    | Number of triples | Index Size | Time to build index |
| ------ | ----------------- | ---------- | ------------------- |
| `dblp` | ~1.5 B            | ~25 GB     | ~30 min             |

[Hosted demo](https://qlever.dev/dblp)  
[Official SPARQL endpoint (QLever)](https://sparql.dblp.org/)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.dblp)

[DBLP](https://dblp.org/) is a computer science bibliography. This dataset contains the DBLP dataset with citations from [OpenCitations](https://opencitations.net/).

## DBLP Plus

?

## DBPedia

| Key       | Number of triples | Index Size | Time to build index |
| --------- | ----------------- | ---------- | ------------------- |
| `dbpedia` | ~845 M            | N/A     | ~20 min             |

[Hosted demo](https://qlever.dev/dbpedia)  
[Official SPARQL endpoint (YASGUI)](https://databus.dbpedia.org/sparql)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.dbpedia)  
[Dataset](https://databus.dbpedia.org/dbpedia/collections/latest-core)

The [DBpedia](https://databus.dbpedia.org/) dataset contains information extracted from the structured Wikipedia elements like the infoboxes.

## DNB

| Key    | Number of triples | Index Size | Time to build index |
| ------ | ----------------- | ---------- | ------------------- |
| `dnb`  | ~1.5 B            | N/A        | ~5 min              |

[Hosted demo](https://qlever.dev/dnb)  
[Official SPARQL endpoint (QLever)](https://sparql.dnb.de/)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.dnb)

The [German National Library (DNB)](https://www.dnb.de/EN/Home/home_node.html) is the central archival library for Germany. The dataset contains information on the publications in the DNB's inventory.

## FBEasy

| Key       | Number of triples | Index Size | Time to build index |
| --------- | ----------------- | ---------- | ------------------- |
| `fbeasy`  | ~362 M            | N/A        | ~10 min             |

[Hosted demo](https://qlever.dev/fbeasy)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.fbeasy)

FBEasy is a simplified and cleaned version of the [Freebase dataset](#freebase).

## Freebase

| Key         | Number of triples | Index Size | Time to build index |
| ----------- | ----------------- | ---------- | ------------------- |
| `freebase`  | ~3.1 B            | N/A        | ~4 min              |

[Hosted demo](https://qlever.dev/freebase)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.freebase)

## IMDb

| Key        | Number of triples | Index Size | Time to build index |
| ---------- | ----------------- | ---------- | ------------------- |
| `imdb`     | ~382 M            | ~20 MB     | ~5 m                |

[Hosted demo](https://qlever.dev/imdb)  

A dataset containing basic movie and ratings information from the film and series database [IMDb](https://www.imdb.com/). The dataset is available at <https://datasets.imdbws.com/>.

## OHM planet

| Key          | Number of triples | Index Size | Time to build index |
| ------------ | ----------------- | ---------- | ------------------- |
| `ohm-planet` | ~5.8 B            | ~60 GB     | ~1 h                |

[Hosted demo](https://qlever.dev/ohm-planet)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.ohm-planet)

!!! warning
    The tool [osm2rdf](https://github.com/ad-freiburg/osm2rdf) is required during the dataset preparation.

The [OpenHistoricalMap](https://www.openhistoricalmap.org/) is a OpenStreeMap like dataset of the world throughout history. The data modelling is similar to the OSM datasets.

## Olympics (`olympics`)

| Key        | Number of triples | Index Size | Time to build index |
| ---------- | ----------------- | ---------- | ------------------- |
| `olympics` | ~1.8 M            | ~20 MB     | ~10 s               |

[Hosted demo](https://qlever.dev/olympics)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.olympics)

A demo dataset with historic data on the olympic winter and summer games from Athens 1896 to Rio 2016. More information can be found in the [repository of this dataset](http://github.com/wallscope/olympics-rdf).

## ORKG

| Key    | Number of triples | Index Size | Time to build index |
| ------ | ----------------- | ---------- | ------------------- |
| `orkg` | ~3 M              | unknown    | unknown             |

[Hosted demo](https://qlever.dev/orkg)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.orkg)
[Dataset](https://orkg.org/api/rdf/dump)

The [Open Research Knowledge Graph (ORKG)](https://orkg.org/) describes research papers mainly from biology and computer science.

## OSM (country)

| Key           | Number of triples | Index Size | Time to build index |
| ------------- | ----------------- | ---------- | ------------------- |
| `osm-country` | depends           | depends    | depends             |

!!! warning
    Adjust `CONTINENT` and `COUNTRY` to your needs. All available continents and countries can be found at [Geofabrik](https://download.geofabrik.de/).

!!! warning
    The tool [osm2rdf](https://github.com/ad-freiburg/osm2rdf) is required during the dataset preparation.

Similar to the [OSM (planet) dataset](#osm-planet) except that it only contains the data for a single country.

## OSM (planet)

| Key          | Number of triples | Index Size | Time to build index |
| ------------ | ----------------- | ---------- | ------------------- |
| `osm-planet` | ~204 B            | ~1.5 TB    | ~20 h               |

[Hosted demo](https://qlever.dev/osm-planet)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.osm-planet)

[Openstreetmap](https://www.openstreetmap.org/) is an open-source map. This is the complete OpenStreetMap planet dataset including nodes, ways and relations. Any query that can be run with [overpass turbo](https://overpass-turbo.eu/) can also be evaluted using this dataset and QLever. The geometries can be queried using [GeoSPARQL](../geosparql.md).

!!! info
    The `osm-planet` config uses a planet dump from <https://osm2rdf.cs.uni-freiburg.de> that has already been converted to RDF with `osm2rdf`. The derived RDF datasets are always up to date. If you require the most current data or want to convert it yourself, use the `osm-planet-from-pbf` config. This will generate the data directly from the latest dump but will require `osm2rdf`.

## PubChem

| Key          | Number of triples | Index Size | Time to build index |
| ------------ | ----------------- | ---------- | ------------------- |
| `pubchem`    | ~26 B             | ~350 GB    | ~6 h                |

[Hosted demo](https://qlever.dev/pubchem)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.pubchem)

PubChem is a database of chemical data.

## Scientists

| Key          | Number of triples | Index Size | Time to build index |
| ------------ | ----------------- | ---------- | ------------------- |
| `scientists` | ~370 M            | unknown    | ~20 s               |

[Hosted demo](https://qlever.dev/scientists)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.scientists)

## UniProt

| Key          | Number of triples | Index Size | Time to build index |
| ------------ | ----------------- | ---------- | ------------------- |
| `uniprot`    | ~240 B            | ~ 3 TB     | ~40 h               |

[Hosted demo](https://qlever.dev/uniprot)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.uniprot)

[UniProt](https://www.uniprot.org/) is a database of proteins.

## VVZ

| Key          | Number of triples | Index Size | Time to build index |
| ------------ | ----------------- | ---------- | ------------------- |
| `vvz`        | N/A               | N/A        | N/A                 |

This dataset is used internally and **not publicly available**. The dataset contains information on the teaching (lectures, lecturers, rooms, examination regulations) at the faculty of engineering at the University Freiburg. In the future this dataset will power the [faculties course catalog](https://vvz.tf.uni-freiburg.de).

## Wikidata

| Key          | Number of triples | Index Size | Time to build index |
| ------------ | ----------------- | ---------- | ------------------- |
| `wikidata`   | ~ 21 B            | ~500 GB    | ~5 h                |

[Hosted demo](https://qlever.dev/wikidata)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.wikidata)

[Wikidata](https://www.wikidata.org) is a collaborative knowledge base (think Wikipedia for structured data) under the umbrella of the Wikimedia fundation.

## Wikipathways

| Key            | Number of triples | Index Size | Time to build index |
| -------------- | ----------------- | ---------- | ------------------- |
| `wikipathways` | unknown           | unknown    | ~20 s               |

[Hosted demo](https://qlever.dev/wikipathways)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.wikipathways)

[Wikipathways](https://www.wikipathways.org/) is a database of biological pathways. The latest snapshot will be used by default. Set `RELEASE` to a snapshot from <https://data.wikipathways.org/> to used a different snapshot.

## YAGO 4

| Key            | Number of triples | Index Size | Time to build index |
| -------------- | ----------------- | ---------- | ------------------- |
| `yago-4`       | ~2.5 B            | unknown    | ~4 h                |

[Hosted demo](https://qlever.dev/yago-4)  
[Qleverfile](https://github.com/qlever-dev/qlever-control/blob/main/src/qlever/Qleverfiles/Qleverfile.yago-4)

[Yago-4](https://yago-knowledge.org/) is built on [Wikidata](#wikidata) but simplifies the data. The changes to Wikidata include huma-readable identifiers and different classes and properties.
