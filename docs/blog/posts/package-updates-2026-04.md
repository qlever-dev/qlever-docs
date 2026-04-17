---
date: 2026-04-13
links:
  - quickstart.md
---

# QLever package updates 04-2026

## `qlever` package for Ubuntu Jammy

The `qlever` (as well as `qlever-bin` and `qlever-control`) packages are now available for Ubuntu Jammy 22.04. Simply follow the [quickstart](../../quickstart.md).

*Note*: supporting Jammy is more complex due to the old packages in the release. The `qlever` packages for Jammy might be discontinued before Jammy's EOL in March 2027.

## Package for `qlever-ui`

[`qlever-ui`](https://qlever.dev) ([Repo](https://github.com/qlever-dev/qlever-ui)) is now available as a package for Ubuntu[^1] and Debian[^2]. `qlever-ui` is our current UI for interacting with QLever. Note: we're also almost finished building a new UI, `qlue-ui` (see below), which will be released shortly.

## Package for `qlue-ui`

[`qlue-ui`](https://ui.qlever.dev) is now available as a package for for Ubuntu[^1] and Debian[^2]. `qlue-ui` is our new SPARQL UI built completely from the ground up. Qlue-UI features an editor with more and more robust features, can be used with any SPARQL engine and features a new modern look.

*Note*: Qlue-UI is not quite finished yet and still a preview. If you have feedback please do open an Issue in [the repository](https://github.com/qlever-dev/qlue-ui).

## Package for `qlever-petrimaps`

[`qlever-petrimaps`](https://github.com/ad-freiburg/qlever-petrimaps) is now available as a package for Ubuntu[^1] and Debian[^2]. `qlever-petrimaps` is for interactive visualization of SPARQL query results with geospatial information on map, either as individual objects or as a heatmap. It is built for easy usage with `qlever` and `qlever-ui`.

[^1]: Ubuntu 25.10 Questing, 25.04 Plucky, 24.04 Noble and 22.04 Jammy
[^2]: Debian 12 Bookworm and 13 Trixie
