'use client';

import { useState, useEffect } from 'react';
import { Certificate, certificatesService } from '@/services/certificates';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Plus, Trash2 } from 'lucide-react';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    hours: '',
    issue_date: '',
    category: ''
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  async function loadCertificates() {
    try {
      const data = await certificatesService.getCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await certificatesService.createCertificate({
        title: formData.title,
        institution: formData.institution,
        hours: formData.hours ? Number(formData.hours) : undefined,
        issue_date: formData.issue_date || undefined,
        category: formData.category
      });
      setFormData({ title: '', institution: '', hours: '', issue_date: '', category: '' });
      setIsCreating(false);
      loadCertificates();
    } catch (error) {
      console.error('Error creating certificate:', error);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este certificado?')) {
      try {
        await certificatesService.deleteCertificate(id);
        loadCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
      }
    }
  }

  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Award className="w-8 h-8 text-primary" />
          Certificados
        </h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Certificado
        </Button>
      </div>

      {isCreating && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle>Cadastrar Novo Certificado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Curso/Certificado</Label>
                  <Input 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Ex: AWS Certified Solutions Architect" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instituição</Label>
                  <Input 
                    required
                    value={formData.institution} 
                    onChange={e => setFormData({...formData, institution: e.target.value})} 
                    placeholder="Ex: Amazon Web Services" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carga Horária (horas)</Label>
                  <Input 
                    type="number"
                    value={formData.hours} 
                    onChange={e => setFormData({...formData, hours: e.target.value})} 
                    placeholder="Ex: 40" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    placeholder="Ex: Cloud Computing" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Data de Emissão</Label>
                  <Input 
                    type="date"
                    value={formData.issue_date} 
                    onChange={e => setFormData({...formData, issue_date: e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
                <Button type="submit">Salvar Certificado</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map(cert => (
          <Card key={cert.id} className="group hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg leading-tight">{cert.title}</CardTitle>
                <p className="text-sm font-medium text-primary mt-1">{cert.institution}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 text-destructive shrink-0"
                onClick={() => handleDelete(cert.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                {cert.category && <p>Categoria: <span className="text-foreground">{cert.category}</span></p>}
                {cert.hours && <p>Carga horária: <span className="text-foreground">{cert.hours}h</span></p>}
                {cert.issue_date && <p>Emitido em: <span className="text-foreground">{new Date(cert.issue_date).toLocaleDateString()}</span></p>}
              </div>
            </CardContent>
          </Card>
        ))}
        {certificates.length === 0 && !isCreating && (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
            Nenhum certificado cadastrado ainda. Clique em "Novo Certificado" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
