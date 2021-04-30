
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

            // Create output folder
            CreateOutputFolder();

            // Build a list of all Artefacts
            GetArtefactList(queryHandler);

            // Get individual artefact
            GetArtefacts(queryHandler);
        }

        // Create and print the outut folder
        // Note: Ouput is written to {home folder}/get-artefacts/run-id/
        private static void CreateOutputFolder()
        {
            var _homeFolder = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            var _appName = "get-artefacts";
            var _runId = $"run-{DateTime.Now.ToString("yyyy-dd-M--HH-mm-ss")}";
            _outputPath = Path.Combine(_homeFolder, _appName, _runId);

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

        // Traverse artefacts & fetch individually
        private static void GetArtefacts(QueryHandler queryHandler)
        { 
            _artefactList.ToList().ForEach(a =>
            {
                GetIndividualArtefact(queryHandler, a);
            });
        }

        // Get artefact payoad
        private static void GetIndividualArtefact(QueryHandler queryHandler, string id)
        {
            var queryModel = new GetArtefactQueryModel
            {
                Id = id
            };

            var searchResult = queryHandler.HandleAsync(queryModel).Result;

            WriteArtefactToFile(searchResult);
        }

        // Write artefact to a json file within output folder
        // Note: Filename is {Artefact Id}.json
        private static void WriteArtefactToFile(Panviva.Sdk.Models.V3.Get.GetArtefactResultModel searchResult)
        {
            var path = Path.Combine(_outputPath, $"{searchResult.Id}.json");

            try
            {
                // Save artefact as json file
                var json = JsonConvert.SerializeObject(searchResult, Formatting.Indented);
                System.IO.File.WriteAllText(path, json);
                _outputList.Add(searchResult.Id.ToString());
                System.Console.WriteLine($"- Created {_outputList.Count} of {_artefactList.Count} - '{searchResult.Id.ToString()}.json'");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred when writing '{path}' : {e.Message}");
            }
            
        }

        // Generate a list of all arefacts using NLS
        private static void GetArtefactList(QueryHandler queryHandler)
        {
            var queryModel = new GetSearchArtefactsQueryModel
            {
                SimpleQuery = "*",
                PageLimit = 1000
            };

            try
            {
                var searchResult = queryHandler.HandleAsync(queryModel).Result;

                searchResult.Results.ToList().ForEach(r =>
                {
                    _artefactList.Add(r.Id.ToString());
                });
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception occurred when calling Panviva APIs : {e.Message}");
                throw;
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

