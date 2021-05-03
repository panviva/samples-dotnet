
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Panviva.Sdk.Models.V3.Get;
using Panviva.Sdk.Services.Core.Domain.QueryModels.V3;
using Panviva.Sdk.Services.Core.Extensions.V3;
using Panviva.Sdk.Services.Core.Handlers.V3;

namespace Samples.Net.GetArtefacts.Download.ConsoleApp
{
    public class Program
    {
        // Store of artefact ids that need to be fetched
        private static List<string> _artefactList = new();

        // Store of artefact ids that have been written to a file 
        private static List<string> _outputList = new();

        // Store the path where the output files will be written
        private static string _outputPath;

        // Application entry point
        private static async Task Main(string[] args)
        {
            // In this region we setup manual Dependency Injection and Host Build for Panviva .Net Sdk
            #region SetupDI

            var builder = new ConfigurationBuilder();
            BuildConfig(builder);

            var host = Host.CreateDefaultBuilder()
                .ConfigureServices((context, services) => 
                { 
                    services.AddPanvivaApis();
                    services.AddScoped<QueryHandler>();
                })
                .Build();

            using var serviceScope = host.Services.CreateScope();
            var queryHandler = serviceScope.ServiceProvider.GetRequiredService<QueryHandler>();

            #endregion

            // Create output folder
            CreateOutputFolder();

            // Build a list of all Artefact IDs
            await GetArtefactListAsync(queryHandler);

            // Get individual artefact
            await foreach(var artefact in GetArtefactsAsync(queryHandler))
            {
                await WriteArtefactToFile(artefact);
            }
        }

        // Create and print the outut folder
        // Note: Ouput is written to {home folder}/get-artefacts/run-id/
        private static void CreateOutputFolder()
        {
            var homeFolder = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            var appName = "get-artefacts";
            var runId = $"run-{DateTime.Now:yyyy-dd-M--HH-mm-ss}";
            _outputPath = Path.Combine(homeFolder, appName, runId);

            try
            {
                Directory.CreateDirectory(_outputPath);
                Console.WriteLine($"Writing files to: {_outputPath}");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred creating directory '{_outputPath}' : {e.Message}");
                throw;
            }
        }

        // Generate a list of all arefact IDs using NLS
        private static async Task GetArtefactListAsync(QueryHandler queryHandler)
        {
            var queryModel = new GetSearchArtefactsQueryModel
            {
                SimpleQuery = "*",
                PageLimit = 1000
            };

            try
            {
                var searchResult = await queryHandler.HandleAsync(queryModel);
                _artefactList.AddRange(searchResult.Results.Select(result => result.Id.ToString()));
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred when calling Panviva APIs : {e.Message}");
                throw;
            }
        }

        // Traverse artefacts & fetch individually
        private static async IAsyncEnumerable<GetArtefactResultModel> GetArtefactsAsync(QueryHandler queryHandler)
        { 
            foreach (var artefactId in _artefactList)
            {
                yield return await GetIndividualArtefactAsync(queryHandler, artefactId);
            }
        }

        // Get artefact payload
        private static async Task<GetArtefactResultModel> GetIndividualArtefactAsync(QueryHandler queryHandler, string id)
        {
            var queryModel = new GetArtefactQueryModel
            {
                Id = id
            };

            return await queryHandler.HandleAsync(queryModel);
        }

        // Write artefact to a json file within output folder
        // Note: Filename is {Artefact Id}.json
        private static async Task WriteArtefactToFile(GetArtefactResultModel artefact)
        {
            var path = Path.Combine(_outputPath, $"{artefact.Id}.json");

            try
            {
                // Save artefact as json file
                var json = JsonConvert.SerializeObject(artefact, Formatting.Indented);
                await File.WriteAllTextAsync(path, json);
                _outputList.Add(artefact.Id.ToString());
                Console.WriteLine($"- Created {_outputList.Count} of {_artefactList.Count} - '{artefact.Id}.json'");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred when writing '{path}' : {e.Message}");
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

