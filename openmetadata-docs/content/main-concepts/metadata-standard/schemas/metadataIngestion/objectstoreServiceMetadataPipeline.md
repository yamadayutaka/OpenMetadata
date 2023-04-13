---
title: objectstoreServiceMetadataPipeline
slug: /main-concepts/metadata-standard/schemas/metadataingestion/objectstoreservicemetadatapipeline
---

# ObjectStoreServiceMetadataPipeline

*ObjectStoreService Metadata Pipeline Configuration.*

## Properties

- **`type`**: Pipeline type. Refer to *#/definitions/objectstoreMetadataConfigType*. Default: `ObjectStoreMetadata`.
- **`containerFilterPattern`**: Regex to only fetch containers that matches the pattern. Refer to *../type/filterPattern.json#/definitions/filterPattern*.
## Definitions

- **`objectstoreMetadataConfigType`** *(string)*: Object Store Source Config Metadata Pipeline type. Must be one of: `['ObjectStoreMetadata']`. Default: `ObjectStoreMetadata`.


Documentation file automatically generated at 2023-04-13 23:17:03.893190.
