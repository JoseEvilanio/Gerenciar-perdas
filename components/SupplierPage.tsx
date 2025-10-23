import React, { useState, useMemo } from 'react';
import { Fornecedor, CategoriaProduto } from '../types';
import { PlusIcon, ExportIcon } from './shared/icons';
import { exportToCSV } from './shared/export';
import AddSupplierModal from './AddSupplierModal';
import EditSupplierModal from './EditSupplierModal';

const mockSuppliers: Fornecedor[] = [
  { id: '1', nome: 'Indústria Alimentícia ABC', cnpj: '11.222.333/0001-44', contato: 'Carlos Silva', telefone: '(11) 98765-4321', categoria: CategoriaProduto.ALIMENTO, tipo: 'Indústria', dataInicioParceria: '2020-01-15', status: true, avaliacao: 5 },
  { id: '2', nome: 'Distribuidora de Bebidas XYZ', cnpj: '22.333.444/0001-55', contato: 'Ana Pereira', telefone: '(21) 91234-5678', categoria: CategoriaProduto.BEBIDA, tipo: 'Distribuidor', dataInicioParceria: '2019-05-20', status: true, avaliacao: 4 },
  { id: '3', nome: 'Limpeza Total Ltda', cnpj: '33.444.555/0001-66', contato: 'João Mendes', telefone: '(31) 95555-4444', categoria: CategoriaProduto.LIMPEZA, tipo: 'Indústria', dataInicioParceria: '2022-11-10', status: false, avaliacao: 3 },
  { id: '4', nome: 'Hortifruti Frescor da Terra', cnpj: '44.555.666/0001-77', contato: 'Mariana Costa', telefone: '(41) 98888-7777', categoria: CategoriaProduto.HORTIFRUTI, tipo: 'Distribuidor', dataInicioParceria: '2021-02-25', status: true, avaliacao: 4 },
  { id: '5', nome: 'Açougue Nobre Carnes', cnpj: '55.666.777/0001-88', contato: 'Ricardo Souza', telefone: '(51) 97777-6666', categoria: CategoriaProduto.ACOUGUE, tipo: 'Representante', dataInicioParceria: '2023-01-05', status: false, avaliacao: 2 },
];

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Fornecedor[]>(mockSuppliers);
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [supplierForEditing, setSupplierForEditing] = useState<Fornecedor | null>(null);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const nameMatch = supplier.nome.toLowerCase().includes(filterName.toLowerCase());
      const categoryMatch = filterCategory === 'all' || supplier.categoria === filterCategory;
      const statusMatch = filterStatus === 'all' || String(supplier.status) === filterStatus;
      return nameMatch && categoryMatch && statusMatch;
    });
  }, [suppliers, filterName, filterCategory, filterStatus]);
  
  const handleExport = () => {
    exportToCSV(filteredSuppliers, 'fornecedores.csv');
  };

  const handleAddSupplier = (newSupplierData: Omit<Fornecedor, 'id'>) => {
    const newSupplier: Fornecedor = {
      id: `${Date.now()}-${Math.random()}`, // Simple unique ID generation
      ...newSupplierData,
    };
    setSuppliers(prevSuppliers => [newSupplier, ...prevSuppliers]);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (supplier: Fornecedor) => {
    setSupplierForEditing(supplier);
    setIsEditModalOpen(true);
  };

  const handleUpdateSupplier = (updatedSupplier: Fornecedor) => {
    setSuppliers(currentSuppliers =>
      currentSuppliers.map(s => (s.id === updatedSupplier.id ? updatedSupplier : s))
    );
    setIsEditModalOpen(false);
    setSupplierForEditing(null);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.')) {
      setSuppliers(currentSuppliers => currentSuppliers.filter(s => s.id !== supplierId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Fornecedores</h2>
        <div className="flex items-center space-x-2">
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center">
            <ExportIcon className="w-5 h-5 mr-2" />
            Exportar CSV
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Fornecedor
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filterName" className="block text-sm font-medium text-slate-700">Filtrar por Nome</label>
            <input
              type="text"
              id="filterName"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              placeholder="Digite o nome do fornecedor..."
            />
          </div>
          <div>
            <label htmlFor="filterCategory" className="block text-sm font-medium text-slate-700">Filtrar por Categoria</label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            >
              <option value="all">Todas as Categorias</option>
              {Object.values(CategoriaProduto).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-slate-700">Filtrar por Status</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            >
              <option value="all">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-slate-200">
            <tr>
              <th className="p-3 text-sm font-semibold text-slate-600">Nome</th>
              <th className="p-3 text-sm font-semibold text-slate-600">CNPJ</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Categoria</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Avaliação</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Status</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map(supplier => (
                <tr key={supplier.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{supplier.nome}</td>
                  <td className="p-3 text-slate-600">{supplier.cnpj}</td>
                  <td className="p-3 text-slate-600">{supplier.categoria}</td>
                  <td className="p-3 text-slate-600">{'★'.repeat(supplier.avaliacao) + '☆'.repeat(5 - supplier.avaliacao)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${supplier.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {supplier.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleOpenEdit(supplier)} className="text-sky-600 hover:underline mr-4">Editar</button>
                    <button onClick={() => handleDeleteSupplier(supplier.id)} className="text-red-600 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  Nenhum fornecedor encontrado com os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSupplier}
      />

      {supplierForEditing && (
        <EditSupplierModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSupplierForEditing(null);
          }}
          supplierData={supplierForEditing}
          onSave={handleUpdateSupplier}
        />
      )}
    </div>
  );
};

export default SupplierPage;