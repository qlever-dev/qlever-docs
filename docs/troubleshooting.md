# Troubleshooting

## The index build crashes at `Merging partial vocabularies ...`

One of the last lines in the log is then `Finished writing compressed internal
vocabulary, size = 0 B [uncompressed = 0 B, ratio = 100%]`. This happens when
the `STXXL_MEMORY` divided by number of batches is too small. The number of
batches is the total number of triples divided by `"num-triples-per-batch"`.
Hence either increase `STXXL_MEMORY` or `"num-triples-per-batch"` in
`SETTINGS_JSON`, or both.
