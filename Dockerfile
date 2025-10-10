FROM squidfunk/mkdocs-material AS build

COPY . /docs
RUN pip install -e .
RUN mkdocs build --site-dir /site

FROM nginx:alpine-slim AS server
COPY --from=build /site /usr/share/nginx/html