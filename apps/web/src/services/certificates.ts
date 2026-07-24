import { api } from '@/lib/api';

export interface Certificate {
  id: string;
  title: string;
  institution: string;
  hours?: number;
  issue_date?: string;
  expiry_date?: string;
  file_url?: string;
  category?: string;
  created_at: string;
}

export interface CreateCertificateData {
  title: string;
  institution: string;
  hours?: number;
  issue_date?: string;
  expiry_date?: string;
  file_url?: string;
  category?: string;
}

export const certificatesService = {
  async getCertificates(): Promise<Certificate[]> {
    const response = await api.get('/certificates');
    const json = await response.json();
    return json.data;
  },

  async getCertificate(id: string): Promise<Certificate> {
    const response = await api.get(`/certificates/${id}`);
    const json = await response.json();
    return json.data;
  },

  async createCertificate(data: CreateCertificateData): Promise<Certificate> {
    const response = await api.post('/certificates', data);
    const json = await response.json();
    return json.data;
  },

  async updateCertificate(id: string, data: Partial<CreateCertificateData>): Promise<Certificate> {
    const response = await api.fetch(`/certificates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    const json = await response.json();
    return json.data;
  },

  async deleteCertificate(id: string): Promise<void> {
    await api.delete(`/certificates/${id}`);
  }
};
