// Test mock data loading
import { mockDataService } from './mockDataService';

// Test function
export const testMockData = async () => {
  try {
    console.log('Testing mock data service...');
    
    const tours = await mockDataService.getTours();
    console.log('Tours loaded:', tours);
    
    const categories = await mockDataService.getCategories();
    console.log('Categories loaded:', categories);
    
    const users = await mockDataService.getUsers();
    console.log('Users loaded:', users);
    
    return { tours, categories, users };
  } catch (error) {
    console.error('Error testing mock data:', error);
    return null;
  }
};

// Auto-test on import
testMockData();
