using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Panviva.Sdk.Services.Core.Domain.QueryModels.V3;
using Panviva.Sdk.Services.Core.Handlers.V3;
using Samples.NetCore.GetDocument.Direct.Api.Helpers;
using Samples.NetCore.GetDocument.Direct.Api.Models;

namespace Samples.NetCore.GetDocument.Direct.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly IQueryHandler _queryHandler;

        public DocumentController(IQueryHandler queryHandler)
        {
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

            var mainDocument = await _queryHandler.HandleAsync(getDocumentQueryModel);

            var finalResult = Mapper.Map(mainDocument);

            var getContainersTask = _queryHandler.HandleAsync(getDocumentContainersQueryModel);
            var getTranslationsTask = _queryHandler.HandleAsync(getDocumentTranslationsQueryModel);

            Task.WaitAll(getTranslationsTask, getContainersTask);

            finalResult.Containers = getContainersTask.Result.Containers;
            finalResult.Translations = getTranslationsTask.Result.Translations;
            finalResult.Origin = getTranslationsTask.Result.Origin;

            return finalResult;
        }
    }
}