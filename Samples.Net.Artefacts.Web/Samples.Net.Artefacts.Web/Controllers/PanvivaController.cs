using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Panviva.Sdk.Models.V3.Get;
using Panviva.Sdk.Services.Core.Domain.QueryModels.V3;
using Panviva.Sdk.Services.Core.Exceptions;
using Panviva.Sdk.Services.Core.Handlers.V3;

namespace Samples.Net.Artefacts.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PanvivaController : ControllerBase
    {
        private readonly ILogger<PanvivaController> _logger;
        private readonly IQueryHandler _queryHandler;

        public PanvivaController(ILogger<PanvivaController> logger, IQueryHandler queryHandler,
            ICommandHandler commandHandler)
        {
            _logger = logger;
            _queryHandler = queryHandler;
        }

        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> SearchAsync([FromQuery] GetSearchArtefactsQueryModel queryModel)
        {
            GetSearchArtefactResultModel resultModel;
            try
            {
                resultModel = await _queryHandler.HandleAsync(queryModel);
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

            return Ok(resultModel);
        }

        [HttpGet]
        [Route("artefact/{id}")]
        public async Task<IActionResult> ArtefactAsync([FromRoute] GetArtefactQueryModel queryModel)
        {
            GetArtefactResultModel resultModel;
            try
            {
                resultModel = await _queryHandler.HandleAsync(queryModel);
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

            return Ok(resultModel);
        }
    }
}
