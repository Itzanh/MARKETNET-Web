describe('App loads', () => {
    it('load app', () => {
        // open the web
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000/')

        // login
        cy.get('#inputUsername').type('cypress')
        cy.wait(100)
        cy.get('#inputPassword').type('cypress1234')
        cy.get('#loginModalSubmit').click()

        /*// navigate to sales order
        cy.get(':nth-child(1) > .nav-link').click()
        cy.get('.nav-item.show > .dropdown-menu > :nth-child(1)').click()

        // click the add button
        cy.get('.form-row > :nth-child(1) > .btn').click()

        // write the customer
        cy.get(':nth-child(3) > :nth-child(2) > form > div > .form-control').click()
        cy.get(':nth-child(3) > :nth-child(2) > form > div > .form-control').type('I')
        cy.get('#autocomplete-list > div').click()
        cy.get(':nth-child(2) > .btn-primary').click()

        // open the order and create details
        cy.get('tbody > :nth-child(1) > :nth-child(4)').click()

        // detail 1
        cy.get('#salesOrderDetails > .btn').click()
        cy.get('.modal-body > form > div > .form-control').click()
        cy.get('.modal-body > form > div > .form-control').type('G')
        cy.get('#autocomplete-list > :nth-child(1)').click()
        cy.get('.modal-footer > .btn-primary').click()

        // detail 2
        cy.get('#salesOrderDetails > :nth-child(2)').click()
        cy.get('.modal-body > form > div > .form-control').click()
        cy.get('.modal-body > form > div > .form-control').type('D')
        cy.get('#autocomplete-list > :nth-child(1)').click()
        cy.get('.modal-footer > .btn-primary').click()

        // delete details
        cy.get('tbody > :nth-child(2) > :nth-child(2)').click()
        cy.wait(500)
        cy.get('.modal-footer > .btn-danger').click()
        cy.get('tbody > tr > :nth-child(2)').click()
        cy.wait(500)
        cy.get('.modal-footer > .btn-danger').click()

        // delete order
        cy.get(':nth-child(2) > .btn-danger').click()*/
    })
})