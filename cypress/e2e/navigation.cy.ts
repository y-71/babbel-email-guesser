context('Navigation', ()=>{
    beforeEach(() => {
        cy.visit('http://localhost:3000');
      })
    it('should render inputs for the name and the email and a submission button', ()=>{
        cy.get('input[id=name]').invoke('attr', 'placeholder').should('contain', 'name');
        cy.get('input[id=domain]').invoke('attr', 'placeholder').should('contain', 'domain');
        cy.get('button').contains('Make a Guess');
    })
})
export{}