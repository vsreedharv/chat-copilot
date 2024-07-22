﻿///<summary>
/// Configuration settings for specialization
///</summary>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CopilotChat.WebApi.Plugins.Chat.Ext;

public class QAzureOpenAIChatOptions
{
    public const string PropertyName = "QAzureOpenAIChatConfig";

    [Required]
    public IList<QSpecialization> Specializations { get; set; } = new List<QSpecialization>();

    public bool Enabled { get; set; } = false;
}

public class QSpecialization
{
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageFilepath { get; set; } = string.Empty;
    public string RoleInformation { get; set; } = string.Empty;
    public string IndexName { get; set; } = string.Empty;
    public Uri? Endpoint { get; set; } = null;
    public string APIKey { get; set; } = string.Empty;
    public string QueryType { get; set; } = string.Empty;
    public string SemanticConfiguration { get; set; } = string.Empty;
    public bool RestrictResultScope { get; set; } = true;
    public FieldMappingOption? FieldMapping { get; set; } = new FieldMappingOption();
    public int Strictness { get; set; }
    public int DocumentCount { get; set; }
    public VectorizationSourceOption? VectorizationSource { get; set; }
}

public class FieldMappingOption
{
    public string UrlFieldName { get; set; } = string.Empty;
    public string TitleFieldName { get; set; } = string.Empty;
    public string FilepathFieldName { get; set; } = string.Empty;
}

public class VectorizationSourceOption
{
    public Uri Endpoint { get; set; } = null;
    public string APIKey { get; set; } = string.Empty;
}
