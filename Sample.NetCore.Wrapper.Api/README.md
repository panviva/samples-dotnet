# Sample.NetCore.Wrapper.Api

A simple .Net Core API to show how to use Panviva .Net SDK to GET and POST content to Panviva's APIs.

Following Endpoints are used in this sample wrapper API.

- `GET Search`
- `GET Search Artefacts`
- `GET Document Containers`
- `GET Document Containers Relationships`
- `GET Image`

- `POST Live CSH`
- `POST Live Search`
- `POST Live Document`

## Prerequisites

### Configure Application

- You will require `instance name` and `API key` from the [previous instructions](../README.md#how-to-get-credentials)

- Change Directory into the `Sample.NetCore.Wrapper.Api` folder from where this README is contained.

- Entered the acquired credentials in the configuration file (`appsettings.json`)

## Running the Application

```bash
# Assuming you've installed .net runtime SDKs in your environment and you are in correct directory
# run this command in bash
dotnet run
```

## Using the Application

Explore APIs via Swagger at [https://localhost:5001/swagger](https://localhost:5001/swagger)

![Panviva Controller](documentation/swagger.png)

or Go to url : https://localhost:5001/api/panviva/{Routes}

> Example : https://localhost:5001/api/panviva/search/\*
