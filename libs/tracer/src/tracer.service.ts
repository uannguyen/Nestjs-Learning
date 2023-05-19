import { Injectable, Logger } from '@nestjs/common';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { Resource } from '@opentelemetry/resources';
import {
  BasicTracerProvider,
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { TracerShim } from '@opentelemetry/shim-opentracing';
import * as clone from 'clone';
import { ServerResponse } from 'http';
import * as opentracing from 'opentracing';
import * as shimmer from 'shimmer';
import * as winston from 'winston';

const getMethods = (obj: any) => {
  const properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) =>
      typeof obj[item.toString()] === 'function' &&
      ![
        'constructor',
        '__defineGetter__',
        '__defineSetter__',
        '__lookupGetter__',
        '__lookupSetter__',
        'hasOwnProperty',
        'hasOwnProperty',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toString',
        'valueOf',
        'toLocaleString',
        'onModuleInit',
      ].includes(item.toString()),
  );
};
const shimV2 = (serviceName = 'UAN_TEST_TRACING') => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });
  const exporter = new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces',
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();
  return new TracerShim(provider.getTracer(serviceName));
};

const shim = (serviceName = 'UAN_TEST_TRACING') => {
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });
  const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  });
  const processor = new BatchSpanProcessor(exporter);
  provider.addSpanProcessor(processor);

  provider.register();
  registerInstrumentations({
    instrumentations: [
      new WinstonInstrumentation({
        logHook: (span, record) => {
          record['resource.service.name'] =
            provider.resource.attributes['service.name'];
          console.log('WinstonInstrumentation', span);
        },
      }),
    ],
  });
  return new TracerShim(provider.getTracer(serviceName));
};

let jaeger;
@Injectable()
export class TracerService {
  jaeger: any;
  options: any;
  parentSpan: any;
  span: any;
  requestId: any;
  logger: any;
  constructor() {
    this.jaeger = jaeger;
  }

  static initJager() {
    Logger.log('initJager');
    if (!Object.keys(jaeger || {}).length) {
      opentracing.initGlobalTracer(shim());
      jaeger = opentracing.globalTracer();
    }
  }

  initLogger() {
    Logger.log('initLogger');
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
    });
  }

  init(options) {
    this.options = options;
    this.requestId = this.options.requestId;
  }

  start(obj, spanName) {
    const methods = getMethods(obj.prototype);
    methods.forEach((method) => wrap(method));
    function wrap(method) {
      shimmer.wrap(obj.prototype, method, function wrapOrigin(original) {
        const isGeneratorFn = original.toString().includes('function*');
        if (isGeneratorFn) {
          return async function wrappedFunction(...args) {
            try {
              if (
                !args.length ||
                args[args.length - 1] == null ||
                !args[args.length - 1]?.traceContext
              ) {
                let result;
                let error;
                try {
                  result = await original.apply(this, [...args]);
                } catch (e) {
                  error = e;
                }

                if (error) throw error;
                return result;
              } else {
                // if (!args.length || !args[args.length - 1]?.traceContext)
                // args.push({ traceContext: '' });
                const metadata = clone(args.pop());
                const traceCxtArr = metadata.traceContext.split(',');
                const requestId = traceCxtArr.shift();
                const parentSpan = traceCxtArr.pop();
                const rootSpan = traceCxtArr.shift();

                const tracer = new TracerService();
                tracer.init({ requestId });

                tracer.SpanStart(`${spanName} - ${method}`, parentSpan);

                const tags = metadata.tags || {};
                tracer.Tag(
                  'req_time',
                  tags.req_time && tags.req_time.toString(),
                );
                tracer.Tag('req_id_uniq', tags.req_id_uniq);
                tracer.Tag('phone', tags.phone);
                tracer.LogInput(...args);

                const currSpan = tracer.ExportTraceContext();

                metadata.traceContext = `${requestId},${
                  rootSpan || currSpan
                },${currSpan}`;

                let result;
                let error;

                try {
                  result = await original.apply(this, [...args, metadata]);
                } catch (e) {
                  error = e;
                }

                if (error) tracer.LogError(error);
                if (result) tracer.LogOutput(result);
                tracer.SpanFinish();

                if (error) throw error;
                return result;
              }
            } catch (error) {
              Logger.error(error, 'Wrap Trace');
            }
          };
        } else {
          return function wrappedFunction(...args) {
            try {
              if (
                !args.length ||
                args[args.length - 1] == null ||
                !args[args.length - 1].traceContext
              ) {
                let result;
                let error;
                try {
                  result = original.apply(this, [...args]);
                } catch (e) {
                  error = e;
                }

                if (error) throw error;
                return result;
              } else {
                const metadata = clone(args.pop());
                const traceCxtArr = metadata.traceContext.split(',');
                const requestId = traceCxtArr.shift();
                const parentSpan = traceCxtArr.pop();
                const rootSpan = traceCxtArr.shift();

                const tracer = new TracerService();
                tracer.init({ requestId });

                tracer.SpanStart(`${spanName} - ${method}`, parentSpan);

                const tags = metadata.tags || {};
                tracer.Tag(
                  'req_time',
                  tags.req_time && tags.req_time.toString(),
                );
                tracer.Tag('req_id_uniq', tags.req_id_uniq);
                tracer.Tag('phone', tags.phone);
                tracer.LogInput(...args);

                const currSpan = tracer.ExportTraceContext();

                metadata.traceContext = `${requestId},${
                  rootSpan || currSpan
                },${currSpan}`;

                let result;
                let error;
                try {
                  result = original.apply(this, [...args, metadata]);
                } catch (e) {
                  error = e;
                }
                if (error) {
                  tracer.LogError(error);
                  tracer.SpanFinish();
                }
                const hasResult = !!result;
                if (hasResult) {
                  tracer.LogOutput(result);
                  tracer.SpanFinish();
                }

                if (error) throw error;
                return result;
              }
            } catch (error) {
              Logger.error(error, 'Wrap Trace');
            }
          };
        }
      });
    }
  }

  ExportTraceContext() {
    const context = {
      requestId: '',
    };
    context.requestId = this.requestId;
    this.jaeger.inject(this.span, opentracing.FORMAT_TEXT_MAP, context);
    return context['traceparent'];
  }

  SpanStart(name, parentSpan) {
    if (parentSpan) {
      parentSpan = this.jaeger.extract(opentracing.FORMAT_TEXT_MAP, {
        traceparent: parentSpan,
        span: parentSpan,
      });
    }
    this.span = this.jaeger.startSpan(name, {
      childOf: parentSpan,
    });
    this.span.setTag('request_id', this.requestId);
  }

  SpanStartV2(name, parentSpan?) {
    this.span = this.jaeger.startSpan(name, {
      childOf: parentSpan || null,
    });
    this.span.setTag('request_id', this.requestId);
    return this.span;
  }

  /**
   * End of a span
   */
  SpanFinish() {
    if (this.span) this.span.finish();
  }

  LogInput(...params) {
    if (this.span) {
      const input = {};
      params.forEach((param, i) => {
        if (
          !!param &&
          !!param.constructor &&
          !['Object', 'String', 'Number'].includes(param.constructor.name)
        ) {
          try {
            input[`input ${i}`] = JSON.stringify(param.constructor.name);
          } catch (error) {
          } finally {
            input[`input ${i}`] = param.constructor.name;
          }
          // return this.span.log({ [`param${i}`]: param.constructor.name });
        } else {
          input[`input ${i}`] = JSON.stringify(param);
          // return this.span.log({ [`param${i}`]: param })
        }
      });
      return this.span.log(input);
    }
  }

  /**
   * Log output values into span
   */
  LogOutput(...params) {
    if (this.span) {
      const output = {};
      params.forEach((param, i) => {
        if (
          !!param &&
          !!param.constructor &&
          ['ClientSession'].includes(param.constructor.name)
        ) {
          try {
            output[`output ${i}`] = JSON.stringify(param.constructor.name);
          } catch (error) {
          } finally {
            output[`output ${i}`] = param.constructor.name;
          }
          // return this.span.log({ [`param${i}`]: param.constructor.name });
        } else {
          if (param instanceof ServerResponse) {
          } else if (JSON.stringify(param).length > 64569) {
            output[`output ${i}`] = {
              message: `span size ${
                JSON.stringify(param).length
              } is larger than maxSpanSize 64569`,
            };
          } else {
            output[`output ${i}`] = JSON.stringify(param);
          }
        }
      });
      return this.span.log(output);
    }
  }

  LogError(error) {
    if (this.span) {
      this.span.setTag('error', true);
      this.span.log({ error: error instanceof Error ? error.stack : error });
    }
  }

  Tag(name, value) {
    if (this.span) this.span.setTag(name, value);
  }
}
