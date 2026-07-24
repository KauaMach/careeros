import api from './api';

export interface Company {
  id: string;
  name: string;
  industry?: string;
  benefits: string[];
  salary_range_min?: number;
  salary_range_max?: number;
  technologies: string[];
  created_at: string;
}

export interface CreateCompanyData {
  name: string;
  industry?: string;
  benefits?: string[];
  salary_range_min?: number;
  salary_range_max?: number;
  technologies?: string[];
}

export const companiesService = {
  async getCompanies(): Promise<Company[]> {
    const response = await api.get('/companies');
    return response.data.data;
  },

  async getCompany(id: string): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data.data;
  },

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const response = await api.post('/companies', data);
    return response.data.data;
  },

  async updateCompany(id: string, data: Partial<CreateCompanyData>): Promise<Company> {
    const response = await api.patch(`/companies/${id}`, data);
    return response.data.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  }
};
