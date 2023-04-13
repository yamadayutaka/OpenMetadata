---
title: gcsValues
slug: /main-concepts/metadata-standard/schemas/security/credentials/gcsvalues
---

# GCS Credentials Values

*Pass the raw credential values provided by GCS*

## Properties

- **`type`** *(string)*: Google Cloud service account type.
- **`projectId`**: Project ID.
- **`privateKeyId`** *(string)*: Google Cloud private key id.
- **`privateKey`** *(string)*: Google Cloud private key.
- **`clientEmail`** *(string)*: Google Cloud email.
- **`clientId`** *(string)*: Google Cloud Client ID.
- **`authUri`** *(string)*: Google Cloud auth uri. Default: `https://accounts.google.com/o/oauth2/auth`.
- **`tokenUri`** *(string)*: Google Cloud token uri. Default: `https://oauth2.googleapis.com/token`.
- **`authProviderX509CertUrl`** *(string)*: Google Cloud auth provider certificate. Default: `https://www.googleapis.com/oauth2/v1/certs`.
- **`clientX509CertUrl`** *(string)*: Google Cloud client certificate uri.
## Definitions

- **`singleProjectId`** *(string)*
- **`multipleProjectId`** *(array)*
  - **Items** *(string)*


Documentation file automatically generated at 2023-04-13 23:17:03.893190.
