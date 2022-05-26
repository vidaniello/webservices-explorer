import {Types, Schema, Model, model, Document, PopulatedDoc} from 'mongoose';

/** Alias */
export class Alias {
    _id: string;
    aliasName: string;
    serviceParent: Service;
}
export let serviceParent = 'serviceParent';
type AliasDocumentProps = {
    serviceParent: PopulatedDoc<Document<string, any, Service> & Service> | null;
};

type AliasModelType = Model<Alias, {}, AliasDocumentProps>;

const aliasSchema = new Schema<Alias, AliasModelType>({
    _id: {type: String, alias: 'aliasName'},
    serviceParent: {type: String, ref: ()=>ServiceModel}
}, {versionKey: false, timestamps: true, id: false, toObject: {virtuals: true}});

export const AliasModel = model<Alias, AliasModelType>('Alias', aliasSchema);




/** Endpoint */
export class Endpoint{
    url: string;
    enabled: boolean;
}
const endpointSchema = new Schema<Endpoint>({
    url: {type: String},
    enabled: {type: Boolean}
}, {_id: false});






/** Service functions */
export class AbstractParam {
    name: string;
    description: string;
    format: string;
    required: boolean;
    defaultValue: string;
};
export class PathParam extends AbstractParam {};
export class QueryParam extends AbstractParam {};
const abstractParamSchema = new Schema<AbstractParam>({
    name: {type: String},
    description: {type: String},
    format: {type: String},
    required: {type: Boolean},
    defaultValue: {type: String}
}, {_id: false});

export enum HTTP_METHOD {
    GET,
    POST,
    PATCH,
    DELETE,
    PUT,
    OPTIONS,
    HEAD,
    CONNECT,
    TRACE
}

export class ExceptionThrowed {
    exceptionType: string;
    code: string;
    description: string;
}
const exceptionThrowedSchema = new Schema<ExceptionThrowed>({
    exceptionType: {type: String},
    code: {type: String},
    description: {type: String},
}, {_id: false});

export class ServiceFunction {
    path: string;
    method: HTTP_METHOD | string;
    description: string;
    pathParams: PathParam[];
    queryParams: QueryParam[];
    bodyContent: string;
    return: string;
    throws: ExceptionThrowed[];
    other: string;
};
type ServiceFunctionsProps = {
    pathParams: Types.DocumentArray<PathParam>;
    queryParams: Types.DocumentArray<QueryParam>;
    throws: Types.DocumentArray<ExceptionThrowed>;
};
type ServiceFunctionsType = Model<ServiceFunction, {}, ServiceFunctionsProps>;
const serviceFunctionSchema = new Schema<ServiceFunction, ServiceFunctionsType>({
    path: {type: String},
    method: {type: String, enum: HTTP_METHOD},
    description: {type: String},
    pathParams: [abstractParamSchema],
    queryParams: [abstractParamSchema],
    bodyContent: {type: String},
    return: {type: String},
    throws: [exceptionThrowedSchema],
    other: {type: String}
}, {_id: false});








/** Service */
export class Service{
    _id: string;
    serviceName: string;
    endpointsDeployed: Endpoint[];
    description: string;
    //aliases: [string | Alias];
    serviceNameAliases: Alias[];
    functions: ServiceFunction[];
    other: string;
    openAPIReferences: string[];
}
export let serviceNameAliases = 'serviceNameAliases';
type ServiceDocumentProps = {
    endpointsDeployed: Types.DocumentArray<Endpoint>;
    serviceNameAliases: [PopulatedDoc<Document<string, any, Alias> & Alias> | null];
    functions: Types.DocumentArray<ServiceFunction>;
    openAPIfiles: Types.Array<string>;
};
type ServiceModelType = Model<Service, {}, ServiceDocumentProps>;

const serviceSchema = new Schema<Service, ServiceModelType>({
    _id: {type: String, alias: 'serviceName'},
    endpointsDeployed: [endpointSchema],
    description: {type: String},
    serviceNameAliases: [{type: String, ref: ()=>AliasModel}],
    functions: [serviceFunctionSchema],
    other: {type: String},
    openAPIReferences: [{type: String}]
}, {versionKey: false, timestamps: true, id: false, toObject: {virtuals: true}});
export const ServiceModel = model<Service, ServiceModelType>('Service', serviceSchema);






/** Entity */
export class FieldType {
    filedType: string;
    description: string;
    required: boolean;
}
const fieldTypeSchema = new Schema<FieldType>({
    filedType: {type: String},
    description: {type: String},
    required: {type: Boolean}
}, {_id: false});

export class ObjectType {
    name: string;
    description: string;
    fields: Map<string, FieldType>;
}
type ObjectTypeProps = {
    //fields: Types.
};
type ObjectTypeType = Model<ObjectType, {}, ObjectTypeProps>;
const objectTypeSchema = new Schema<ObjectType, ObjectTypeType>({
    name: {type: String},
    description: {type: String},
    fields: {type: Map, of: fieldTypeSchema}
});
export const ObjectTypeModel = model<ObjectType, ObjectTypeType>('ObjectType', objectTypeSchema);




/*
serviceSchema.virtual('come').get(function(){
    return this.endpoints[0]
});
*/
/*
export interface PoupolatedService {
    aliases : [Document<unknown, any, Alias> & Alias | null]
}
*/



/*
export interface PoupolatedAlias {
    service : Document<unknown, any, Service> & Service | null
}
*/

