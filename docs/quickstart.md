# Quickstart

In a nutshell: There is a self-documenting command-line
tool `qlever`, which is controlled by a single configuration file, called
`Qleverfile`. For most applications, the `qlever` command-line too is all you
need to use QLever. [See here for a complete reference of all the possible settings in a `Qleverfile`](/qleverfile/).

## Installation

=== "pip"
    ``` bash title="Olympics"
    # inside a virtual environment
    pip install qlever
    ```
=== "pipx"
    ``` bash title="Olympics"
    pipx install qlever
    ```
=== "uv"
    ```bash title="Olympics"
    uv tool install --upgrade qlever
    ```

## Usage

=== "pip"
    ``` bash title="Olympics"
    # inside a virtual environment
    qlever setup-config olympics # Get Qleverfile (config file) for this dataset
    qlever get-data              # Download the dataset
    qlever index                 # Build index data structures for this dataset
    qlever start                 # Start a QLever server using that index
    qlever query                 # optional: Launch an example query
    qlever ui                    # optional: Launch the QLever UI
    ```
=== "pipx"
    ``` bash title="Olympics"
    qlever setup-config olympics # Get Qleverfile (config file) for this dataset
    qlever get-data              # Download the dataset
    qlever index                 # Build index data structures for this dataset
    qlever start                 # Start a QLever server using that index
    qlever query                 # optional: Launch an example query
    qlever ui                    # optional: Launch the QLever UI
    ```
=== "uv"
    ```bash title="Olympics"
    uvx qlever setup-config olympics # Get Qleverfile (config file) for this dataset
    uvx qlever get-data              # Download the dataset
    uvx qlever index                 # Build index data structures for this dataset
    uvx qlever start                 # Start a QLever server using that index
    uvx qlever query                 # optional: Launch an example query
    uvx qlever ui                    # optional: Launch the QLever UI
    ```

This will create a SPARQL endpoint for the 120 Years of Olympics dataset. It is a great dataset for getting started because it is small, but not trivial (around 2 million triples), and the downloading and indexing should only take a few seconds.

Each command will also show you the command line it uses. That way you can learn, on the side, how QLever works internally. If you just want to know the command line for a particular command, without executing it, you can append `--show` like this:

```bash
qlever index --show
```

There are many more commands and options, see `qlever --help` for general help, `qlever <command> --help` for help on a specific command, or just use the autocompletion.
