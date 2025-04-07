describe("Home Page Tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/login");
      
        cy.get('input[name="email"]').type("smartcarpool1@gmail.com");
        cy.get('input[name="password"]').type("1234");
        cy.get('button[type="submit"]').click();
      
        // ✅ Wait for token to be stored before proceeding
        cy.window().then((win) => {
          cy.wrap(win)
            .its("localStorage.token")
            .should("exist"); // Ensure token is stored
        });
      
        cy.visit("http://localhost:5173/");
      });
      
      
      
    it("Should fetch and display total drivers dynamically", () => {
        cy.window().then((win) => {
            const token = win.localStorage.getItem("token"); // Get token from localStorage
            cy.request({
              method: "GET",
              url: "http://localhost:5000/drivers/api/count",
              headers: {
                Authorization: `Bearer ${token}`, // Send token in request
              },
            }).then((response) => {
              expect(response.status).to.eq(200);
              const totalDrivers = response.body.totalDrivers; 
              cy.get(".box1 .number").should("contain", totalDrivers);
            });
          });
          
      });
      
  
    it("Should toggle between daily and monthly revenue", () => {
      cy.get(".view-toggle button").contains("Daily Revenue").click();
      cy.get(".view-toggle button").contains("Monthly Revenue").click();
    });
  });
  