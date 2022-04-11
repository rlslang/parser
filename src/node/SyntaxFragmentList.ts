import { BaseNode } from './Base'
import { IdentifierNode } from './Identifier'
import { SyntaxContentNode } from './SyntaxContent'

export class SyntaxFragmentListNode extends BaseNode {
	constructor(public fragments: Array<IdentifierNode | SyntaxContentNode>) {
		super('SyntaxFragmentList')
	}
}
