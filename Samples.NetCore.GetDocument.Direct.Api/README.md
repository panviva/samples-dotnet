# Samples.NetCore.GetDocument.Direct.Api
A simple .Net Core API to show how to get and combine the metadata and content of a document from Panviva's APIs, utilizing `GET Document` , `GET Document Containers` and `GET Document Translations`

## Prerequisites

### Configure Application

- You will require `instance name` and `API key` from the [previous instructions](../README.md#how-to-get-credentials)

- Change Directory into the `Samples.NetCore.GetDocument.Direct.Api` folder from where this README is contained.

- Entered the acquired credentials in the configuration file (`appsettings.json`)

## Running the Application

```bash
# Assuming you've installed .net runtime SDKs in your environment
dotnet run
```

## Using the Application
Go to url : https://localhost:5001/api/document/{YourDocumetId}
> Example : https://localhost:5001/api/document/469