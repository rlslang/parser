import { BaseNode } from './Base'

export class IdentifierNode extends BaseNode {
	constructor(public value: string) {
		super('Identifier')
	}
}
