using System.Collections.Generic;
using Newtonsoft.Json;
using Panviva.Sdk.Models.V3.Get;
using Panviva.Sdk.Models.V3.Shared;

namespace Samples.NetCore.GetDocument.Direct.Api.Models
{
    public class ModifiedDocumentModel : GetDocumentResultModel
    {
        [JsonProperty("Containers")] public IList<Container> Containers { get; set; }

        [JsonProperty("Translations")] public IList<Document> Translations { get; set; }

        [JsonProperty("Relationships")] public IList<ContainerRelationship> Relationships { get; set; }

        [JsonProperty("Origin")] public string Origin { get; set; }
    }
}