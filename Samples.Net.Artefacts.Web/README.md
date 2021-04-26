# Samples.Net.Artefacts.Web

A simple `.Net 5` and `React` Web Application that allows you to search and display panviva artefacts.

Following Endpoints are exposed via APIs.

- `GET Search Artefacts`
- `GET Image`

## Prerequisites

### Configure Application

- You will require `instance name` and `API key` from the [previous instructions](../README.md#how-to-get-credentials)

- Change Directory into the `Samples.Net.Artefacts.Web` folder from where this README is contained.

- Entered the acquired credentials in the configuration file (`appsettings.json`)

## Running the Application

```bash
# Assuming you've installed .net runtime SDKs in your environment and you are in correct directory
# run this command in bash
dotnet run
```

## Using the Application

You should be able to interact with the application at [https://localhost:25001/](https://localhost:25001/)

![Panviva Home Page](documentation/home-page.png)

![Panviva Search Results Loading](documentation/search-results-loading.png)

![Panviva Search Results](documentation/search-results.png)

![Panviva Document](documentation/document.png)

> Note: You can check the debug button to view json payloads on the webpage.
