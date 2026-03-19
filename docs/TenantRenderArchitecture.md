# How is a Tenant Rendered?
> [!IMPORTANT]
> This may not render on you GH as you need it, navigate to https://www.mermaidchart.com/play and enter the markdown.
### Cursor Prompt
```text
Show me a diagram of how a tenant is booted, include file names, project name, functions, and lines of code.
```
---
### Output
```mermaid
sequenceDiagram
    participant Client as Browser/User Agent
    participant IndexJS as life-webapp-main/server/index.js
    participant RenderJS as life-webapp-main/server/render.js
    participant GlobalLib as policyme/global-libjs-utils
    participant AppJS as life-webapp-main/src/App.js
    participant TenantKeys as life-webapp-main/src/tenant/tenantKeys.js
    participant PublicKeysJS as life-webapp-main/server/public_keys.js

        Client->>IndexJS: HTTP Request (e.g., GET /some-page) with Hostname
        IndexJS->>RenderJS: Middleware call for request (via serverRender({clientStats}))

        RenderJS->>GlobalLib: server.getTenantInfo(req.hostname)
        GlobalLib-->>RenderJS: tenantInfo

        alt No tenantInfo found
            Note over RenderJS: Tenant not found based on hostname
            RenderJS-->>IndexJS: Error: Tenant not found
        else Regular flow
            RenderJS->>GlobalLib: server.getTenantTheme(tenantInfo)
            GlobalLib-->>RenderJS: theme

            RenderJS->>AppJS: Render <App theme={theme} />
            AppJS-->>RenderJS: appHTML (rendered React component string)

            RenderJS->>PublicKeysJS: mapTenantToPublicKeys (implicitly via server.getTenantInjectionScript)
            PublicKeysJS-->>RenderJS: (public key info)

            RenderJS->>GlobalLib: server.getTenantInjectionScript(req.hostname, tenantInfo, mapTenantToPublicKeys)
            GlobalLib-->>RenderJS: tenantScript

            RenderJS->>GlobalLib: server.getTenantFavicon(tenantInfo)
            GlobalLib-->>RenderJS: faviconURL

            Note over RenderJS: getDataDomainId(tenantInfo, req)
            Note over RenderJS: intl.formatMessage(...) for pageTitle
            Note over RenderJS: Assemble HTML document (with tenantScript, favicon, theme styles, appHTML, pageTitle, etc.)

            RenderJS-->>IndexJS: Sends HTML response
        end

        IndexJS-->>Client: HTML Response (or Error Response from alt path)
```
