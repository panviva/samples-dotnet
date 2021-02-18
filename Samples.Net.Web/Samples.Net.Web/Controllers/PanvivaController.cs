using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Panviva.Sdk.Models.V3.Get;
using Panviva.Sdk.Services.Core.Domain.CommandModels.V3;
using Panviva.Sdk.Services.Core.Domain.QueryModels.V3;
using Panviva.Sdk.Services.Core.Exceptions;
using Panviva.Sdk.Services.Core.Handlers.V3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Samples.Net.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PanvivaController : ControllerBase
    {
        private readonly ICommandHandler _commandHandler;
        private readonly ILogger<PanvivaController> _logger;
        private readonly IQueryHandler _queryHandler;

        public PanvivaController(ILogger<PanvivaController> logger, IQueryHandler queryHandler,
            ICommandHandler commandHandler)
        {
            _logger = logger;
            _queryHandler = queryHandler;
            _commandHandler = commandHandler;
        }

        [HttpGet]
        [Route("search/{term}")]
        public async Task<IActionResult> SearchAsync(string term)
        {
            var queryModel = new GetSearchQueryModel
            {
                Term = term
            };
            GetSearchResultModel resultModel;
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
        [Route("document/{id}")]
        public async Task<IActionResult> GetDocumentAsync(string id)
        {
            var queryModel = new GetDocumentQueryModel
            {
                Id = id
            };
            GetDocumentResultModel resultModel;
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
        [Route("containers/{id}")]
        public async Task<IActionResult> GetContainersAsync(string id)
        {
            var queryModel = new GetDocumentContainersQueryModel
            {
                Id = id
            };
            GetDocumentContainersResultModel resultModel;
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
        [Route("container/relationships/{id}")]
        public async Task<IActionResult> GetContainerRelationshipsAsync(string id)
        {
            var queryModel = new GetDocumentContainerRelationshipsQueryModel
            {
                Id = id
            };
            GetDocumentContainerRelationshipsResultModel resultModel;
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
        [Route("image/{id}")]
        [ResponseCache(VaryByHeader = "User-Agent", Duration = 30)]
        public async Task<IActionResult> GetImageAsync(int id)
        {
            var queryModel = new GetImageQueryModel
            {
                Id = id.ToString()
            };
            GetImageResultModel resultModel;
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

            return File(
                Convert.FromBase64String(resultModel.Content),
                resultModel.ContentType
            );
        }

        [HttpGet]
        [Route("live/document/{username}/{id}/{location}")]
        public async Task<IActionResult> RunLiveDocumentLocation(string id, string username, string location)
        {
            var commandModel = new LiveDocumentCommandModel
            {
                Id = id,
                UserName = username,
                Location = location
            };
            try
            {
                await _commandHandler.HandleAsync(commandModel);
            }
            catch (FailedApiRequestException ex)
            {
                // When Panviva API results in a error.
                _logger.LogError(ex.Message, ex);
                throw;
            }

            return Accepted();
        }

        [HttpGet]
        [Route("live/csh/{query}/{username}")]
        public async Task<IActionResult> RunLiveCSH(string query, string username)
        {
            var commandModel = new LiveCshCommandModel
            {
                Query = query,
                UserName = username
            };
            try
            {
                await _commandHandler.HandleAsync(commandModel);
            }
            catch (FailedApiRequestException ex)
            {
                // When Panviva API results in a error.
                _logger.LogError(ex.Message, ex);
                throw;
            }

            return Accepted();
        }

        [HttpGet]
        [Route("live/search/{query}/{username}/{feelingLucky}")]
        public async Task<IActionResult> RunLivenSearch(string query, string username, string feelingLucky)
        {
            var commandModel = new LiveSearchCommandModel
            {
                Query = query,
                UserName = username,
                ShowFirstResult = feelingLucky.Equals("1")
            };
            try
            {
                await _commandHandler.HandleAsync(commandModel);
            }
            catch (FailedApiRequestException ex)
            {
                // When Panviva API results in a error.
                _logger.LogError(ex.Message, ex);
                throw;
            }

            return Accepted();
        }
    }
}
