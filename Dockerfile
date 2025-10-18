FROM squidfunk/mkdocs-material AS build

COPY pyproject.toml /docs
RUN pip install -e .
COPY . /docs
RUN --mount=type=secret,id=MKDOCS_GIT_COMMITTERS_APIKEY,env=MKDOCS_GIT_COMMITTERS_APIKEY mkdocs build --site-dir /site

FROM nginx:alpine-slim AS server
COPY --from=build /site /usr/share/nginx/html