import { Entity } from "typeorm";

@Entity({ name: '<%= name %>' })
export class <%= classify(name) %>Entity extends MetaEntity {}