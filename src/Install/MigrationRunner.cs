using Microsoft.Extensions.Logging;
using TFE.Umbraco.AccessRestriction.Models;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;

namespace TFE.Umbraco.AccessRestriction.Install;
public class MigrationRunner : INotificationHandler<UmbracoApplicationStartingNotification>
{  
    private readonly IMigrationPlanExecutor _migrationPlanExecutor;
    private readonly ICoreScopeProvider _coreScopeProvider;
    private readonly IKeyValueService _keyValueService;
    private readonly IRuntimeState _runtimeState;

    public MigrationRunner(
        ICoreScopeProvider coreScopeProvider,
        IMigrationPlanExecutor migrationPlanExecutor,
        IKeyValueService keyValueService,
        IRuntimeState runtimeState)
    {
        _migrationPlanExecutor = migrationPlanExecutor;
        _coreScopeProvider = coreScopeProvider;
        _keyValueService = keyValueService;
        _runtimeState = runtimeState;
    }

    public void Handle(UmbracoApplicationStartingNotification notification)
    {
        if (_runtimeState.Level < RuntimeLevel.Run)
        {
            return;
        }

        // Create a migration plan for a specific project/feature
        // We can then track that latest migration state/step for this project/feature
        var migrationPlan = new MigrationPlan(Constants.Constants.Migration.Name);

        // This is the steps we need to take
        // Each step in the migration adds a unique value
        migrationPlan.From(string.Empty).To<AddTableIpAccessEntries>(Constants.Constants.Migration.TargetState);


        // Go and upgrade our site (Will check if it needs to do the work or not)
        // Based on the current/latest step
        var upgrader = new Upgrader(migrationPlan);
        upgrader.Execute(
            _migrationPlanExecutor,
            _coreScopeProvider,
            _keyValueService);
    }
}

public class AddTableIpAccessEntries : MigrationBase
{
    public AddTableIpAccessEntries(IMigrationContext context) : base(context)
    {
    }

    protected override void Migrate()
    {
        Logger.LogDebug("Running migration {MigrationStep}", "AddTableIpAccessEntries");

        // Lots of methods available in the MigrationBase class - discover with this.
        if (!TableExists(Constants.Constants.DatabaseSchema.Tables.IpAccessEntries))
        {
            Create.Table<IPAccessEntry>().Do();
        }
        else
        {
            Logger.LogDebug("The database table {DbTable} already exists, skipping", Constants.Constants.DatabaseSchema.Tables.IpAccessEntries);
        }
    }
}