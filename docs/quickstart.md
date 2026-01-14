# Quickstart

In a nutshell: There is a self-documenting command-line
tool `qlever`, which is controlled by a single configuration file, called
`Qleverfile`. For most applications, the `qlever` command-line tool is all you
need to use QLever. [See here for a complete reference of all the possible settings in a `Qleverfile`](qleverfile.md).

## Installation

### Debian and Ubuntu

When using Debian or Ubuntu we recommend using our package repository. In particular, this enables easy updates via your packet manager and tab completion for `bash`, `zsh` and `fish`.

```bash title="Configure the QLever repository"
sudo apt update && sudo apt install -y wget gpg ca-certificates
wget -qO - https://packages.qlever.dev/pub.asc | gpg --dearmor | sudo tee /usr/share/keyrings/qlever.gpg > /dev/null
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/qlever.gpg] https://packages.qlever.dev/ $(. /etc/os-release && echo "$VERSION_CODENAME") main" | sudo tee /etc/apt/sources.list.d/qlever.list
sudo apt update
```

```bash title="Install QLever"
sudo apt install qlever
```

=== "bash"
    ```bash title="Enable tab completion"
    sudo apt install bash-completion
    echo "source /etc/bash_completion" >> ~/.bashrc
    ```
=== "zsh"
    ```zsh title="Enable tab completion"
    echo "autoload -U compinit && compinit" >> ~/.zshrc
    ```
=== "fish"
    ```fish title="Enable tab completion"
    # Nothing to do
    ```

### Mac (Apple Silicon)

```bash title="Install QLever via Homebrew"
brew tap qlever-dev/qlever
brew install qlever
```


### Others

For any of the platforms not listed above you can install the `qever` CLI tool using system indepent methods. Note: QLever will be executed in a container which will come with a performance penalty.

=== "pip"
    ``` bash
    # inside a virtual environment
    pip install qlever
    ```
=== "pipx"
    ``` bash
    pipx install qlever
    ```
=== "uv"
    ```bash
    uv tool install --upgrade qlever
    ```

## Usage

=== "pip"
    ``` bash
    # inside a virtual environment
    qlever setup-config olympics # Get Qleverfile (config file) for this dataset
    qlever get-data              # Download the dataset
    qlever index                 # Build index data structures for this dataset
    qlever start                 # Start a QLever server using that index
    qlever query                 # optional: Launch an example query
    qlever ui                    # optional: Launch the QLever UI
    ```
=== "pipx"
    ``` bash
    qlever setup-config olympics # Get Qleverfile (config file) for this dataset
    qlever get-data              # Download the dataset
    qlever index                 # Build index data structures for this dataset
    qlever start                 # Start a QLever server using that index
    qlever query                 # optional: Launch an example query
    qlever ui                    # optional: Launch the QLever UI
    ```
=== "uv"
    ```bash
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

## Code and further documentation

The code for the `qlever` command-line tool can be found at
<https://github.com/qlever-dev/qlever-control>. There you also find more
information on the usage on macOS and Windows, for usage with your own dataset,
and for developers.
