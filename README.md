# TFE.Umbraco.AccessRestriction

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![NuGet](https://img.shields.io/nuget/vpre/TFE.Umbraco.AccessRestriction.svg)](https://www.nuget.org/packages/TFE.Umbraco.AccessRestriction)
[![NuGet](https://img.shields.io/nuget/dt/TFE.Umbraco.AccessRestriction.svg)](https://www.nuget.org/packages/TFE.Umbraco.AccessRestriction)

**TFE.Umbraco.AccessRestriction** is a IP access restriction manager for Umbraco. The package features a dashboard and editor that let's users manage whitelisted IP addresses from within the Umbraco backoffice. IP's can be added with a description and have both a creation and modified date and user.

## Getting started

|License:|Umbraco:|Target Framework:|
|--------|--------|-----------------|
|[MIT License](./LICENSE.md "MIT License")|Umbraco 10|.NET 6|

## Package Installation

The Umbraco 10 version of this package is only available via [NuGet](https://www.nuget.org/packages/TFE.Umbraco.AccessRestriction). To install the package, you can use either .NET CLI:

```C#
dotnet add package TFE.Umbraco.AccessRestriction --version 10.3.2.2
```

or the older NuGet Package Manager:

```C#
NuGet\Install-Package TFE.Umbraco.AccessRestriction -Version 10.3.2.2
```

## Umbraco Installation

Before the Umbraco middleware, add the IPAccessRestrictionMiddleware to Startup.cs:

```C#
app.UseMiddleware<IPAccessRestrictionMiddleware>(); 
```

Add the necessary usings to Startup.cs:

```C#
using TFE.Umbraco.AccessRestriction.Middleware;
```

Add these settings to appsettings.json

```C#
"TFE.Umbraco.AccessRestriction": {
    "disable": true, 
    "logBlockedIP": false,
    "excludePaths": "/umbraco, /App_Plugins",
    "localHost": "127.0.0.1"
  }
``` 
### Umbraco Cloud Installation
>When installed on Umbraco Cloud make sure to add your Umbraco Cloud IP Addresses. Replace the following excludePaths property in appsettings.json :
```C#
 "excludePaths": "/umbraco, /App_Plugins, /umbraco-signin-oidc, /sb", 
```
## Features

- Global dashboard for listing all whitelisted IP addresses.
- Package only handles IP addresses added manually by a user with admin rights.
- logBlockedIP enables you to see all blocked IP addresses in the Umbraco log.

## Contribution guidelines

To raise a new bug, create an issue on the GitHub repository. To fix a bug or add new features, fork the repository and send a pull request with your changes. Feel free to add ideas to the repository's issues list if you would like to discuss anything related to the library.

### Who do I talk to?

This project is maintained by Rutger Dijkstra and contributors. If you have any questions about the project please raise a issue on GitHub.
