# Qlever Docs

This is the repository for the documentation of [QLever](https://github.com/ad-freiburg/qlever), an RDF graph database implementing the RDF and SPARQL standards, and its accompanying tools. View the documentation at <https://docs.qlever.dev>.

## Developing locally

1. Clone this repo
2. Setup a virtual environment with `uv venv` or `python3 -m venv .venv` and activate it with `. .venv/bin/activate`
3. Install the dependencies with `uv sync` or `pip install -e .`
4. Run the development server with `mkdocs serve -a 0.0.0.0:<port>`

## Writing documentation

The documentation is written as [Markdown](https://www.markdownlang.com/cheatsheet/) with some extensions. See the existing documentation as an example for how markdown works.

- [Admonitions](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) (sometimes called call-outs) are available. For example

  ````markdown
  ??? warning "Optional Title"

      Content of the warning. **Markdown allowed.**
  ````

- For `SPARQL` code blocks we have a custom extension which adds a play button to execute the query on <https://qlever.dev>. Set the attribute `data-demo-engine` to the slug of the dataset against which the query should be executed.

  ````markdown
  ```sparql {data-demo-engine="osm-planet"}
  SELECT * WHERE {
    ?s ?p ?o
  }
  ```
  ````
