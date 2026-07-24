import { api } from '@/lib/api';

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
    const json = await response.json();
    return json.data;
  },

  async getCompany(id: string): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    const json = await response.json();
    return json.data;
  },

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const response = await api.post('/companies', data);
    const json = await response.json();
    return json.data;
  },

  async updateCompany(id: string, data: Partial<CreateCompanyData>): Promise<Company> {
    const response = await api.fetch(`/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    const json = await response.json();
    return json.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  }
};
