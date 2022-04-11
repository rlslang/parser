import { ConveyorBelt } from '@rlsl/conveyor-belt'
import { Token, TokenType } from '@rlsl/lexer'
import type { SyntaxFragmentQuantifier } from '@rlsl/types'
import {
	IdentifierNode,
	ProgramNode,
	StatementNode,
	SyntaxContentNode,
	SyntaxContentTextNode,
	SyntaxContentInterpolationNode,
	SyntaxDeclarationNode,
	SyntaxFragmentListNode,
} from './node'

export class Parser {
	private tokens: ConveyorBelt<Token>
	public errors: Array<Error>
	constructor(tokens: Array<Token>) {
		this.tokens = new ConveyorBelt(tokens)
		this.errors = []
	}
	private skipWhitespace() {
		return this.tokens.takeWhile(token => [ TokenType.EOL, TokenType.SPACE, TokenType.TAB ].includes(token.type))
	}
	protected take() {
		const token = this.tokens.take()
		if (this.tokens.current === null) {
			this.errors.push(new Error('got `undefined` before get `TokenType.EOF`'))
			return null
		}
		return token
	}
	private isCurrToken(...tokenTypes: [ TokenType, ...Array<TokenType> ]) {
		return tokenTypes.includes(this.tokens.current?.type!)
	}
	private expectCurrToken(...expectedTokenTypes: [ TokenType, ...Array<TokenType> ]) {
		const includes = this.isCurrToken(...expectedTokenTypes)
		if (!includes) this.errors.push(
			new Error(`expected ${
				expectedTokenTypes.length === 1
				 ? expectedTokenTypes[0]
				 : `one of ${expectedTokenTypes.join(', ')}`
			}, but got ${this.tokens.current?.type}`)
		)
		return includes
	}
	public parseProgram() {
		const statements: Array<StatementNode> = []
		for (;;) {
			const currToken = this.tokens.current
			if (currToken === null) {
				this.errors.push(new Error('got `null` before get `TokenType.EOF`'))
				return null
			}
			if (currToken.type === TokenType.EOF) break
			const statement = this.parseStatement()
			if (statement === null) return null
			statements.push(statement)
		}
		return new ProgramNode(statements)
	}
	private parseStatement() {
		return this.parseSyntaxDeclaration() // there is only one statement type in the language yet
	}
	private parseSyntaxDeclaration() {
		this.skipWhitespace()
		console.log(0, this.tokens.current)
		if (!this.expectCurrToken(TokenType.IDENTIFIER)) return null
		const identifier = new IdentifierNode(this.take()!.value)
		this.skipWhitespace()
		console.log(1, identifier)
		if (!this.expectCurrToken(TokenType.EQUAL)) return null
		this.take()
		const syntaxFragmentList = this.parseSyntaxFragmentList()
		console.log(2, identifier, syntaxFragmentList)
		if (syntaxFragmentList === null) return null
		console.log(3, 'declaration', identifier, syntaxFragmentList)
		return new SyntaxDeclarationNode(identifier, syntaxFragmentList)
	}
	private parseSyntaxFragmentList() {
		const syntaxFragments: Array<IdentifierNode | SyntaxContentNode> = []
		this.skipWhitespace()
		if (this.isCurrToken(TokenType.PIPE)) this.take()
		const firstSyntaxFragment = this.parseSyntaxFragment()
		if (firstSyntaxFragment === null) return null
		syntaxFragments.push(firstSyntaxFragment)
		while (this.skipWhitespace(), this.isCurrToken(TokenType.PIPE)) {
			this.take()
			const syntaxFragment = this.parseSyntaxFragment()
			if (syntaxFragment === null) return null
			syntaxFragments.push(syntaxFragment)
		}
		return new SyntaxFragmentListNode(syntaxFragments)
	}
	private parseSyntaxFragment() {
		this.skipWhitespace()
		switch (this.tokens.current?.type) {
			case TokenType.IDENTIFIER:
				return new IdentifierNode(this.take()!.value)
			case TokenType.BACKTICK:
				return this.parseSyntaxContent()
			default:
				return null
		}
	}
	private parseSyntaxContent() {
		if (!this.expectCurrToken(TokenType.BACKTICK)) return null
		const children: Array<SyntaxContentInterpolationNode | SyntaxContentTextNode> = []
		this.take()
		while (!this.isCurrToken(TokenType.BACKTICK)) {
			if (this.isCurrToken(TokenType.INTERPOLATION_START)) {
				this.take()
				const syntaxFragmentList = this.parseSyntaxFragmentList()
				if (syntaxFragmentList === null) return null
				const quantifier = this.isCurrToken(TokenType.COMMA) ? (() => {
					this.take()
					this.skipWhitespace()
					if (!this.expectCurrToken(TokenType.QUESTION, TokenType.ASTERISK, TokenType.PLUS)) return null
					return this.take()!.value as SyntaxFragmentQuantifier
				})() : null
				if (!this.expectCurrToken(TokenType.RIGHT_BRACE)) return null
				this.take()
				children.push(new SyntaxContentInterpolationNode(syntaxFragmentList, quantifier))
			} else {
				const taken = this.take()!
				const child = children.at(-1)
				if (child instanceof SyntaxContentTextNode) child.value += taken.value
				else children.push(new SyntaxContentTextNode(taken.value))
			}
		}
		this.take() // take closing `
		return new SyntaxContentNode(children)
	}
}
