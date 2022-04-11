import { BaseNode } from './Base'

export class SyntaxContentTextNode extends BaseNode {
	constructor(public value: string) {
		super('SyntaxContentText')
	}
}
