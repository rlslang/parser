import { BaseNode } from './Base'
import type { StatementNode } from './Statement'

export class ProgramNode extends BaseNode {
	constructor(public statements: Array<StatementNode>) {
		super('Program')
	}
}
