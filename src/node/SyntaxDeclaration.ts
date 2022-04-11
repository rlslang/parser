import { StatementNode } from './Statement'
import { IdentifierNode } from './Identifier'
import { SyntaxFragmentListNode } from './SyntaxFragmentList'

export class SyntaxDeclarationNode extends StatementNode {
	constructor(public identifier: IdentifierNode, public syntaxFragmentList: SyntaxFragmentListNode) {
		super('SyntaxDeclaration')
	}
}
