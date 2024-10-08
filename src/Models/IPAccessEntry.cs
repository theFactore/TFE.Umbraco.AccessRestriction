﻿using NPoco;
using System.Text.Json.Serialization;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace TFE.Umbraco.AccessRestriction.Models;

[TableName(Constants.Constants.DatabaseSchema.Tables.IpAccessEntries)]
[PrimaryKey("Id", AutoIncrement = false)]
[ExplicitColumns]
public class IPAccessEntry
{
    [PrimaryKeyColumn(AutoIncrement = false)]
    [Column("Id")]
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [Column("Ip")]
    [JsonPropertyName("ip")]
    public string? Ip { get; set; }

    [Column("Description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [Column("Created")]
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    [Column("CreatedBy")]
    [JsonPropertyName("createdBy")]
    public string? CreatedBy { get; set; }

    [Column("Modified")]
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    [Column("ModifiedBy")]
    [JsonPropertyName("modifiedBy")]
    public string? ModifiedBy { get; set; }

    [Column("IsDeleted")]
    [JsonPropertyName("isDeleted")]
    public bool IsDeleted { get; set; }
}