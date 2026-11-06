FROM squidfunk/mkdocs-material AS build

COPY pyproject.toml /docs
RUN pip install -e .
COPY . /docs
RUN --mount=type=secret,id=MKDOCS_GIT_COMMITTERS_APIKEY,env=MKDOCS_GIT_COMMITTERS_APIKEY mkdocs build --site-dir /site

FROM nginx:alpine-slim AS server
# Send relative redirects (e.g. `/quickstart` -> `/quickstart/`); absolute ones
# would use the internal hostname and `http` behind the reverse proxy
RUN echo "absolute_redirect off;" > /etc/nginx/conf.d/redirect.conf
COPY --from=build /site /usr/share/nginx/html