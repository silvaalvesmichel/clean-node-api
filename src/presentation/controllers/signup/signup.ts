import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {

    private emailValidator: EmailValidator
    private addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFilds = ['name', 'email', 'password', 'password', 'passwordConfirmation']
            for (const field of requiredFilds) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { name, email, password, passwordConfirmation } = httpRequest.body
            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const account = await this.addAccount.add({
                name,
                email,
                password

            })

            return ok(account)

        } catch (error) {
            return serverError()
        }
    }
}