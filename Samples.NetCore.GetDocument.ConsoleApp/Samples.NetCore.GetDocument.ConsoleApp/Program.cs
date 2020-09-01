using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Panviva.Sdk.Services.Core.Domain.QueryModels.V3;
using Panviva.Sdk.Services.Core.Extensions.V3;
using Panviva.Sdk.Services.Core.Handlers.V3;

namespace Samples.NetCore.GetDocument.ConsoleApp
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

            object mainDocument;
            object containers;

            try
            {
                // Call the Panviva SDK and get responses,
                mainDocument = queryHandler.HandleAsync(getDocumentQueryModel).Result;
                containers = queryHandler.HandleAsync(getDocumentContainersQueryModel).Result;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred when calling Panviva APIs : {e.Message}");
                throw;
            }

            var mainDocumentAsJson = JsonConvert.SerializeObject(mainDocument);
            var containersAsJson = JsonConvert.SerializeObject(containers);

            var modifiedDocument = JObject.Parse(mainDocumentAsJson);
            modifiedDocument.TryAdd("Containers",JObject.Parse(containersAsJson).Property("Containers")?.Value);

            Console.WriteLine(modifiedDocument.ToString());

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