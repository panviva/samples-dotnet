using System;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Panviva.Sdk.Services.Core.Domain.QueryModels.V3;
using Panviva.Sdk.Services.Core.Extensions.V3;
using Panviva.Sdk.Services.Core.Handlers.V3;

namespace Samples.NetCore.GetDocumentAsPlainText.ConsoleApp
{
    internal class Program
    {
        private static void Main(string[] args)
        {

            // In this region we setup manual Dependency Injection and Host Build for Panviva .Net Sdk
            #region SetupDI

            var builder = new ConfigurationBuilder();
            BuildConfig(builder);

            var host = Host.CreateDefaultBuilder()
                .ConfigureServices((context, services) => { services.AddPanvivaApis(); })
                .Build();

            var queryHandler = ActivatorUtilities.CreateInstance<QueryHandler>(host.Services);
            #endregion

            // TODO : Change this id to match your requirement
            // str | A document unique identifier, Document ID. If a document is a translated document, this value represents Internal ID or IID in Panviva API v1.
            var documentId = "469";

            var getDocumentQueryModel = new GetDocumentQueryModel { Id = documentId };
            var getDocumentContainersQueryModel = new GetDocumentContainersQueryModel { Id = documentId };
            var getDocumentTranslationsQueryModel = new GetDocumentTranslationsQueryModel { Id = documentId };

            object mainDocument;
            object containers;
            object translations;

            try
            {
                // Call the Panviva SDK and get responses,
                mainDocument = queryHandler.HandleAsync(getDocumentQueryModel).Result;
                containers = queryHandler.HandleAsync(getDocumentContainersQueryModel).Result;
                translations = queryHandler.HandleAsync(getDocumentTranslationsQueryModel).Result;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred when calling Panviva APIs : {e.Message}");
                throw;
            }

            var mainDocumentAsJson = JsonConvert.SerializeObject(mainDocument);
            var containersAsJson = JsonConvert.SerializeObject(containers);
            var translationsAsJson = JsonConvert.SerializeObject(translations);

            var cleanedMainDocument = JObject.Parse(mainDocumentAsJson);
            cleanedMainDocument.Property("Links")?.Remove();

            Console.WriteLine($"---- Details of the Document '{documentId}' ----");

            PrintJson(cleanedMainDocument);
            PrintJson(JObject.Parse(containersAsJson));
            PrintJson(JObject.Parse(translationsAsJson));
        }

        private static void PrintJson(JObject jsonJObject)
        {
            foreach (var pair in jsonJObject)
            {
                var val = (pair.Value == null) ||
                          (pair.Value.Type == JTokenType.Array && !pair.Value.HasValues) ||
                          (pair.Value.Type == JTokenType.Object && !pair.Value.HasValues) ||
                          (pair.Value.Type == JTokenType.String && pair.Value.ToString() == String.Empty) ||
                          (pair.Value.Type == JTokenType.Null) ? "Null" : pair.Value ;

                Console.WriteLine("{0}: {1}", pair.Key, val);
            }
        }

        private static void BuildConfig(IConfigurationBuilder builder)
        {
            builder.SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile(
                    $"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json",
                    true)
                .AddEnvironmentVariables();
        }
    }
}