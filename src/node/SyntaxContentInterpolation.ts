import type { SyntaxFragmentQuantifier } from '@rlsl/types'
import { BaseNode } from './Base'
import { SyntaxFragmentListNode } from './SyntaxFragmentList'

export class SyntaxContentInterpolationNode extends BaseNode {
	constructor(public syntaxFragmentList: SyntaxFragmentListNode, public quantifier: SyntaxFragmentQuantifier | null = null) {
		super('SyntaxContentInterpolation')
	}
}
