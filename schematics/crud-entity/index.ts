import {apply, mergeWith, move, Rule, SchematicContext, template, Tree, url} from '@angular-devkit/schematics';
import {normalize, strings} from "@angular-devkit/core";


export type Options = {
  "name": string,
  "path": string
}

export function crudEntitySchematics(_options: Options): Rule {
  const { path, ...options }: Options = _options;

  return (tree: Tree, _context: SchematicContext): ReturnType<Rule> => {

    const sourceTemplate = url('./files');
    const sourceParameterizeTemplate = apply(sourceTemplate, [
        template({ ...options, ...strings }),
        move(normalize(path)),
      ],
    );
    return mergeWith(sourceParameterizeTemplate)(tree, _context);
  };
}