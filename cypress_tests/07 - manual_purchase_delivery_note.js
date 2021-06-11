describe('Manual Purchase Delivery Note', () => {
    it('manual purchase delivery note', () => {
        cy.viewport(1920, 1080)

        // navigate to sales order
        cy.get(':nth-child(2) > .nav-link').click()
        cy.get('.nav-item.show > .dropdown-menu > :nth-child(3)').click()

        // click the add button
        cy.get('.form-row > :nth-child(1) > .btn').click()

        // write the customer
        cy.get('#tabPurchaseDeliveryNote > :nth-child(3) > :nth-child(2) > form > div > .form-control').click()
        cy.get('#tabPurchaseDeliveryNote > :nth-child(3) > :nth-child(2) > form > div > .form-control').type('P')
        cy.get('#autocomplete-list > div').click()
        cy.get(':nth-child(3) > :nth-child(1) > .form-row > :nth-child(2) > form > div > .form-control').click()
        cy.get(':nth-child(3) > :nth-child(1) > .form-row > :nth-child(2) > form > div > .form-control').type('M')
        cy.get('#autocomplete-list > div').click()
        cy.get(':nth-child(2) > .btn-primary').click()

        // open the order and create details
        cy.get('tbody > :nth-child(1) > :nth-child(3)').click()

        // detail 1
        cy.get('#purchaseDeliveryNoteDetails > .btn').click()
        cy.get('.modal-body > :nth-child(2) > div > .form-control').click()
        cy.get('.modal-body > :nth-child(2) > div > .form-control').type('G')
        cy.get('#autocomplete-list > :nth-child(1)').click()
        cy.get('.modal-body > .form-row > :nth-child(1) > .form-control').click()
        cy.get('.modal-body > .form-row > :nth-child(1) > .form-control').type('1')
        cy.wait(50)
        cy.get('.modal-footer > .btn-primary').click()

        // detail 2
        cy.get('#purchaseDeliveryNoteDetails > :nth-child(2)').click()
        cy.get('.modal-body > :nth-child(2) > div > .form-control').click()
        cy.get('.modal-body > :nth-child(2) > div > .form-control').type('D')
        cy.get('#autocomplete-list > :nth-child(1)').click()
        cy.get('.modal-body > .form-row > :nth-child(1) > .form-control').click()
        cy.get('.modal-body > .form-row > :nth-child(1) > .form-control').type('2')
        cy.wait(50)
        cy.get('.modal-footer > .btn-primary').click()

        // delete details
        cy.wait(50)
        cy.get('tbody > :nth-child(2) > :nth-child(2)').click()
        cy.wait(500)
        cy.get('.modal-footer > .btn-danger').click()
        cy.get('tbody > tr > :nth-child(2)').click()
        cy.wait(500)
        cy.get('.modal-footer > .btn-danger').click()

        // delete order
        cy.get(':nth-child(2) > .btn-danger').click()
    })
})