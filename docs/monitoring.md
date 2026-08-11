# Monitoring

!!! info "History"
    - Added in QLever 0.6.0

QLever provides ^^metrics^^ in the [Prometheus Text Format](https://prometheus.io/docs/instrumenting/exposition_formats/#prometheus-text-format) at the standard path `/metrics` on the main server port. The metrics endpoint is disabled by default and has to be enabled with `--enable-metrics`. Accessing it requires the access token.  
`/ping` can be used as a ^^healthcheck^^ endpoint. It returns `200` whenever QLever is up and running. A dedicated healthcheck endpoint is not available.

## Available metrics

**Note:** the metrics are subject to change.

See also the integrated documentation in the metrics response for the available metrics.

- `qlever_memory_cache_limit_bytes` and `qlever_memory_query_limit_bytes` the memory limits defined for the cache and query processing with `--cache-max-size` and `--memory-max-size`.
- `qlever_memory_cache_used_bytes` and `qlever_memory_query_available_bytes` how much of the respective memory limit is available.
- `qlever_http_errors_total` number of errors processing HTTP requests. These are errors if the request isn't SPARQL or it hasn't been identified as SPARQL at the time of the error.
- `qlever_sparql_operation_errors_total` number of errors processing a SPARQL operation. The label `type` indicates the type of error (syntax, timeout, etc.).
- `qlever_sparql_operation_duration_milliseconds_*` histogram for the execution time of SPARQL operations. Label `operation` indicates query or update.
- `qlever_sparql_operation_started_total`, `qlever_sparql_operation_running` and `qlever_sparql_operation_finished_total` number of started, running and finished SPARQL operations. Label `operation` indicates query or update.
- `qlever_delta_triples` number of updated triples relative to the base index.
- `qlever_server_start_time_seconds` UNIX timestamp when the server was started.
- `qlever_index_load_time_seconds` UNIX timestamp when the index was loaded. This might be different from the server start time e.g. when the index was [rebuilt](rebuild-index.md).
- `qlever_index_rebuild_in_progress` whether an [index rebuild](rebuild-index.md) is in progress.
- `qlever_io_context_max_handlers` number of worker threads specified with `--num-simultaneous-queries`.
- `qlever_io_context_running_handlers` number of worker threads that are currently running.
- `qlever_io_context_handler_latency` histogram of the worker thread latency (time between work being available and started).
- `qlever_build_info` Node exporter style metadata. Contains metadata on the binary like version, compile time and used compiler.

## Usage

Collecting metrics for QLever is very easy if you already have a monitoring stack. Enable the metrics endpoint and collect the metrics. For Prometheus it is as simple as adding this job to the config:

```yaml title="Prometheus collection configuration"
  - job_name: "qlever"
    static_configs:
      - targets: ["qlever:7001"]
        labels:
          hostname: qlever
          dataset: wikidata
    authorization:
      credentials: my_access_token
```

For visualization of the metrics you can start with our [Grafana Dashboard template](https://grafana.com/grafana/dashboards/25577-qlever-metrics/).

## Monitoring the dataset

There may also be cases where you want to monitor something specific to a dataset that is in the data itself.

!!! example
    We run a [Wikidata endpoint](https://qlever.dev/wikidata) which we keep up to date. The data usually is less than 1 minute old. The timestamp of the data is contained as a triple in the data itself.

    ```sparql {data-demo-engine="wikidata"}
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX schema: <http://schema.org/>
    SELECT ?updates_complete_until {
      wikibase:Dump wikibase:updatesCompleteUntil ?updates_complete_until
    }
    ORDER BY DESC(?updates_complete_until)
    LIMIT 1
    ```

In such cases it is not fitting to expose these metrics, that are specific to individual datasets, through QLever. For these use cases you can use [sparql-prometheus-exporter](https://github.com/Qup42/sparql-prometheus-exporter). It is an adapter that is configured with SPARQL queries and re-formats the results for Prometheus.
