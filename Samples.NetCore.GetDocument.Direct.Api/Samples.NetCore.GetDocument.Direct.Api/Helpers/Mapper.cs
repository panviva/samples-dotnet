using System;
using Panviva.Sdk.Models.V3.Get;
using Samples.NetCore.GetDocument.Direct.Api.Models;

namespace Samples.NetCore.GetDocument.Direct.Api.Helpers
{
    public static class Mapper
    {
        public static ModifiedDocumentModel Map(GetDocumentResultModel document)
        {
            if (document == null) throw new NullReferenceException("Input document is 'Null'");

            // You can use AutoMapper https://github.com/AutoMapper/AutoMapper
            // To simplify mapping process. We kept it simple for this sample.
            var result = new ModifiedDocumentModel
            {
                Id = document?.Id,
                ChangeNote = document?.ChangeNote,
                Classification = document?.Classification,
                Copyright = document?.Copyright,
                CreatedDate = document?.CreatedDate,
                CshKeywords = document?.CshKeywords,
                Description = document?.Description,
                Hidden = document?.Hidden,
                Keywords = document?.Keywords,
                Language = document?.Language,
                Layout = document?.Layout,
                Name = document?.Name,
                Percentage = document?.Percentage,
                Release = document?.Release,
                ReleaseDate = document?.ReleaseDate,
                ReusableContent = document?.ReusableContent,
                Released = document?.Released,
                Source = document?.Source,
                Tags = document?.Tags,
                Training = document?.Training,
                Type = document?.Type,
                UpdatedDate = document?.UpdatedDate,
                Version = document?.Version,
                Status = document?.Status
            };

            return result;
        }
    }
}