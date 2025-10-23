import React, { useState, useEffect } from 'react';
import { Perda, CategoriaProduto, MotivoPerda } from '../types';
import { CloseIcon } from './shared/icons';

interface EditLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  lossData: Perda;
  onSave: (updatedLoss: Perda) => void;
}

const EditLossModal: React.FC<EditLossModalProps> = ({ isOpen, onClose, lossData, onSave }) => {
  const [formData, setFormData] = useState<Perda>(lossData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(lossData);
    setErrors({}); // Limpa os erros ao abrir o modal ou mudar o item
  }, [lossData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = name === 'valorTotal' || name === 'quantidade';
    
    setFormData(prev => ({ 
        ...prev, 
        [name]: isNumeric ? (value === '' ? '' : parseFloat(value)) : value 
    }));

    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.produto.trim()) {
        newErrors.produto = 'O nome do produto é obrigatório.';
    }
    if (isNaN(formData.quantidade) || formData.quantidade <= 0) {
        newErrors.quantidade = 'A quantidade deve ser um número positivo.';
    }
    if (isNaN(formData.valorTotal) || formData.valorTotal <= 0) {
        newErrors.valorTotal = 'O valor total deve ser um número positivo.';
    }
    const todayString = new Date().toISOString().split('T')[0];
    if (formData.data > todayString) {
        newErrors.data = 'A data da ocorrência não pode ser no futuro.';
    }
    if (formData.responsavel === 'Fornecedor' && (!formData.fornecedorId || !formData.fornecedorId.trim())) {
        newErrors.fornecedorId = 'O ID do fornecedor é obrigatório quando ele é o responsável.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editLossModalTitle"
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="editLossModalTitle" className="text-xl font-bold text-slate-800">Editar Registro de Perda</h2>
          <button onClick={onClose} aria-label="Fechar modal" className="text-slate-500 hover:text-slate-800">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="produto" className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
              <input type="text" name="produto" id="produto" value={formData.produto} onChange={handleChange} className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm ${errors.produto ? 'border-red-500' : ''}`} required />
              {errors.produto && <p className="text-red-500 text-xs mt-1">{errors.produto}</p>}
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
              <select name="categoria" id="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" required>
                {Object.values(CategoriaProduto).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="motivo" className="block text-sm font-medium text-slate-700 mb-1">Motivo da Perda</label>
              <select name="motivo" id="motivo" value={formData.motivo} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" required>
                {Object.values(MotivoPerda).map(mot => <option key={mot} value={mot}>{mot}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="responsavel" className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
              <select name="responsavel" id="responsavel" value={formData.responsavel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" required>
                <option value="Loja">Loja</option>
                <option value="Fornecedor">Fornecedor</option>
                <option value="Transporte">Transporte</option>
              </select>
            </div>
            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
              <input type="number" name="quantidade" id="quantidade" value={formData.quantidade} onChange={handleChange} className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm ${errors.quantidade ? 'border-red-500' : ''}`} required min="0.01" step="any" />
              {errors.quantidade && <p className="text-red-500 text-xs mt-1">{errors.quantidade}</p>}
            </div>
            <div>
              <label htmlFor="valorTotal" className="block text-sm font-medium text-slate-700 mb-1">Valor Total (R$)</label>
              <input type="number" step="0.01" name="valorTotal" id="valorTotal" value={formData.valorTotal} onChange={handleChange} className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm ${errors.valorTotal ? 'border-red-500' : ''}`} required min="0.01" />
              {errors.valorTotal && <p className="text-red-500 text-xs mt-1">{errors.valorTotal}</p>}
            </div>
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-slate-700 mb-1">Data da Ocorrência</label>
              <input type="date" name="data" id="data" value={formData.data} onChange={handleChange} className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm ${errors.data ? 'border-red-500' : ''}`} required />
              {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data}</p>}
            </div>
            {formData.responsavel === 'Fornecedor' && (
              <div>
                <label htmlFor="fornecedorId" className="block text-sm font-medium text-slate-700 mb-1">Fornecedor ID</label>
                <input type="text" name="fornecedorId" id="fornecedorId" value={formData.fornecedorId || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm ${errors.fornecedorId ? 'border-red-500' : ''}`} />
                {errors.fornecedorId && <p className="text-red-500 text-xs mt-1">{errors.fornecedorId}</p>}
              </div>
            )}
          </div>
          <div className="flex justify-end pt-6 mt-6 border-t">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-300 mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLossModal;