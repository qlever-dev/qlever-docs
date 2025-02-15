# Datasets

qlever-control comes with a number of mostly ready to go datasets. They can be used to get up and running quickly.
This page contains a reference of all pre-configured datasets.

To get running with a dataset first create a Qleverfile for that dataset with `qlever setup-config <dataset key>`. Then download the data, build the index and run the server.

=== "pip"
    ``` bash title="DBLP"
    qlever setup-config dblp
    qlever get-data
    qlever index
    qlever start
    # qlever ui
    ```
=== "pipx"
    ``` bash title="DBLP"
    qlever setup-config dblp
    qlever get-data
    qlever index
    qlever start
    # qlever ui
    ```
=== "uv"
    ```bash title="DBLP"
    uv tool run qlever setup-config dblp
    uv tool run qlever get-data
    uv tool run qlever index
    uv tool run qlever start
    # uv tool run qlever ui
    ```

## DBLP

| Key    | Ready to go?       | Example Queries available? |
| ------ | ------------------ | -------------------------- |
| `dblp` | :white_check_mark: | :white_check_mark:         |

## DBLP Plus

## DBPedia

## DNB

## FBEasy

## Freebase

## IMDB

| Key    | Ready to go?       | Example Queries available? |
| ------ | ------------------ | -------------------------- |
| `imdb` | :white_check_mark: | :white_check_mark:         |

A dataset containing data from the film and series database IMDB. The `basics` and `ratings` datasets from <https://datasets.imdbws.com/> are available in this dataset.

## OHM planet

## Olympics 

| Key        | Ready to go?       | Example Queries available? |
| ---------- | ------------------ | -------------------------- |
| `olympics` | :white_check_mark: | :white_check_mark:         |

A demo dataset with historic data on the olympic winter and summer games.

## ORKG

## OSM (country)

| Key           | Ready to go? | Example Queries available? |
| ------------- | ------------ | -------------------------- |
| `osm-country` | :warning:    | :white_check_mark:         |

!!! warning
    Adjust `CONTINENT` and `COUNTRY` to your needs. All available continents and countries can be found at [Geofabrik](https://download.geofabrik.de/).

!!! warning
    The tool [osm2rdf](https://github.com/ad-freiburg/osm2rdf) is required during the dataset preparation.

The OSM data for some country.


## OSM (planet)

## Pubchem

## Scientists

| Key          | Ready to go?       | Example Queries available? |
| ------------ | ------------------ | -------------------------- |
| `scientists` | :white_check_mark: | :white_check_mark:         |

## Uniprot

## VVZ

!!! failure
    This dataset is used internally and not publicly available.

| Key   | Ready to go? | Example Queries available? |
| ----- | ------------ | -------------------------- |
| `vvz` | :x:          | :white_check_mark:         |

## Wikidata

## Wikipathways

| Key            | Ready to go? | Example Queries available? |
| -------------- | ------------ | -------------------------- |
| `wikipathways` | :warning:    | :white_check_mark:         |

!!! warning
    Adjust `RELEASE` to select which data snapshot to use. The available snapshots are listed at <https://data.wikipathways.org/>.

## YAGO 4

| Key      | Ready to go?       | Example Queries available? |
| -------- | ------------------ | -------------------------- |
| `yago-4` | :white_check_mark: | :white_check_mark:         |
