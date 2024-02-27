import {normalize, strings} from '@angular-devkit/core';
import {apply, mergeWith, move, Rule, SchematicContext, template, Tree, url} from '@angular-devkit/schematics';

export type Options = {
  "name": string,
  "path": string
}

export function crudControllerSchematics(_options: Options): Rule {
  const { path, ...options }: Options = _options;

  return (tree: Tree, _context: SchematicContext): ReturnType<Rule> => {

    const sourceTemplate = url('./files');
    const sourceParametryzeTemplate = apply(sourceTemplate, [
        template({ ...options, ...strings }),
        move(normalize(path)),
      ],
    );
    tree = mergeWith(sourceParametryzeTemplate)(tree, _context) as Tree;
    return tree;
  };
}
