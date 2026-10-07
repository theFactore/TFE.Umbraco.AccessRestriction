import { generate } from 'openapi-typescript-codegen';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

await generate({
  input: 'https://localhost:44394/umbraco/swagger/IPAccessRestrictionAPI/swagger.json',
  output: 'src/api',
  httpClient: 'fetch',
});
