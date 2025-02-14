# Qleverfile reference

All options can be set in the Qleverfile and overwritten with a CLI parameter.
!!! info
    The parameters in Qleverfiles are all uppercase and separated with underscores. The CLI parameters are all lowercase and separated with dashes.

    Example: The option `GET_DATA_CMD` can be overwritten with `--get-data-cmd`.
    
```ini title="All options and their defaults"
[data]
NAME             =
GET_DATA_CMD     =
DESCRIPTION      = 
TEXT_DESCRIPTION =
FORMAT           = ttl

# TODO
[index]
INPUT_FILES     = *.ttl
CAT_INPUT_FILES = cat ${INPUT_FILES}
SETTINGS_JSON   = { "num-triples-per-batch": 1000000 }

# TODO
[server]
PORT         = 8888
ACCESS_TOKEN = 

[runtime]
SYSTEM           = docker
IMAGE            = docker.io/adfreiburg/qlever:latest
INDEX_CONTAINER  =
SERVER_CONTAINER =

[ui]
UI_PORT      = 8176
UI_CONFIG    = default
UI_SYSTEM    = docker
UI_IMAGE     = docker.io/adfreiburg/qlever-ui
UI_CONTAINER =
```


## Data

The `[data]` sections defines basic information on the dataset being processed.

```ini
[data]
NAME             =
GET_DATA_CMD     =
DESCRIPTION      = 
TEXT_DESCRIPTION =
FORMAT           = ttl
```


### Name

The name of the dataset.

| Required | Qleverfile   | CLI | Default  | Possible Values              |
|----------|----------|---|----------|------------------------------|
| :warning:      | `NAME` | `--name` |  | N/A |

### Get data command

The command to get the data.

| Required | Qleverfile   | CLI | Default  | Possible Values              |
|----------|----------|---|----------|------------------------------|
| :warning:      | `GET_DATA_CMD` | `--get-data-cmd` |  | N/A |

### Description

A concise description of the dataset.

| Required | Qleverfile   | CLI | Default  | Possible Values              |
|----------|----------|---|----------|------------------------------|
| :warning:      | `DESCRIPTION` | `--description` |  | N/A |

### Text Description

A concise description of the additional text data if any.

| Required | Qleverfile   | CLI | Default  | Possible Values              |
|----------|----------|---|----------|------------------------------|
|          | `TEXT_DESCRIPTION` | `--text-description` |  | N/A |

### Format

The format of the data.

| Required | Qleverfile   | CLI | Default  | Possible Values              |
|----------|----------|---|----------|------------------------------|
|          | `FORMAT` | `--format` | `ttl` | `ttl`, `nt`, `nq` |

## `[index]`
## `[server]`
## Runtime
The `[runtime]` section configures how and if the commands are run in a container.

```ini
[runtime]
SYSTEM           = docker
IMAGE            = docker.io/adfreiburg/qlever:latest
INDEX_CONTAINER  =
SERVER_CONTAINER =
```

### System

Whether to run commands natively or in a container, and if in a container, which system to use.

| Required | Qleverfile   | CLI | Default  | Possible Values              |
|----------|----------|---|----------|------------------------------|
|          | `SYSTEM` | `--system` | `docker` | `docker`, `podman`, `native` |

#### Possible Values
- `docker` Run in [docker](https://www.docker.com/)
- `podman` Run in [podman](https://podman.io/)
- `native` Run natively (qlever must be installed and in the path), see also [Server Binary](#server-binary) and [Index Binary](#index-binary)

### Image

The name of the container image when running in a container.

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `IMAGE`  | `--image` |  `docker.io/adfreiburg/qlever` | N/A             |

### Index Container

The name of the container used by `qlever index`.

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `INDEX_CONTAINER` | `--index-container`  |  | N/A             |

### Server Container

The name of the container used by `qlever start`.

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `SERVER_CONTAINER`  | `--server-container` |  | N/A             |

## UI
The `[ui]` section configures the qlever-ui started with `qlever ui`.

```ini
[ui]
UI_PORT      = 8176
UI_CONFIG    = default
UI_SYSTEM    = docker
UI_IMAGE     = docker.io/adfreiburg/qlever-ui
UI_CONTAINER = 
```

### UI port

The port of the Qlever UI when running `qlever ui`.

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `UI_PORT`  | `--ui-port` | 8176 | Ports             |

### UI config

The name of the backend configuration for the QLever UI (this determines autocomplete queries and example queries).

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `UI_CONFIG`  | `--ui-config` | `default` | TODO            |

### UI System

Which container system to use for `qlever ui`. Unlike for `qlever index` and `qlever start`, `native` is not yet supported here.

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `UI_SYSTEM`  | `--ui-system` | `docker` | `docker`, `podman`             |

### UI Image

The name of the image used for `qlever ui`.

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `UI_IMAGE`  | `--ui-image` | `docker.io/adfreiburg/qlever-ui` | N/A            |


### UI Container

The name of the container used for `qlever ui`.

| Required | Qleverfile   | CLI | Default                       | Possible Values |
|----------|----------|---|-------------------------------|-----------------|
|          | `UI_CONTAINER`  | `--ui-container` |  | N/A            |


---

## Landfill

| Required | Option | Description |
|---|---|---|
| :white_check_mark: | `NAME` | The name of the dataset |
| :white_check_mark: | `GET_DATA_CMD` | Command to download the data |
| :white_check_mark: | `DESCRIPTION` | A concsie description of the dataset |
| :white_check_mark: | `FORMAT` | Format of the data (default: `ttl`, allowed: `ttl`, `nt`, `nq`) |

| Required | Option | Default | Description |
|---|---|---|---|
| :white_check_mark: | `SYSTEM` | `docker` | Whether to run natively or in a container |
| :white_check_mark: | `IMAGE` | `docker.io/adfreiburg/qlever` | Container image to use |
| :white_check_mark: | `INDEX_CONTAINER` | | Name of the container used for indexing (`qlever index`) |
| :white_check_mark: | `SERVER_CONTAINER` | | Name of the main container (`qlever start`) |

