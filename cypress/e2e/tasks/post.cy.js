describe('POST /tasks', () => {

    beforeEach(function () {

        cy.fixture('tasks/post.json').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('register a new task', function () {
        const { user, task } = this.tasks.create

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.purgeQueue()
            .then(response => {
                expect(response.status).to.eq(204)
            })

        cy.postSession(user)
            .then(responseUser => {
                cy.task('removeTask', task.name, user.email)

                cy.postTask(task, responseUser.body.token)
                    .then(responsePostSession => {
                        expect(responsePostSession.status).to.eq(200)
                        expect(responsePostSession.body.name).to.eq(task.name)
                        expect(responsePostSession.body.tags).to.eql(task.tags) //'eql' valida os dados sem se preocupar com a tipagem
                        expect(responsePostSession.body.is_done).to.be.false //'be' em caso de boleano
                        expect(responsePostSession.body.user).to.eq(responseUser.body.user._id)
                        expect(responsePostSession.body._id.length).to.eq(24)

                    })
            })

        cy.wait(4000)

        cy.getMessageQueue()
            .then(responseGetMessage => {
                expect(responseGetMessage.status).to.eq(200)
                expect(responseGetMessage.body[0].payload).to.include(user.name.split(' ')[0])
                expect(responseGetMessage.body[0].payload).to.include(task.name)
                expect(responseGetMessage.body[0].payload).to.include(user.email)
            })

    })


    it('duplicated task', function () {
        const { user, task } = this.tasks.dup

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(responseUser => {
                cy.postTask(task, responseUser.body.token)

                cy.postTask(task, responseUser.body.token)
                    .then(response => {
                        expect(response.status).to.eq(409)
                        expect(response.body.message).to.eq('Duplicated task!')
                    })
            })
    })

})