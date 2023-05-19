/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./libs/connect/src/connect.module.ts":
/*!********************************************!*\
  !*** ./libs/connect/src/connect.module.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const ws_service_1 = __webpack_require__(/*! ./ws.service */ "./libs/connect/src/ws.service.ts");
let ConnectModule = class ConnectModule {
};
ConnectModule = __decorate([
    (0, common_1.Module)({
        providers: [ws_service_1.WsService],
        exports: [ws_service_1.WsService],
    })
], ConnectModule);
exports.ConnectModule = ConnectModule;


/***/ }),

/***/ "./libs/connect/src/index.ts":
/*!***********************************!*\
  !*** ./libs/connect/src/index.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./connect.module */ "./libs/connect/src/connect.module.ts"), exports);
__exportStar(__webpack_require__(/*! ./ws.service */ "./libs/connect/src/ws.service.ts"), exports);


/***/ }),

/***/ "./libs/connect/src/ws.service.ts":
/*!****************************************!*\
  !*** ./libs/connect/src/ws.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
let WsService = class WsService {
    constructor() {
        this.logger = new common_1.Logger('MessageGateway');
        this.clients = {};
    }
    handleMessage(client, payload) {
        console.log('send message', payload);
        payload.client_id = client.id;
        this.server.sockets.emit('receive_message', payload);
        return;
    }
    handlePrivateMessage(client, payload) {
        const { to, message } = payload;
        this.server.to(to).emit('private-message', { message, from: client.id });
        return;
    }
    joinRoom(client, data) {
        const { room } = data;
        console.log('joinRoom', room);
        client.join(room);
        client.to(room).emit('joinedRoom', room);
    }
    leaveRoom(client, room) {
        console.log('leaveRoom', room);
        client.leave(room);
        client.emit('leftRoom', room);
    }
    afterInit(server) {
        return this.logger.log('Init');
    }
    handleDisconnect(client) {
        return this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client) {
        var _a, _b;
        this.logger.log(`Client connected: ${client.id}`);
        client.username = (_b = (_a = client.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.username;
        const users = [];
        for (const [id, socket] of this.server.of('/').sockets) {
            users.push({
                userID: id,
                username: socket.username,
                connected: true,
            });
        }
        this.server.emit('users', users);
        client.broadcast.emit('user-connected', {
            userID: client.id,
            username: client.username,
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], WsService.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], WsService.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('private-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], WsService.prototype, "handlePrivateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", void 0)
], WsService.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object, String]),
    __metadata("design:returntype", void 0)
], WsService.prototype, "leaveRoom", null);
WsService = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(9999, {
        transports: ['websocket'],
    })
], WsService);
exports.WsService = WsService;


/***/ }),

/***/ "./libs/define/src/index.ts":
/*!**********************************!*\
  !*** ./libs/define/src/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./kafka */ "./libs/define/src/kafka.ts"), exports);


/***/ }),

/***/ "./libs/define/src/kafka.ts":
/*!**********************************!*\
  !*** ./libs/define/src/kafka.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KAFKA_TOPICS = exports.KAFKA_GROUP_ID = exports.KAFKA_CLIENT_ID = exports.KAFKA_PROVIDER_NAME = void 0;
exports.KAFKA_PROVIDER_NAME = 'KAFKA_PROVIDER';
exports.KAFKA_CLIENT_ID = 'kafka-client-id';
exports.KAFKA_GROUP_ID = 'kafka-gateway';
exports.KAFKA_TOPICS = {
    DEFAULT_TOPIC: 'DEFAULT_TOPIC',
};


/***/ }),

/***/ "./libs/kafka/src/index.ts":
/*!*********************************!*\
  !*** ./libs/kafka/src/index.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./kafka.module */ "./libs/kafka/src/kafka.module.ts"), exports);
__exportStar(__webpack_require__(/*! ./kafka.service */ "./libs/kafka/src/kafka.service.ts"), exports);


/***/ }),

/***/ "./libs/kafka/src/kafka.module.ts":
/*!****************************************!*\
  !*** ./libs/kafka/src/kafka.module.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KafkaModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let KafkaModule = KafkaModule_1 = class KafkaModule {
    static forRoot() {
        const imports = [];
        const providers = [];
        const exports = [];
        return {
            module: KafkaModule_1,
            imports,
            providers,
            exports,
        };
    }
};
KafkaModule = KafkaModule_1 = __decorate([
    (0, common_1.Module)({})
], KafkaModule);
exports.KafkaModule = KafkaModule;


/***/ }),

/***/ "./libs/kafka/src/kafka.service.ts":
/*!*****************************************!*\
  !*** ./libs/kafka/src/kafka.service.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KafkaService = void 0;
const define_1 = __webpack_require__(/*! @app/define */ "./libs/define/src/index.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let KafkaService = class KafkaService {
    constructor(client) {
        this.client = client;
    }
    async onModuleInit() {
        this.subcribeTopic();
        await this.client.connect();
    }
    subcribeTopic() {
        if (this.client.subscribeToResponseOf) {
            Object.keys(define_1.KAFKA_TOPICS).forEach((topic) => {
                this.client.subscribeToResponseOf(topic);
            });
        }
    }
    send(pattern, data) {
        return this.client.send(pattern, data).subscribe((response) => null, (error) => common_1.Logger.error(error, 'Kafka send event'));
    }
    emit(pattern, data) {
        return this.client.emit(pattern, data).subscribe((response) => null, (error) => common_1.Logger.error(error, 'Kafka emit event'));
    }
};
KafkaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(define_1.KAFKA_PROVIDER_NAME)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientKafka !== "undefined" && microservices_1.ClientKafka) === "function" ? _a : Object])
], KafkaService);
exports.KafkaService = KafkaService;


/***/ }),

/***/ "./libs/tracer/src/index.ts":
/*!**********************************!*\
  !*** ./libs/tracer/src/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./tracer.module */ "./libs/tracer/src/tracer.module.ts"), exports);
__exportStar(__webpack_require__(/*! ./tracer.service */ "./libs/tracer/src/tracer.service.ts"), exports);


/***/ }),

/***/ "./libs/tracer/src/tracer.module.ts":
/*!******************************************!*\
  !*** ./libs/tracer/src/tracer.module.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TracerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const tracer_service_1 = __webpack_require__(/*! ./tracer.service */ "./libs/tracer/src/tracer.service.ts");
let TracerModule = class TracerModule {
};
TracerModule = __decorate([
    (0, common_1.Module)({
        providers: [tracer_service_1.TracerService],
        exports: [tracer_service_1.TracerService],
    })
], TracerModule);
exports.TracerModule = TracerModule;


/***/ }),

/***/ "./libs/tracer/src/tracer.service.ts":
/*!*******************************************!*\
  !*** ./libs/tracer/src/tracer.service.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TracerService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TracerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const exporter_jaeger_1 = __webpack_require__(/*! @opentelemetry/exporter-jaeger */ "@opentelemetry/exporter-jaeger");
const exporter_trace_otlp_http_1 = __webpack_require__(/*! @opentelemetry/exporter-trace-otlp-http */ "@opentelemetry/exporter-trace-otlp-http");
const instrumentation_1 = __webpack_require__(/*! @opentelemetry/instrumentation */ "@opentelemetry/instrumentation");
const instrumentation_winston_1 = __webpack_require__(/*! @opentelemetry/instrumentation-winston */ "@opentelemetry/instrumentation-winston");
const resources_1 = __webpack_require__(/*! @opentelemetry/resources */ "@opentelemetry/resources");
const sdk_trace_base_1 = __webpack_require__(/*! @opentelemetry/sdk-trace-base */ "@opentelemetry/sdk-trace-base");
const sdk_trace_node_1 = __webpack_require__(/*! @opentelemetry/sdk-trace-node */ "@opentelemetry/sdk-trace-node");
const semantic_conventions_1 = __webpack_require__(/*! @opentelemetry/semantic-conventions */ "@opentelemetry/semantic-conventions");
const shim_opentracing_1 = __webpack_require__(/*! @opentelemetry/shim-opentracing */ "@opentelemetry/shim-opentracing");
const clone = __webpack_require__(/*! clone */ "clone");
const http_1 = __webpack_require__(/*! http */ "http");
const opentracing = __webpack_require__(/*! opentracing */ "opentracing");
const shimmer = __webpack_require__(/*! shimmer */ "shimmer");
const winston = __webpack_require__(/*! winston */ "winston");
const getMethods = (obj) => {
    const properties = new Set();
    let currentObj = obj;
    do {
        Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()].filter((item) => typeof obj[item.toString()] === 'function' &&
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
        ].includes(item.toString()));
};
const shimV2 = (serviceName = 'UAN_TEST_TRACING') => {
    const provider = new sdk_trace_node_1.NodeTracerProvider({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });
    const exporter = new exporter_jaeger_1.JaegerExporter({
        endpoint: 'http://localhost:14268/api/traces',
    });
    provider.addSpanProcessor(new sdk_trace_base_1.SimpleSpanProcessor(exporter));
    provider.register();
    return new shim_opentracing_1.TracerShim(provider.getTracer(serviceName));
};
const shim = (serviceName = 'UAN_TEST_TRACING') => {
    const provider = new sdk_trace_base_1.BasicTracerProvider({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });
    const exporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
    });
    const processor = new sdk_trace_base_1.BatchSpanProcessor(exporter);
    provider.addSpanProcessor(processor);
    provider.register();
    (0, instrumentation_1.registerInstrumentations)({
        instrumentations: [
            new instrumentation_winston_1.WinstonInstrumentation({
                logHook: (span, record) => {
                    record['resource.service.name'] =
                        provider.resource.attributes['service.name'];
                    console.log('WinstonInstrumentation', span);
                },
            }),
        ],
    });
    return new shim_opentracing_1.TracerShim(provider.getTracer(serviceName));
};
let jaeger;
let TracerService = TracerService_1 = class TracerService {
    constructor() {
        this.jaeger = jaeger;
    }
    static initJager() {
        common_1.Logger.log('initJager');
        if (!Object.keys(jaeger || {}).length) {
            opentracing.initGlobalTracer(shim());
            jaeger = opentracing.globalTracer();
        }
    }
    initLogger() {
        common_1.Logger.log('initLogger');
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
                        var _a;
                        try {
                            if (!args.length ||
                                args[args.length - 1] == null ||
                                !((_a = args[args.length - 1]) === null || _a === void 0 ? void 0 : _a.traceContext)) {
                                let result;
                                let error;
                                try {
                                    result = await original.apply(this, [...args]);
                                }
                                catch (e) {
                                    error = e;
                                }
                                if (error)
                                    throw error;
                                return result;
                            }
                            else {
                                const metadata = clone(args.pop());
                                const traceCxtArr = metadata.traceContext.split(',');
                                const requestId = traceCxtArr.shift();
                                const parentSpan = traceCxtArr.pop();
                                const rootSpan = traceCxtArr.shift();
                                const tracer = new TracerService_1();
                                tracer.init({ requestId });
                                tracer.SpanStart(`${spanName} - ${method}`, parentSpan);
                                const tags = metadata.tags || {};
                                tracer.Tag('req_time', tags.req_time && tags.req_time.toString());
                                tracer.Tag('req_id_uniq', tags.req_id_uniq);
                                tracer.Tag('phone', tags.phone);
                                tracer.LogInput(...args);
                                const currSpan = tracer.ExportTraceContext();
                                metadata.traceContext = `${requestId},${rootSpan || currSpan},${currSpan}`;
                                let result;
                                let error;
                                try {
                                    result = await original.apply(this, [...args, metadata]);
                                }
                                catch (e) {
                                    error = e;
                                }
                                if (error)
                                    tracer.LogError(error);
                                if (result)
                                    tracer.LogOutput(result);
                                tracer.SpanFinish();
                                if (error)
                                    throw error;
                                return result;
                            }
                        }
                        catch (error) {
                            common_1.Logger.error(error, 'Wrap Trace');
                        }
                    };
                }
                else {
                    return function wrappedFunction(...args) {
                        try {
                            if (!args.length ||
                                args[args.length - 1] == null ||
                                !args[args.length - 1].traceContext) {
                                let result;
                                let error;
                                try {
                                    result = original.apply(this, [...args]);
                                }
                                catch (e) {
                                    error = e;
                                }
                                if (error)
                                    throw error;
                                return result;
                            }
                            else {
                                const metadata = clone(args.pop());
                                const traceCxtArr = metadata.traceContext.split(',');
                                const requestId = traceCxtArr.shift();
                                const parentSpan = traceCxtArr.pop();
                                const rootSpan = traceCxtArr.shift();
                                const tracer = new TracerService_1();
                                tracer.init({ requestId });
                                tracer.SpanStart(`${spanName} - ${method}`, parentSpan);
                                const tags = metadata.tags || {};
                                tracer.Tag('req_time', tags.req_time && tags.req_time.toString());
                                tracer.Tag('req_id_uniq', tags.req_id_uniq);
                                tracer.Tag('phone', tags.phone);
                                tracer.LogInput(...args);
                                const currSpan = tracer.ExportTraceContext();
                                metadata.traceContext = `${requestId},${rootSpan || currSpan},${currSpan}`;
                                let result;
                                let error;
                                try {
                                    result = original.apply(this, [...args, metadata]);
                                }
                                catch (e) {
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
                                if (error)
                                    throw error;
                                return result;
                            }
                        }
                        catch (error) {
                            common_1.Logger.error(error, 'Wrap Trace');
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
    SpanStartV2(name, parentSpan) {
        this.span = this.jaeger.startSpan(name, {
            childOf: parentSpan || null,
        });
        this.span.setTag('request_id', this.requestId);
        return this.span;
    }
    SpanFinish() {
        if (this.span)
            this.span.finish();
    }
    LogInput(...params) {
        if (this.span) {
            const input = {};
            params.forEach((param, i) => {
                if (!!param &&
                    !!param.constructor &&
                    !['Object', 'String', 'Number'].includes(param.constructor.name)) {
                    try {
                        input[`input ${i}`] = JSON.stringify(param.constructor.name);
                    }
                    catch (error) {
                    }
                    finally {
                        input[`input ${i}`] = param.constructor.name;
                    }
                }
                else {
                    input[`input ${i}`] = JSON.stringify(param);
                }
            });
            return this.span.log(input);
        }
    }
    LogOutput(...params) {
        if (this.span) {
            const output = {};
            params.forEach((param, i) => {
                if (!!param &&
                    !!param.constructor &&
                    ['ClientSession'].includes(param.constructor.name)) {
                    try {
                        output[`output ${i}`] = JSON.stringify(param.constructor.name);
                    }
                    catch (error) {
                    }
                    finally {
                        output[`output ${i}`] = param.constructor.name;
                    }
                }
                else {
                    if (param instanceof http_1.ServerResponse) {
                    }
                    else if (JSON.stringify(param).length > 64569) {
                        output[`output ${i}`] = {
                            message: `span size ${JSON.stringify(param).length} is larger than maxSpanSize 64569`,
                        };
                    }
                    else {
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
        if (this.span)
            this.span.setTag(name, value);
    }
};
TracerService = TracerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TracerService);
exports.TracerService = TracerService;


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const connect_1 = __webpack_require__(/*! @app/connect */ "./libs/connect/src/index.ts");
const kafka_1 = __webpack_require__(/*! @app/kafka */ "./libs/kafka/src/index.ts");
const tracer_1 = __webpack_require__(/*! @app/tracer */ "./libs/tracer/src/index.ts");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const app_controller_1 = __webpack_require__(/*! ./controllers/app.controller */ "./src/controllers/app.controller.ts");
const Services = __webpack_require__(/*! ./services */ "./src/services/index.ts");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ envFilePath: '.env' }),
            connect_1.ConnectModule,
            tracer_1.TracerModule,
            axios_1.HttpModule,
            kafka_1.KafkaModule.forRoot(),
        ],
        controllers: [app_controller_1.AppController],
        providers: [...Object.values(Services)],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./src/controllers/app.controller.ts":
/*!*******************************************!*\
  !*** ./src/controllers/app.controller.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const services_1 = __webpack_require__(/*! src/services */ "./src/services/index.ts");
const interceptors_1 = __webpack_require__(/*! ../interceptors */ "./src/interceptors/index.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getHello() {
        return 'Hello World!';
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    (0, common_1.UseInterceptors)(interceptors_1.WrapFuncInterceptor),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof services_1.AppService !== "undefined" && services_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./src/interceptors/index.ts":
/*!***********************************!*\
  !*** ./src/interceptors/index.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./wrap.interceptor */ "./src/interceptors/wrap.interceptor.ts"), exports);


/***/ }),

/***/ "./src/interceptors/wrap.interceptor.ts":
/*!**********************************************!*\
  !*** ./src/interceptors/wrap.interceptor.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WrapFuncInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
let WrapFuncInterceptor = class WrapFuncInterceptor {
    intercept(context, next) {
        common_1.Logger.log("---------------ReqInterceptor before");
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            common_1.Logger.log("---------------ReqInterceptor after");
            return { data };
        }));
    }
};
WrapFuncInterceptor = __decorate([
    (0, common_1.Injectable)()
], WrapFuncInterceptor);
exports.WrapFuncInterceptor = WrapFuncInterceptor;


/***/ }),

/***/ "./src/services/app.service.ts":
/*!*************************************!*\
  !*** ./src/services/app.service.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "./src/services/index.ts":
/*!*******************************!*\
  !*** ./src/services/index.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./app.service */ "./src/services/app.service.ts"), exports);


/***/ }),

/***/ "@nestjs/axios":
/*!********************************!*\
  !*** external "@nestjs/axios" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/microservices":
/*!****************************************!*\
  !*** external "@nestjs/microservices" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

/***/ }),

/***/ "@nestjs/websockets":
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),

/***/ "@opentelemetry/exporter-jaeger":
/*!*************************************************!*\
  !*** external "@opentelemetry/exporter-jaeger" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/exporter-jaeger");

/***/ }),

/***/ "@opentelemetry/exporter-trace-otlp-http":
/*!**********************************************************!*\
  !*** external "@opentelemetry/exporter-trace-otlp-http" ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/exporter-trace-otlp-http");

/***/ }),

/***/ "@opentelemetry/instrumentation":
/*!*************************************************!*\
  !*** external "@opentelemetry/instrumentation" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/instrumentation");

/***/ }),

/***/ "@opentelemetry/instrumentation-winston":
/*!*********************************************************!*\
  !*** external "@opentelemetry/instrumentation-winston" ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/instrumentation-winston");

/***/ }),

/***/ "@opentelemetry/resources":
/*!*******************************************!*\
  !*** external "@opentelemetry/resources" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/resources");

/***/ }),

/***/ "@opentelemetry/sdk-trace-base":
/*!************************************************!*\
  !*** external "@opentelemetry/sdk-trace-base" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/sdk-trace-base");

/***/ }),

/***/ "@opentelemetry/sdk-trace-node":
/*!************************************************!*\
  !*** external "@opentelemetry/sdk-trace-node" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/sdk-trace-node");

/***/ }),

/***/ "@opentelemetry/semantic-conventions":
/*!******************************************************!*\
  !*** external "@opentelemetry/semantic-conventions" ***!
  \******************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/semantic-conventions");

/***/ }),

/***/ "@opentelemetry/shim-opentracing":
/*!**************************************************!*\
  !*** external "@opentelemetry/shim-opentracing" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/shim-opentracing");

/***/ }),

/***/ "clone":
/*!************************!*\
  !*** external "clone" ***!
  \************************/
/***/ ((module) => {

module.exports = require("clone");

/***/ }),

/***/ "opentracing":
/*!******************************!*\
  !*** external "opentracing" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("opentracing");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),

/***/ "shimmer":
/*!**************************!*\
  !*** external "shimmer" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("shimmer");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableShutdownHooks();
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    await app.startAllMicroservices();
    await app.listen(process.env.PORT, () => {
        common_1.Logger.log('Listening at http://localhost:' + process.env.PORT + '/' + globalPrefix);
    });
}
bootstrap();

})();

/******/ })()
;