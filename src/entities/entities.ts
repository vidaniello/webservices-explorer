import {Types, Schema, Model, model, Document, PopulatedDoc} from 'mongoose';

export class Alias {
    _id: string;
    aliasName: string;
    descrizione: string;
    abilitato: boolean;
    service: string | Service;
}

export class Service{
    _id: string;
    serviceName: string;
    endpointsDeployed: Types.Array<string>;
    descrizione: string;
    //aliases: [string | Alias];
    aliases: [PopulatedDoc<Document<string, any, Alias> & Alias> | null]
}

const serviceSchema = new Schema<Service>({
    _id: {type: String, alias: 'serviceName'},
    endpointsDeployed: {type: [String]},
    descrizione: {type: String},
    aliases: [{type: String, ref: ()=>AliasModel}]
}, {versionKey: false, timestamps: true, id: false, toObject: {virtuals: true}});
export const ServiceModel: Model<Service> = model<Service>('Service', serviceSchema);

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

const aliasSchema = new Schema<Alias>({
    _id: {type: String, alias: 'aliasName'},
    descrizione: {type: String},
    abilitato: {type: Boolean},
    service: {type: String, ref: ()=>ServiceModel}
}, {versionKey: false, timestamps: true, id: false, toObject: {virtuals: true}});
export const AliasModel: Model<Alias> = model<Alias>('Alias', aliasSchema);

/*
export interface PoupolatedAlias {
    service : Document<unknown, any, Service> & Service | null
}
*/