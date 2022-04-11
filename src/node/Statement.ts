import { BaseNode } from './Base'

export abstract class StatementNode extends BaseNode {
	constructor(public name: string) {
		super('Statement')
	}
}
