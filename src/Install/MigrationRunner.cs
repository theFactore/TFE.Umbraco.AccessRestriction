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
using static TFE.Umbraco.AccessRestriction.Constants.Constants;

namespace TFE.Umbraco.AccessRestriction.Install;

public class MigrationRunner : INotificationAsyncHandler<UmbracoApplicationStartingNotification>
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

	public async Task HandleAsync(
		UmbracoApplicationStartingNotification notification,
		CancellationToken cancellationToken)
	{
		if (_runtimeState.Level < RuntimeLevel.Run)
		{
			return;
		}

		var name = Migration.Name;

		var migrationPlan = new MigrationPlan(name);

		migrationPlan
			.From(string.Empty)
			.To<AddTableIpAccessEntries>($"{name}_1")
			.To<UpdateIpAccessEntriesIdToGuid>($"{name}_2")
			.To<RemoveOldIdColumn>($"{name}_3");

		var upgrader = new Upgrader(migrationPlan);

		await upgrader.ExecuteAsync(
			_migrationPlanExecutor,
			_coreScopeProvider,
			_keyValueService);
	}
}

public class AddTableIpAccessEntries : AsyncMigrationBase
{
	public AddTableIpAccessEntries(IMigrationContext context) : base(context)
	{
	}

	protected override Task MigrateAsync()
	{
		var table = DatabaseSchema.Tables.IpAccessEntries;

		Logger.LogDebug("Running migration {MigrationStep}", nameof(AddTableIpAccessEntries));

		if (!TableExists(table))
		{
			Create.Table<IPAccessEntry>().Do();
		}
		else
		{
			Logger.LogDebug("The database table {DbTable} already exists, skipping", table);
		}

		return Task.CompletedTask;
	}
}

public class UpdateIpAccessEntriesIdToGuid : AsyncMigrationBase
{
	public UpdateIpAccessEntriesIdToGuid(IMigrationContext context) : base(context)
	{
	}

	protected override Task MigrateAsync()
	{
		var table = DatabaseSchema.Tables.IpAccessEntries;

		Logger.LogDebug("Running migration {MigrationStep}", nameof(UpdateIpAccessEntriesIdToGuid));

		if (!TableExists(table))
		{
			Create.Table<IPAccessEntry>().Do();
			return Task.CompletedTask;
		}

		AddIsEditableColumnIfMissing(table);

		if (HasGuidIdColumn(table))
		{
			Logger.LogDebug("Table {Table} already has a Guid Id column, skipping Id migration", table);
			return Task.CompletedTask;
		}

		if (!HasIntIdColumn(table))
		{
			Logger.LogWarning("Table {Table} does not have an int Id column and is not recognized as the latest schema", table);
			return Task.CompletedTask;
		}

		Logger.LogInformation("Old int Id column detected on {Table}, migrating Id to Guid", table);

		DropPrimaryKeyConstraint(table);

		if (!ColumnExists(table, "OldId"))
		{
			Rename.Column("Id").OnTable(table).To("OldId").Do();
		}

		if (!ColumnExists(table, "Id"))
		{
			Create.Column("Id")
				.OnTable(table)
				.AsGuid()
				.Nullable()
				.Do();

			Execute.Sql($@"
				UPDATE [{table}]
				SET [Id] = NEWID()
				WHERE [Id] IS NULL
			").Do();

			Execute.Sql($@"
				ALTER TABLE [{table}]
				ALTER COLUMN [Id] uniqueidentifier NOT NULL
			").Do();
		}

		AddPrimaryKeyConstraint(table);

		return Task.CompletedTask;
	}

	private void AddIsEditableColumnIfMissing(string table)
	{
		if (ColumnExists(table, "IsEditable"))
		{
			return;
		}

		Logger.LogInformation("Adding column IsEditable to {Table}", table);

		Create.Column("IsEditable")
			.OnTable(table)
			.AsBoolean()
			.NotNullable()
			.WithDefaultValue(false)
			.Do();
	}

	private bool HasIntIdColumn(string table)
	{
		var result = Database.ExecuteScalar<int>($@"
			SELECT COUNT(*)
			FROM sys.columns c
			INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
			WHERE c.object_id = OBJECT_ID('{table}')
			  AND c.name = 'Id'
			  AND t.name = 'int'
		");

		return result > 0;
	}

	private bool HasGuidIdColumn(string table)
	{
		var result = Database.ExecuteScalar<int>($@"
			SELECT COUNT(*)
			FROM sys.columns c
			INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
			WHERE c.object_id = OBJECT_ID('{table}')
			  AND c.name = 'Id'
			  AND t.name = 'uniqueidentifier'
		");

		return result > 0;
	}

	private void DropPrimaryKeyConstraint(string table)
	{
		Execute.Sql($@"
			DECLARE @@pkName sysname;

			SELECT @@pkName = kc.name
			FROM sys.key_constraints kc
			WHERE kc.parent_object_id = OBJECT_ID('{table}')
			  AND kc.[type] = 'PK';

			IF @@pkName IS NOT NULL
				EXEC('ALTER TABLE [{table}] DROP CONSTRAINT [' + @@pkName + ']');
		").Do();
	}

	private void AddPrimaryKeyConstraint(string table)
	{
		Execute.Sql($@"
			IF NOT EXISTS (
				SELECT 1
				FROM sys.key_constraints kc
				WHERE kc.parent_object_id = OBJECT_ID('{table}')
				  AND kc.[type] = 'PK'
			)
			BEGIN
				ALTER TABLE [{table}]
				ADD CONSTRAINT [PK_{table}_Id] PRIMARY KEY ([Id]);
			END
		").Do();
	}
}

public class RemoveOldIdColumn : AsyncMigrationBase
{
	public RemoveOldIdColumn(IMigrationContext context) : base(context)
	{
	}

	protected override Task MigrateAsync()
	{
		var table = DatabaseSchema.Tables.IpAccessEntries;

		Logger.LogDebug("Running migration {MigrationStep}", nameof(RemoveOldIdColumn));

		if (!TableExists(table))
		{
			return Task.CompletedTask;
		}

		if (!ColumnExists(table, "OldId"))
		{
			Logger.LogDebug("Column OldId does not exist on {Table}, skipping", table);
			return Task.CompletedTask;
		}

		Logger.LogInformation("Removing OldId column from {Table}", table);

		Delete.Column("OldId").FromTable(table).Do();

		return Task.CompletedTask;
	}
}