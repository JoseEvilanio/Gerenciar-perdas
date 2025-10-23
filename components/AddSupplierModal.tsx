import React, { useState } from 'react';
import { Fornecedor, CategoriaProduto } from '../types';
import { CloseIcon } from './shared/icons';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (supplier: Omit<Fornecedor, 'id'>) => void;
}

const initialFormData = {
  nome: '',
  cnpj: '',
  contato: '',
  telefone: '',
  categoria: CategoriaProduto.ALIMENTO,
  tipo: 'Indústria' as 'Indústria' | 'Distribuidor' | 'Representante',
  dataInicioParceria: '',
  status: true,
  avaliacao: 3,
};

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Omit<Fornecedor, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) {
    return null;
  }

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nome.trim()) newErrors.nome = 'O nome é obrigatório.';
    if (!formData.cnpj.trim()) {
        newErrors.cnpj = 'O CNPJ é obrigatório.';
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
        newErrors.cnpj = 'Formato de CNPJ inválido (XX.XXX.XXX/XXXX-XX).';
    }
    if (!formData.contato.trim()) newErrors.contato = 'O nome do contato é obrigatório.';
    if (!formData.telefone.trim()) newErrors.telefone = 'O telefone é obrigatório.';
    if (!formData.dataInicioParceria) newErrors.dataInicioParceria = 'A data de início da parceria é obrigatória.';
    else if (new Date(formData.dataInicioParceria) > new Date()) {
        newErrors.dataInicioParceria = 'A data não pode ser no futuro.';
    }
    if (formData.avaliacao < 1 || formData.avaliacao > 5) {
        newErrors.avaliacao = 'A avaliação deve ser entre 1 e 5.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | boolean = value;

    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'avaliacao') {
      processedValue = value === '' ? 0 : parseInt(value, 10);
    } else if (name === 'cnpj') {
        processedValue = value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
        setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd(formData);
      setFormData(initialFormData); // Reset form
      setErrors({});
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="addSupplierModalTitle"
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="addSupplierModalTitle" className="text-xl font-bold text-slate-800">Adicionar Novo Fornecedor</h2>
          <button onClick={onClose} aria-label="Fechar modal" className="text-slate-500 hover:text-slate-800">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Nome */}
            <div className="md:col-span-2">
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700">Nome do Fornecedor</label>
              <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm ${errors.nome ? 'border-red-500' : 'border-slate-300'}`} required />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>

            {/* CNPJ */}
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-slate-700">CNPJ</label>
              <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm ${errors.cnpj ? 'border-red-500' : 'border-slate-300'}`} required placeholder="XX.XXX.XXX/XXXX-XX" />
              {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-slate-700">Telefone</label>
              <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm ${errors.telefone ? 'border-red-500' : 'border-slate-300'}`} required />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
            </div>
            
            {/* Contato */}
            <div className="md:col-span-2">
              <label htmlFor="contato" className="block text-sm font-medium text-slate-700">Nome do Contato</label>
              <input type="text" name="contato" id="contato" value={formData.contato} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm ${errors.contato ? 'border-red-500' : 'border-slate-300'}`} required />
              {errors.contato && <p className="text-red-500 text-xs mt-1">{errors.contato}</p>}
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-slate-700">Categoria</label>
              <select name="categoria" id="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm">
                {Object.values(CategoriaProduto).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-slate-700">Tipo</label>
              <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm">
                <option value="Indústria">Indústria</option>
                <option value="Distribuidor">Distribuidor</option>
                <option value="Representante">Representante</option>
              </select>
            </div>
            
            {/* Data Início Parceria */}
            <div>
              <label htmlFor="dataInicioParceria" className="block text-sm font-medium text-slate-700">Início da Parceria</label>
              <input type="date" name="dataInicioParceria" id="dataInicioParceria" value={formData.dataInicioParceria} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm ${errors.dataInicioParceria ? 'border-red-500' : 'border-slate-300'}`} required />
              {errors.dataInicioParceria && <p className="text-red-500 text-xs mt-1">{errors.dataInicioParceria}</p>}
            </div>

            {/* Avaliação */}
            <div>
              <label htmlFor="avaliacao" className="block text-sm font-medium text-slate-700">Avaliação ({formData.avaliacao} de 5)</label>
              <input type="range" min="1" max="5" name="avaliacao" id="avaliacao" value={formData.avaliacao} onChange={handleChange} className="mt-2 block w-full" />
              {errors.avaliacao && <p className="text-red-500 text-xs mt-1">{errors.avaliacao}</p>}
            </div>
            
            {/* Status */}
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" name="status" id="status" checked={formData.status} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">Fornecedor Ativo</label>
            </div>

          </div>
          <div className="flex justify-end pt-6 mt-4 border-t">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-300 mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700">
              Adicionar Fornecedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
