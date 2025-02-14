Categories of solutions:
1. general purpose static site generators with a suitable theme ([Jekyll](https://jekyllrb.com/), [Hugo](https://gohugo.io/)/[Doks](https://getdoks.org/)/[Hextra](https://imfing.github.io/hextra/)/[Hugoblox Documentation Template](https://hugoblox.com/templates/details/docs/)/[Docsy](https://www.docsy.dev/)/[Lotus Docs](https://lotusdocs.dev/)/[More](https://gethugothemes.com/hugo-documentation-themes))
2. documentation tools built on JS frameworks ([Docusaurus](https://docusaurus.io/docs)/[React](https://react.dev/), [VitePress](https://vitepress.dev/)/[Vue](https://vuejs.org/), [Docz (discontinued)](https://github.com/pedronauck/docz/)/[Gatsby](https://www.gatsbyjs.com/))
3. purpose built solutions ([MkDocs](https://www.mkdocs.org/)/[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/), [Gitbook](https://www.gitbook.com/))

I propose using [MkDocs](https://www.mkdocs.org/) with the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) framework.
- MkDocs is a python based markdown static site generator with a focus on build documentation.
- Material for MkDocs is a framework on top of MkDocs for building documentations. Content is written in markdown. Configuration is done in a YAML file.

I think that this will provide more than enough features for us, without needing to much initial setup and we're still flexible, because the content is written in markdown.

Some Pros and Cons:
- easy to begin (!) and use
- large amount and diversity of features; most likely more than we'll ever need
- good [documentation](https://squidfunk.github.io/mkdocs-material/getting-started/)
- actively developed with some money behind it
- hard to extend beyond provided features
