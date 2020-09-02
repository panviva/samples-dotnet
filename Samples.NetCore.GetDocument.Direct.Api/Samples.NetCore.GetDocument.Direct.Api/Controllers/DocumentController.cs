using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Panviva.Sdk.Models.V3.Get;
using Panviva.Sdk.Services.Core.Domain.QueryModels.V3;
using Panviva.Sdk.Services.Core.Exceptions;
using Panviva.Sdk.Services.Core.Handlers.V3;
using Samples.NetCore.GetDocument.Direct.Api.Helpers;
using Samples.NetCore.GetDocument.Direct.Api.Models;

namespace Samples.NetCore.GetDocument.Direct.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly ILogger<DocumentController> _logger;
        private readonly IQueryHandler _queryHandler;

        public DocumentController(IQueryHandler queryHandler, ILogger<DocumentController> logger)
        {
            _logger = logger;
            _queryHandler = queryHandler;
        }

        [HttpGet("{id}")]
        public async Task<ModifiedDocumentModel> GetAsync(string id)
        {
            var getDocumentQueryModel = new GetDocumentQueryModel
            {
                Id = id
            };

            var getDocumentContainersQueryModel = new GetDocumentContainersQueryModel
            {
                Id = id
            };

            var getDocumentTranslationsQueryModel = new GetDocumentTranslationsQueryModel
            {
                Id = id
            };

            var getContainersTask = _queryHandler.HandleAsync(getDocumentContainersQueryModel);
            var getTranslationsTask = _queryHandler.HandleAsync(getDocumentTranslationsQueryModel);

            GetDocumentResultModel mainDocument;
            try
            {
                // Execute calls to Panviva through SDK. 
                mainDocument = await _queryHandler.HandleAsync(getDocumentQueryModel);
                Task.WaitAll(getTranslationsTask, getContainersTask);
            }
            catch (QueryModelException ex)
            {
                // When Query model validation fails.
                _logger.LogError(ex.Message, ex);
                throw;
            }
            catch (FailedApiRequestException ex)
            {
                // When Panviva API results in a error.
                _logger.LogError(ex.Message, ex);
                throw;
            }

            var finalResult = Mapper.Map(mainDocument);
            finalResult.Containers = getContainersTask.Result.Containers;
            finalResult.Translations = getTranslationsTask.Result.Translations;
            finalResult.Origin = getTranslationsTask.Result.Origin;

            return finalResult;
        }
    }
}