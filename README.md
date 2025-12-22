# Qlever Docs

This is the repository for the documentation of [QLever](https://github.com/ad-freiburg/qlever), an RDF graph database implementing the RDF and SPARQL standards, and its accompanying tools. View the documentation at <https://docs.qlever.dev>.

## Developing locally

1. Clone this repo
2. Setup a virtual environment with `uv venv` or `python3 -m venv .venv` and activate it with `. .venv/bin/activate`
3. Install the dependencies with `uv sync` or `pip install -e .`
4. Run the development server with `mkdocs serve -a 0.0.0.0:<port>`
