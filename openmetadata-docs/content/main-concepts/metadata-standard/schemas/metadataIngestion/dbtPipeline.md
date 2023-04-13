---
title: dbtPipeline
slug: /main-concepts/metadata-standard/schemas/metadataingestion/dbtpipeline
---

# dbtPipeline

*DBT Pipeline Configuration.*

## Properties

- **`type`**: Pipeline type. Refer to *#/definitions/dbtConfigType*. Default: `DBT`.
- **`dbtConfigSource`**: Available sources to fetch DBT catalog and manifest files.
- **`dbtUpdateDescriptions`** *(boolean)*: Optional configuration to update the description from DBT or not. Default: `False`.
- **`includeTags`** *(boolean)*: Optional configuration to toggle the tags ingestion. Default: `True`.
- **`dbtClassificationName`** *(string)*: Custom OpenMetadata Classification name for dbt tags. Default: `dbtTags`.
## Definitions

- **`dbtConfigType`** *(string)*: DBT Config Pipeline type. Must be one of: `['DBT']`. Default: `DBT`.


Documentation file automatically generated at 2023-04-13 23:17:03.893190.
