/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { GraphQLNonNull } from './definition';
import type { GraphQLArgument } from './definition';
import { GraphQLBoolean } from './scalars';
import invariant from '../jsutils/invariant';
import { assertValidName } from '../utilities/assertValidName';


export const DirectiveLocation = {
  QUERY: 'QUERY',
  MUTATION: 'MUTATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  FIELD: 'FIELD',
  FRAGMENT_DEFINITION: 'FRAGMENT_DEFINITION',
  FRAGMENT_SPREAD: 'FRAGMENT_SPREAD',
  INLINE_FRAGMENT: 'INLINE_FRAGMENT',
};

export type DirectiveLocationEnum = $Keys<typeof DirectiveLocation>; // eslint-disable-line

/**
 * Directives are used by the GraphQL runtime as a way of modifying execution
 * behavior. Type system creators will usually not create these directly.
 */
export class GraphQLDirective {
  name: string;
  description: ?string;
  locations: Array<DirectiveLocationEnum>;
  args: Array<GraphQLArgument>;

  constructor(config: GraphQLDirectiveConfig) {
    invariant(config.name, 'Directive must be named.');
    assertValidName(config.name);
    invariant(
      Array.isArray(config.locations),
      'Must provide locations for directive.'
    );
    this.name = config.name;
    this.description = config.description;
    this.locations = config.locations;
    this.args = config.args || [];
  }
}

type GraphQLDirectiveConfig = {
  name: string;
  description?: ?string;
  locations: Array<DirectiveLocationEnum>;
  args?: ?Array<GraphQLArgument>;
}

/**
 * Used to conditionally include fields or fragments
 */
export const GraphQLIncludeDirective = new GraphQLDirective({
  name: 'include',
  description:
    'Directs the executor to include this field or fragment only when ' +
    'the `if` argument is true.',
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.FRAGMENT_SPREAD,
    DirectiveLocation.INLINE_FRAGMENT,
  ],
  args: [
    { name: 'if',
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Included when true.' }
  ],
});

/**
 * Used to conditionally skip (exclude) fields or fragments
 */
export const GraphQLSkipDirective = new GraphQLDirective({
  name: 'skip',
  description:
    'Directs the executor to skip this field or fragment when the `if` ' +
    'argument is true.',
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.FRAGMENT_SPREAD,
    DirectiveLocation.INLINE_FRAGMENT,
  ],
  args: [
    { name: 'if',
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Skipped when true.' }
  ],
});
