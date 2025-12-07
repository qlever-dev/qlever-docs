# Update

QLever supports [SPARQL 1.1 Update](https://www.w3.org/TR/sparql11-update/) and the [SPARQL 1.1 Graph Store HTTP Protocol](https://www.w3.org/TR/sparql11-http-rdf-update/) for updating the data at runtime after building an index.

## Configuration

- **Required**: Set an access token. It will be required to execute updates.
    - QLeverfile: Set an access token in the `ACCESS_TOKEN` field in the `[server]` section
    - CLI: Use `-a`/`--access-token` to set an access token or `-n`/`--no-access-check` to disable it
- **Optional**: Persist the updates across restarts
    - QLeverfile: Set `PERSIST_UPDATES` in the `[server]` section
    - CLI: Use `--persist-updates`

## Usage

### SPARQL 1.1 Update

#### QLever UI

1. Insert the access token into the `Access Token` field under the `Backend Information`.
2. Use the editor to write and execute updates. Usage is very similar to queries. Syntax highlighting, formatting and basic autocompletion are available.

#### Manual

SPARQL Update builds on top of HTTP, so you can use your preferred tool to send Updates. If you use an access token, which you should, there are two ways in which it can be provided for updates:

1. As an HTTP query parameter `?access-token={token}`
2. As an HTTP header `Authorization: Bearer {token}`

Here are two examples how an update can be executed using `curl`:

=== "Access token as query parameter"
    ```bash
    curl -X "POST"
         -H "Content-Type: application/sparql-update"
         -d "DELETE WHERE { ?s ?p ?o }"
         "http://localhost:7019?access-token={token}"
    ```
=== "Access token as header"
    ```bash
    curl -X "POST"
         -H "Content-Type: application/sparql-update"
         -H "Authorization: Bearer {token}"
         -d "DELETE WHERE { ?s ?p ?o }"
         "http://localhost:7019"
    ```

### SPARQL 1.1 Graph Store HTTP Protocol

!!! tip

    When sending large files with `curl` you'll want to use `--data-binary @file` instead of `--data @file` or `--data-urlencode @file`. `--data-urlencode` and `--data` both process the input before sending it and thus only work for smaller files before you run into problems.

=== "GET"
    ```bash
    curl -X "GET"
         -H "Accept: text/turtle"
         "http://localhost:7019?graph=http://example.com/person/1.ttl"
    ```
=== "PUT"
    ```bash
    curl -X "PUT"
         -H "Content-Type: text/turtle"
         -H "Authorization: Bearer {token}"
         --data-binary @graph.ttl
         "http://localhost:7019?graph=http://example.com/person/1.ttl"
    ```
=== "DELETE"
    ```bash
    curl -X "DELETE"
         -H "Authorization: Bearer {token}"
         "http://localhost:7019?graph=http://example.com/person/1.ttl"
    ```
=== "POST"
    ```bash
    curl -X "POST"
         -H "Content-Type: text/turtle"
         -H "Authorization: Bearer {token}"
         --data-binary @graph.ttl
         "http://localhost:7019?graph=http://example.com/person/1.ttl"
    ```
=== "HEAD"
    ```bash
    curl -X "HEAD"
         "http://localhost:7019?graph=http://example.com/person/1.ttl"
    ```
