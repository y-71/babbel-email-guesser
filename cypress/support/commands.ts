export function elementExists(selector: string) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length) {
        return cy.get(selector)
      } else {
        // Throws no error when element not found
        assert.isOk('OK', 'Element does not exist.')
      }
    })
  }