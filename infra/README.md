# Infrastructure

Configuration to run the project with Docker.

## Usage

1.  **Setup Environment**

    Copy `.env.example` to `.env` within this (`infra/`) directory and fill in your values.

    ```bash
    cp .env.example .env
    ```

2.  **Navigate to Infrastructure Directory**

    ```bash
    cd infra
    ```

3.  **Run Application**

    To start all services (app, database, proxy) in the background:

    ```bash
    docker compose up -d
    ```

4.  **Stop Application**

    ```bash
    docker compose down
    ```