FROM launcher.gcr.io/google/nodejs
# same as
# FROM gcr.io/google-appengine/nodejs


RUN apt-get update && apt-get install software-properties-common -y
RUN unlink /usr/bin/python
RUN ln -sv /usr/bin/python3.5 /usr/bin/python
RUN python -V
RUN python3 -V

# Copy application code.
COPY . /app/

# Install dependencies.
RUN npm --unsafe-perm install