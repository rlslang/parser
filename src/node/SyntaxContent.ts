import { BaseNode } from './Base'
import { SyntaxContentTextNode } from './SyntaxContentText'
import { SyntaxContentInterpolationNode } from './SyntaxContentInterpolation'

export class SyntaxContentNode extends BaseNode {
	constructor(public children: Array<SyntaxContentTextNode | SyntaxContentInterpolationNode>) {
		super('SyntaxContent')
	}
}
