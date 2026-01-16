import apiClient from '../client';

/**
 * Get users with filters and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.email - Filter by email
 * @param {string} params.fullName - Filter by full name
 * @param {string} params.phone - Filter by phone
 * @param {string} params.role - Filter by role (CUSTOMER, ADMIN)
 * @param {string} params.status - Filter by status (ACTIVE, LOCKED)
 * @param {number} params.page - Page number (default: 0)
 * @param {number} params.size - Page size (default: 10)
 * @param {string} params.sortBy - Sort field (default: createdAt)
 * @param {string} params.sortDir - Sort direction (asc, desc)
 * @returns {Promise} - Returns paginated user data
 */
export const getUsers = async (params = {}) => {
  const response = await apiClient.get('/users/get-user', { params });
  return response;
};

export default {
  getUsers,
};
