import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { IAgency, ICreateAgency, IUpdateAgency } from '@/interface/agency/agencies.interface';
import { agencyService } from '@/services/Agencies/agencies.services';


export const useAgenciesStore = defineStore('agencies', () => {
  // State
  const agencies = ref<IAgency[]>([]);
  const loading = ref(false);
  const searchTerm = ref('');
  const filterByLocation = ref('');
  const filterBySize = ref('');
  const sortBy = ref('agencyName');

  // Computed properties
  const locations = computed(() => {
    const locs = agencies.value
      .map(agency => agency.location)
      .filter(Boolean) as string[];
    return [...new Set(locs)];
  });

  const sizes = computed(() => {
    return ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  });

  const totalAgencies = computed(() => agencies.value.length);

  const filteredAndSortedAgencies = computed(() => {
    let filtered = [...agencies.value];

    // Apply search filter
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      filtered = filtered.filter(agency => 
        agency.agencyName?.toLowerCase().includes(term) ||
        agency.tagline?.toLowerCase().includes(term) ||
        agency.location?.toLowerCase().includes(term) ||
        agency.slogan?.toLowerCase().includes(term)
      );
    }

    // Apply location filter
    if (filterByLocation.value) {
      filtered = filtered.filter(agency => agency.location === filterByLocation.value);
    }

    // Apply size filter
    if (filterBySize.value) {
      filtered = filtered.filter(agency => {
        const size = agency.companySize;
        if (!size) return false;
        
        const sizeNum = Number(size);
        const filterSize = filterBySize.value;
        
        if (filterSize === '1-10') return sizeNum >= 1 && sizeNum <= 10;
        if (filterSize === '11-50') return sizeNum >= 11 && sizeNum <= 50;
        if (filterSize === '51-200') return sizeNum >= 51 && sizeNum <= 200;
        if (filterSize === '201-500') return sizeNum >= 201 && sizeNum <= 500;
        if (filterSize === '501-1000') return sizeNum >= 501 && sizeNum <= 1000;
        if (filterSize === '1000+') return sizeNum > 1000;
        
        return false;
      });
    }

    // Apply sorting
    if (sortBy.value === 'agencyName') {
      filtered = [...filtered].sort((a, b) => 
        (a.agencyName || '').localeCompare(b.agencyName || '')
      );
    } else if (sortBy.value === 'rating') {
      filtered = [...filtered].sort((a, b) => {
        const ratingA = parseFloat(a.rating || '0');
        const ratingB = parseFloat(b.rating || '0');
        return ratingB - ratingA;
      });
    } else if (sortBy.value === 'budget') {
      filtered = [...filtered].sort((a, b) => {
        const budgetA = parseFloat(a.budget || '0');
        const budgetB = parseFloat(b.budget || '0');
        return budgetA - budgetB;
      });
    }

    return filtered;
  });

  // Actions
  const fetchAgencies = async () => {
    loading.value = true;
    try {
      agencies.value = await agencyService.getAllAgencies();
    } catch (error) {
      console.error('Error fetching agencies:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createAgency = async (agencyData: ICreateAgency) => {
    try {
      const newAgency = await agencyService.createAgency(agencyData);
      agencies.value.push(newAgency);
      return newAgency;
    } catch (error) {
      console.error('Error creating agency:', error);
      throw error;
    }
  };

  const updateAgency = async (guid: string, agencyData: IUpdateAgency) => {
    try {
      const updatedAgency = await agencyService.updateAgency(guid, agencyData);
      const index = agencies.value.findIndex(agency => agency.guid === guid);
      if (index !== -1) {
        agencies.value[index] = updatedAgency;
      }
      return updatedAgency;
    } catch (error) {
      console.error('Error updating agency:', error);
      throw error;
    }
  };

  const deleteAgency = async (guid: string) => {
    try {
      await agencyService.deleteAgency(guid);
      agencies.value = agencies.value.filter(agency => agency.guid !== guid);
    } catch (error) {
      console.error('Error deleting agency:', error);
      throw error;
    }
  };

  const resetFilters = () => {
    searchTerm.value = '';
    filterByLocation.value = '';
    filterBySize.value = '';
    sortBy.value = 'agencyName';
  };

    // Auto-save to localStorage for persistence across page reloads
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agencyModalData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          agencies.value = { ...agencies.value, ...parsed }
        } catch (error) {
          console.warn('Failed to load modal data from localStorage:', error)
        }
      }
    }
  }

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined' && agencies.value.length > 0) {
      localStorage.setItem('agencyModalData', JSON.stringify(agencies.value))
    }
  }

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agencyModalData')
    }
  }

  loadFromLocalStorage()

  return {
    // State
    agencies,
    loading,
    searchTerm,
    filterByLocation,
    filterBySize,
    sortBy,

    // Computed
    locations,
    sizes,
    totalAgencies,
    filteredAndSortedAgencies,

    // Actions
    loadFromLocalStorage,
    saveToLocalStorage,
    clearLocalStorage,
    fetchAgencies,
    createAgency,
    updateAgency,
    deleteAgency,
    resetFilters
  };
});