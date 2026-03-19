import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

const provider = new WebTracerProvider();

provider.register();

// Register fetch instrumentation -- auto adds traceparent to all fetch calls
registerInstrumentations({
    instrumentations: [
        new FetchInstrumentation({
            propagateTraceHeaderCorsUrls: [/.*/], // Propagate to all URLs
        }),
    ],
});

export default provider;
