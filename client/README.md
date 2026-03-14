# TFE.Umbraco.AccessRestriction - Client

De frontend van het TFE.Umbraco.AccessRestriction pakket. Gebouwd met Vite, TypeScript en Lit.

## Installatie

```bash
npm install
```

## Scripts

| Script | Beschrijving |
|--------|-------------|
| `npm run dev` | Start de Vite dev server |
| `npm run build` | Compileert TypeScript en bouwt de productie-bundle |
| `npm run watch` | Bouwt automatisch opnieuw bij wijzigingen |
| `npm run test` | Draait de tests |
| `npm run generate:api` | Genereert de TypeScript API client vanuit de Swagger spec |

## API Client genereren

De bestanden in `src/api/` worden automatisch gegenereerd op basis van de Swagger specificatie van de backend. Na wijzigingen aan de backend API (endpoints, models) moet de client opnieuw gegenereerd worden.

### Vereisten

- De Umbraco backend moet lokaal draaien met Swagger ingeschakeld

### Uitvoeren

```bash
npm run generate:api
```

De standaard Swagger URL is `https://localhost:44394/umbraco/swagger/IPAccessRestrictionAPI/swagger.json`. Als je backend op een andere poort draait, pas de URL aan in het `generate:api` script in `package.json`.

### Na het genereren

Na het genereren moet je controleren of de frontend nog compileert:

```bash
npm run build
```

Wijzigingen in de API (nieuwe velden, verwijderde endpoints) kunnen typefouten veroorzaken in de frontend code die handmatig opgelost moeten worden.

## Build output

De gebouwde bestanden worden geschreven naar `../src/wwwroot/App_Plugins/TFE.Umbraco.AccessRestriction/`. Dit is de map die Umbraco gebruikt om de backoffice extensie te laden.
