# Supademo Notes API

## Overview

The Supademo Notes API is part of a Notes API backend service. It is responsible for User creation, User Authentication and CRUD operations on Notes.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Test Url](#test-url)
- [TODO: Improvements](#todo-improvements)
- [Usage](#usage)
  - [Creating a Note](#creating-a-note)
  - [Getting All Notes](#getting-all-notes)
  - [Getting Note By Id](#getting-note-by-id)
  - [Updating a Note](#updating-a-note)
  - [Deleting a Note](#deleting-a-note)
- [Database](#database)
  - [Migrations](#migrations)
  - [Seeding](#seeding)

## Getting Started

### Prerequisites

Before you can run this microservice, ensure you have the following software installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [PostgreSQL](https://www.postgresql.org/) (Database)

### Installation

1. Clone this repository:

   ```shell
   git clone https://github.com/mohammadfarooqi/supademo-notes-api.git
   cd supademo-notes-api
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

### Configuration

1. Create a `.env` file in the project root and configure it with your environment variables. You can use the `.env_sample` file as a reference.

2. Set up your PostgreSQL database and configure the connection details in the `.env` file.

3. Run database migrations and seed data:

   ```shell
   npm run knex:mg:latest
   npm run knex:sd:run
   ```

## Test Url

To test the apis without running and configuring the application locally, you can use the following two URLs:

**For REST API:**

```http
GET https://supademo-demo-api.keenver.com/api/v1
```

## TODO: Improvements

- Implement caching for areas where it makes sense.
- Have a read replica connection where the read queries can be made to split read/write traffic and load.
- Create necessary indexes in database, such as on date.
- Replace authentication with oAuth.
- Implement Rate Limiting to revent abuse.
- Add support for API versioning, ie v1/v2 etc.
- Implement API Documentation using Swagger or something similar.
- Add unit and integration testing.

## Usage

### Creating a Note

To create a new note, make a `POST` request to the `/api/v1/notes` endpoint with the required note data.

**Example:**

```http
POST /api/v1/notes
```

**cURL Example:**

```shell
curl --location 'localhost:8080/api/v1/notes' \
--header 'Authorization: <token>' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Fifth Title",
    "body": "This is a long body for my fifth note."
}'
```

### Getting All Notes

Retrieve a list of all notes by making a `GET` request to the `/api/v1/notes` endpoint. You can also specify pagination and sorting.

**Example:**

```http
GET /api/v1/notes
```

**cURL Example:**

```shell
curl --location 'localhost:8080/api/v1/notes?page=1&pageSize=5&sortByDate=asc' \
--header 'Authorization: <token>'
```

### Getting a Note by Id

To fetch a note by id, make a `GET` request to the `/api/v1/notes/:id` endpoint.

**Example:**

```http
GET /api/v1/notes/:id
```

**cURL Example:**

```shell
curl --location 'localhost:8080/api/v1/notes/1' \
--header 'Authorization: <token>'
```

### Updating a Note

You can update a note by making a `PUT` request to the `/api/v1/notes/:id` endpoint. Supported fields for update include `title` and `body`.

**Example:**

```http
PUT /api/v1/notes/11
```

**cURL Example:**

```shell
curl --location --request PUT 'localhost:8080/api/v1/notes/11' \
--header 'Authorization: <token>' \
--header 'Content-Type: application/json' \
--data '{
        "title": "First Title 123",
        "body": "This is a long body for my first note."
    }'
```

### Deleting a Note

To delete a note, send a `DELETE` request to the `/api/v1/notes/:id` endpoint.

**Example:**

```http
DELETE /api/v1/notes/11
```

**cURL Example:**

```shell
curl --location --request DELETE 'localhost:8080/api/v1/notes/11' \
--header 'Authorization: <token>'
```

## Database

### Migrations

Database migrations are managed using [Knex.js](http://knexjs.org/). Run the following commands to apply migrations and create the necessary database tables:

```shell
npm run knex:mg:latest
```

### Seeding

Seed data can be loaded into the database using the following command:

```shell
npm run knex:sd:run
```
