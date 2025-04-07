describe('Authentication and Navigation Flow', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/login'); // Go to login page
    });
  
    it('should log in successfully and redirect to Home', () => {
      cy.get('input[name="email"]').type('smartcarpool1@gmail.com'); // Change based on your app's fields
      cy.get('input[name="password"]').type('1234');
      cy.get('button[type="submit"]').click();
      
      // Verify redirection to Home
      cy.url().should('include', '/');
      cy.contains('Analytics').should('be.visible'); // Change based on actual Home page content
      cy.contains('Analytics Charts').should('be.visible'); // Change based on actual Home page content
    });
  });

  it('should navigate through menu options', () => {
    // Log in first
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('smartcarpool1@gmail.com');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();
    
    // Ensure we are on home page after login
    cy.url().should('include', '/');
  
    // Wait for page load before clicking menu items
    cy.contains('Passengers', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/passengers');
  
    cy.contains('Drivers', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/drivers');

    cy.contains('Ride History', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/rides');

    cy.contains('Pending Applications', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/pending-applications');

    cy.contains('Ratings and Reviews', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/ratings-and-reviews');
    
    cy.contains('Complaints', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/contact-us');
    
    cy.contains('Packages', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/packages');

    cy.contains('Settings', { timeout: 5000 }).should('be.visible').click();
    cy.url().should('include', '/settings');
  });
  
  
  
  