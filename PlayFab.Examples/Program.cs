﻿// Copyright (c) Microsoft. All rights reserved.

using Microsoft.Extensions.Configuration;
using PlayFab.Examples.Common.Configuration;
using PlayFab.Examples.Example01.DataQnA;
using PlayFab.Examples.Example02_Generative;

namespace PlayFab.Examples;

public static class Program
{
    public static async Task Main(string[] args)
    {
        // Load configuration from environment variables or user secrets.
        LoadUserSecrets();

        // Execution canceled if the user presses Ctrl+C.
        using CancellationTokenSource cancellationTokenSource = new();
        CancellationToken cancelToken = cancellationTokenSource.ConsoleCancellationToken();

        // Run PlayFab Examples
        await Example01_DataQnA.RunAsync().SafeWaitAsync(cancelToken);
        await Example02_GenerativeSegments.RunAsync().SafeWaitAsync(cancelToken);
        //await PlayFabExamples.Example03_SegmentQuery.Example03_SegmentQuery.RunAsync().SafeWaitAsync(cancelToken);
    }

    private static void LoadUserSecrets()
    {
        IConfigurationRoot configRoot = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .AddUserSecrets<Env>()
            .Build();
        TestConfiguration.Initialize(configRoot);
    }

    private static CancellationToken ConsoleCancellationToken(this CancellationTokenSource tokenSource)
    {
        Console.CancelKeyPress += (s, e) =>
        {
            Console.WriteLine("Canceling...");
            tokenSource.Cancel();
            e.Cancel = true;
        };

        return tokenSource.Token;
    }

    private static async Task SafeWaitAsync(this Task task,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await task.WaitAsync(cancellationToken);
            Console.WriteLine("== DONE ==");
        }
        catch (ConfigurationNotFoundException ex)
        {
            Console.WriteLine($"{ex.Message}. Skipping example.");
        }

        cancellationToken.ThrowIfCancellationRequested();
    }
}
