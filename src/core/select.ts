import type { FieldNode, InlineFragmentNode, SelectionNode, SelectionSetNode } from 'graphql'
import { Kind } from 'graphql'
import type { ArrayMayFollowItem } from '../utils/object'
import { DollarContext, type DollarPayload, type FieldDollar, type SelectionDollar, initFieldDollar, initSelectionDollar } from './dollar'
import { parseArgs } from './arg'
import { parseDirective } from './directive'

export type TypeSelection<Var extends DollarPayload> =
  Exclude<SelectionContext<Var>, true>

export type SelectionSet<Var extends DollarPayload> =
  | SelectionContext<Var>
  | (($: SelectionDollar<Var>) => DollarContext<SelectionContext<Var>>)

export type SelectionContext<Var extends DollarPayload> =
  | ArrayMayFollowItem<SelectionField<Var>, SelectionObject<Var>>
  | true

export type SelectionField<Var extends DollarPayload> =
  | string
  | (($: FieldDollar<Var>) => DollarContext<string>)

export interface SelectionObject<Var extends DollarPayload> {
  [key: string]: SelectionSet<Var>
}

export function parseTypeSelection<
  Var extends DollarPayload,
>(
  selectionSet: TypeSelection<Var>,
): SelectionSetNode {
  const selections: Array<SelectionNode> = []

  const last = selectionSet[selectionSet.length - 1]
  const items = selectionSet.slice(0, -1) as Array<SelectionField<Var>>

  const selects: SelectionObject<Var> = {}
  const addField = (field: SelectionField<Var>) => {
    if (typeof field === 'function') {
      const context = field(initFieldDollar())
      selects[context.content] = () =>
        new DollarContext<SelectionContext<Var>>(
          true,
          context.args,
          context.directives,
        )
    }
    else {
      selects[field] = true
    }
  }

  items.forEach(item => addField(item))
  if (typeof last === 'object') {
    Object.assign(selects, last)
  }
  else {
    addField(last)
  }

  Object.keys(selects).forEach((key) => {
    selections.push(parseSelection(key, selects[key]))
  })

  return {
    kind: Kind.SELECTION_SET,
    selections,
  } satisfies SelectionSetNode
}

export function parseSelection<
  Var extends DollarPayload,
>(
  key: string,
  selection: SelectionSet<Var>,
): SelectionNode {
  if (typeof selection === 'function') {
    const { args, directives, content } = selection(initSelectionDollar())

    const node = parseSelection(key, content)
    if (node.kind === Kind.FIELD) {
      return {
        ...node,
        arguments: parseArgs(args),
        directives: parseDirective(directives),
      } satisfies FieldNode | InlineFragmentNode
    }

    if (node.kind === Kind.INLINE_FRAGMENT) {
      if (Object.keys(args).length > 0) {
        throw new Error('Unexpected arguments on inline fragment')
      }

      return {
        ...node,
        directives: parseDirective(directives),
      } satisfies FieldNode | InlineFragmentNode
    }

    throw new Error(`Unexpected selection kind: ${node.kind}`)
  }

  const selectionSetNode = parseSelectionContext(selection)

  // Inline fragment
  if (key.startsWith('...')) {
    const type = key.startsWith('... on')
      ? /... on (\w+)/.exec(key)![1].trim()
      : undefined // self-referencing

    if (!selectionSetNode) {
      throw new Error('Unexpected field selection set for inline fragment')
    }

    return {
      kind: Kind.INLINE_FRAGMENT,
      typeCondition: type
        ? {
            kind: Kind.NAMED_TYPE,
            name: {
              kind: Kind.NAME,
              value: type,
            },
          }
        : undefined,
      selectionSet: selectionSetNode,
    } satisfies InlineFragmentNode
  }

  // Field
  const { name, value } = parseAlias(key)
  return {
    kind: Kind.FIELD,
    arguments: [],
    alias: value === name
      ? undefined
      : {
          kind: Kind.NAME,
          value: name,
        },
    name: {
      kind: Kind.NAME,
      value,
    },
    selectionSet: selectionSetNode,
  } satisfies FieldNode
}

function parseAlias(key: string): { name: string, value: string } {
  const [name, value] = key.split(':').map(s => s.trim())
  if (!value) {
    return { name, value: name }
  }
  return { name, value }
}

export function parseSelectionContext<
  Var extends DollarPayload,
>(
  selectionSet: SelectionContext<Var>,
): SelectionSetNode | undefined {
  if (selectionSet === true) {
    return undefined
  }

  return parseTypeSelection(selectionSet)
}
