using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Panviva.Sdk.Services.Core.Exceptions;
using System.Net.Mime;

namespace Samples.Net.Web.Utilities
{
    public class HttpResponseExceptionFilter : IActionFilter, IOrderedFilter
    {
        public int Order { get; } = int.MaxValue - 10;

        public void OnActionExecuting(ActionExecutingContext context) { }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if(context.Exception is QueryModelException queryModelException)
            {
                context.Result = new ObjectResult(queryModelException)
                {
                    StatusCode = 424,
                    Value = new { 
                        Message = queryModelException.Message
                    }
                };
                context.ExceptionHandled = true;

            }
            else if (context.Exception is FailedApiRequestException failedApiException)
            {
                context.Result = new ObjectResult(failedApiException)
                {
                    StatusCode = 424,
                    Value = new
                    {
                        Message = failedApiException.Message
                    }
                };
                context.ExceptionHandled = true;

            }
            else if (context.Exception is HttpResponseException exception)
            {
                context.Result = new ObjectResult(exception.Value)
                {
                    StatusCode = exception.Status,
                };
                context.ExceptionHandled = true;
            }
        }
    }
}
