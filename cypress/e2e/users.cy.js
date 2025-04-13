describe('Post /users', () => {

  beforeEach(function () {
    cy.fixture('users.json').then(function (users) {
      this.users = users
    })
  })

  it('register a new user', function () {

    const user = this.users.create

    cy.task('removeUser', user.email)

    cy.postUser(user)
      .then(response => {
        expect(response.status).to.eq(200)
      })
  })

  it('duplicate email', function () {

    const user = this.users.duplicated_email

    cy.task('removeUser', user.email)

    cy.postUser(user)

    cy.postUser(user)
      .then(response => {

        const { message } = response.body

        expect(response.status).to.eq(409)
        expect(message).to.eq('Duplicated email!')
      })
  })

  context('required fields', function () {
    let user;

    beforeEach(function () {
      user = this.users.required_fields
    })

    it('name is required', function () {
      user.name = ''

      cy.postUser(user)
        .then(response => {

          const { message } = response.body

          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"name\" is not allowed to be empty')
        })
    })

    it('email is required', function () {
      user.email = ''

      cy.postUser(user)
        .then(response => {
          const { message } = response.body
          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"email\" is not allowed to be empty')
        })
    })

    it('password is required', function () {
      user.password = ''

      cy.postUser(user)
        .then(response => {
          const { message } = response.body
          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"password\" is not allowed to be empty')
        })
    })
  })
})