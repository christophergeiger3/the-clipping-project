# API

The API for The Clipping Project is built using the [NestJS](https://nestjs.com/) framework.

Please see the main `README.md` file at the root of the project for instructions on how to launch the API.
With Docker, the API and database can be launched in isolation via `docker compose up api`.

### API Documentation

Documentation for each endpoint of the API is located at `/api` (default location: http://localhost:4190/api).
This page should give you a rough sense of how the API works. You can also use the page to manually query each endpoint, which is useful for development and testing.

### Modifying the API
After the API has been modified, the web client's request utility must also be updated.
To do this, make sure `orval` is installed:
```
npm install -g orval
```
and run it in the `/web` folder:
```
cd ../web
orval
```
