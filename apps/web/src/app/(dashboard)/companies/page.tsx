'use client';

import { useState, useEffect } from 'react';
import { Company, companiesService } from '@/services/companies';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Trash2 } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    salary_range_min: '',
    salary_range_max: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      const data = await companiesService.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await companiesService.createCompany({
        name: formData.name,
        industry: formData.industry,
        salary_range_min: formData.salary_range_min ? Number(formData.salary_range_min) : undefined,
        salary_range_max: formData.salary_range_max ? Number(formData.salary_range_max) : undefined,
        technologies: [],
        benefits: []
      });
      setFormData({ name: '', industry: '', salary_range_min: '', salary_range_max: '' });
      setIsCreating(false);
      loadCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await companiesService.deleteCompany(id);
        loadCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  }

  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" />
          Empresas
        </h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {isCreating && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle>Cadastrar Nova Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Ex: Google" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Setor / Indústria</Label>
                  <Input 
                    value={formData.industry} 
                    onChange={e => setFormData({...formData, industry: e.target.value})} 
                    placeholder="Ex: Tecnologia" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salário Mínimo Estimado</Label>
                  <Input 
                    type="number"
                    value={formData.salary_range_min} 
                    onChange={e => setFormData({...formData, salary_range_min: e.target.value})} 
                    placeholder="Ex: 5000" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salário Máximo Estimado</Label>
                  <Input 
                    type="number"
                    value={formData.salary_range_max} 
                    onChange={e => setFormData({...formData, salary_range_max: e.target.value})} 
                    placeholder="Ex: 15000" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
                <Button type="submit">Salvar Empresa</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <Card key={company.id} className="group hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">{company.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{company.industry || 'Setor não informado'}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 text-destructive"
                onClick={() => handleDelete(company.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faixa Salarial:</span>
                  <span className="font-medium">
                    {company.salary_range_min ? `R$ ${company.salary_range_min}` : '-'} 
                    {' até '}
                    {company.salary_range_max ? `R$ ${company.salary_range_max}` : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {companies.length === 0 && !isCreating && (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
            Nenhuma empresa cadastrada ainda. Clique em "Nova Empresa" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
