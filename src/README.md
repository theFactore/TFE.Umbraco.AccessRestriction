# TFE.Umbraco.AccessRestriction

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![NuGet](https://img.shields.io/nuget/vpre/TFE.Umbraco.AccessRestriction.svg)](https://www.nuget.org/packages/TFE.Umbraco.AccessRestriction)
[![NuGet](https://img.shields.io/nuget/dt/TFE.Umbraco.AccessRestriction.svg)](https://www.nuget.org/packages/TFE.Umbraco.AccessRestriction)

**TFE.Umbraco.AccessRestriction** is a IP access restriction manager for Umbraco. The package features a dashboard and editor that let's users manage whitelisted IP addresses from within the Umbraco backoffice. IP's can be added with a description and have both a creation and modified date and user.

## Getting started

| License:                                  | Umbraco:   | Target Framework: |
| ----------------------------------------- | ---------- | ----------------- |
| [MIT License](./LICENSE.md "MIT License") | Umbraco 14 | .NET 8            |

## Package Installation

The Umbraco 14.1.2 version of this package is only available via [NuGet](https://www.nuget.org/packages/TFE.Umbraco.AccessRestriction). To install the package, you can use either .NET CLI:

```C#
dotnet add package TFE.Umbraco.AccessRestriction --version 14.1.2
```

or the older NuGet Package Manager:

```C#
NuGet\Install-Package TFE.Umbraco.AccessRestriction --version 14.1.2
```

## Umbraco Installation

Before the Umbraco middleware, add the IPAccessRestrictionMiddleware to Program.cs or Startup.cs in previous versions:

```C#
app.UseMiddleware<IPAccessRestrictionMiddleware>();
```

Add the necessary usings to Program.cs (or Startup.cs):

```C#
using TFE.Umbraco.AccessRestriction.Middleware;
```

Add these settings to appsettings.json

```C#
"TFE.Umbraco.AccessRestriction": {
    "disable": true,
    "logBlockedIP": false,
    "localHost": "127.0.0.1",
    "excludePaths": "/umbraco, /App_Plugins, /api/keepalive/ping",
    "includePaths": "",
    "isCloudFlare": false,
    "customHeader": ""
  }
```

Either use "excludePaths" or "includePaths" to direct the IP blocker.

### Azure / CloudFlare / Umbraco Cloud Installation

When installed on a cloud environment make sure to add your the cloud IP Addresses.
Replace the following excludePaths property in appsettings.json :

```C#
"excludePaths": "/umbraco, /App_Plugins, /api/keepalive/ping, /umbraco-signin-oidc, /sb",
```

Set to true when using Cloudflare

```C#
"isCloudFlare": true,
```

If a proxy is being used, set the value of the 'customHeader' field to 'header' with the IP address used by the proxy.

```C#
"customHeader": "",
```

## Whitelist IP Addresses

There are two different ways to whitelist an IP address, though the dashboard interface and by adding the IP address to WhitelistedIps.txt. Both methods can be used simultaneously and separately.

### Add an IP using the Umbraco dashboard

![Add an IP to the whitelist](https://github.com/theFactore/TFE.Umbraco.AccessRestriction/blob/main/Add_whitelisted_IP.gif?raw=true)

### Add an IP using WhitelistedIps.txt

Add WhitelistedIps.txt to the root of your Umbraco project.

![Add an IP to the whitelist txt file](https://github.com/theFactore/TFE.Umbraco.AccessRestriction/blob/main/Add_whitelisted_IP_via_txt_file.png?raw=true)

IP Addresses must be line separated and to add a comment use the #.

```C#
192.168.1.1
192.168.1.2 #John
192.168.1.3
::1
192.168.1.4 #Hank
```

## Features

- Global dashboard for listing all whitelisted IP addresses.
- Package handles IP addresses added manually by a user with admin rights and IP addresses added to the WhitelistedIps.txt.
- logBlockedIP enables you to see all blocked IP addresses in the Umbraco log.
- Use _as wildcard to add a range of IP addresses e.g. "192.168.1._"
- Include or exclude paths from being blocked.

## Building and Packing the NuGet Package

If you've made changes to the frontend (e.g., using Vite or Lit), it's important to build the frontend assets before packing the NuGet package. This ensures that all the necessary files are correctly included in the package.

### Step 1: Build the Frontend

Before you pack the NuGet package, you need to build the frontend assets:

1. Navigate to the `TFE.Umbraco.AccessRestriction/client` directory of your project where the frontend files are located.
2. Run the following command to build the frontend:

   ```bash
   npm run build
   ```

   This command compiles the frontend files, optimizes them for production, and places them in `TFE.Umbraco.AccessRestriction/src/wwwroot`.

### Step 2: Pack the NuGet Package

Once the frontend is built, you can proceed to create the NuGet package:

1. Open a terminal in `TFE.Umbraco.AccessRestriction/src`.
2. Run the following .NET CLI command to pack the NuGet package:

   ```bash
   dotnet pack --configuration Release
   ```

   This command creates a `.nupkg` file in the `bin/Release` directory of your project. This file is the NuGet package that you can distribute.

### Step 3: Publish the NuGet Package

After packing, you can publish your NuGet package to [NuGet.org](https://www.nuget.org/) or any other NuGet server you use:

1. Use the following command to push the package to NuGet.org:

   ```bash
   dotnet nuget push bin/Release/TFE.Umbraco.AccessRestriction.<version>.nupkg --api-key <Your_NuGet_API_Key> --source https://api.nuget.org/v3/index.json
   ```

   Replace `<version>` with the version number of your package, and `<Your_NuGet_API_Key>` with your actual NuGet API key.

### Summary

- **`npm run build`**: Builds the frontend assets.
- **`dotnet pack --configuration Release`**: Creates the NuGet package.
- **`dotnet nuget push`**: Publishes the package to NuGet.org.

By following these steps, you ensure that any frontend changes are properly included in the NuGet package, providing a seamless experience for users who install your package.

## Contribution guidelines

To raise a new bug, create an issue on the GitHub repository. To fix a bug or add new features, fork the repository and send a pull request with your changes. Feel free to add ideas to the repository's issues list if you would like to discuss anything related to the library.

### Who do I talk to?

This project is maintained by Rutger Dijkstra and contributors. If you have any questions about the project please raise a issue on GitHub.
