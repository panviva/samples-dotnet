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

namespace Samples.NetCore.GetDocument.Updated.ConsoleApp
{
    class Program
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
            
            // Get this month start
            var fromDate = $"{DateTime.Now.Year}-{DateTime.Now.Month.ToString().PadLeft(2, '0')}-01";

            // Construct Query string
            var queryModel = new GetSearchQueryModel { Term = $"data.attributes.updatedDate:{{{fromDate} TO *}}" };

            object searchResult;

            try
            {
                // Call the Panviva SDK and get responses,
                searchResult = queryHandler.HandleAsync(queryModel).Result;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred when calling Panviva APIs : {e.Message}");
                throw;
            }

            var searchResultAsJson = JsonConvert.SerializeObject(searchResult);
            Console.WriteLine(searchResultAsJson);
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
