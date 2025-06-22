const { insertAdmin } = require('../services/createAdminService');

(async () => {
  try {
    await insertAdmin();
    // You can add more logic here if needed
  } catch (error) {
    console.error('Failed to insert admin:', error);
  }
})();
