# Quickstart

In a nutshell: There is a self-documenting command-line
tool `qlever`, which is controlled by a single configuration file, called
`Qleverfile`. For most applications, the `qlever` command-line tool is all you
need to use QLever. [See here for a complete reference of all the possible settings in a `Qleverfile`](qleverfile.md).

## Installation

### Debian and Ubuntu

When using Debian or Ubuntu we recommend using our package repository. Installing QLever natively as a package has the advantages that it has no performance penalty compared to running in Docker, you get easy updates through your packet manager and shell completions for bash, zsh and fish.

```bash title="Configure the QLever repository"
# Install the repositories signing key
sudo apt update && sudo apt install -y wget gpg ca-certificates
wget -qO - https://packages.qlever.dev/pub.asc | gpg --dearmor | sudo tee /usr/share/keyrings/qlever.gpg > /dev/null
# Add the repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/qlever.gpg] https://packages.qlever.dev/ $(. /etc/os-release && echo "$VERSION_CODENAME") main" | sudo tee /etc/apt/sources.list.d/qlever.list
# Fetch the available packages from the repository
sudo apt update
```

```bash title="Install QLever"
sudo apt install qlever
```

=== "bash"
    ```bash title="Enable completions"
    sudo apt install bash-completions
    echo ". /usr/share/bash-completion/bash_completion" >> ~/.bashrc
    # To enable system wide completion remove the comments from the completions block in /etc/bash.bashrc
    ```
=== "zsh"
    ```zsh title="Enable completions"
    echo "autoload -U compinit && compinit" >> ~/.zshrc
    ```
=== "fish"
    ```fish title="Enable completions"
    # Nothing to do
    ```

### Mac

Download and install the latest native version from the [QLever Releases on Github](https://github.com/ad-freiburg/qlever/releases).

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
