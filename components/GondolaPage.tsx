import React, { useState, useMemo } from 'react';
import { PontoGondola } from '../types';
import { PlusIcon, ExportIcon } from './shared/icons';
import { exportToCSV } from './shared/export';

const mockGondolas: PontoGondola[] = [
  { id: '1', fornecedorId: '2', tipo: 'Ponta de gôndola', valorAcordado: 2000, contrapartida: 'Aumento de 10% no volume de compra', vigenciaInicio: '2024-07-01', vigenciaFim: '2024-07-31', status: 'Ativo' },
  { id: '2', fornecedorId: '1', tipo: 'Ilha', valorAcordado: 3500, contrapartida: 'Bonificação de 50 caixas de produto', vigenciaInicio: '2024-06-15', vigenciaFim: '2024-07-15', status: 'Ativo' },
  { id: '3', fornecedorId: '3', tipo: 'Checkout', valorAcordado: 1000, contrapartida: 'Pagamento em dinheiro', vigenciaInicio: '2024-05-01', vigenciaFim: '2024-05-31', status: 'Expirado' },
  { id: '4', fornecedorId: '1', tipo: 'Display', valorAcordado: 750, contrapartida: 'Exclusividade no display', vigenciaInicio: '2024-08-01', vigenciaFim: '2024-08-31', status: 'Ativo' },
];

const GondolaPage: React.FC = () => {
  const [gondolas, setGondolas] = useState<PontoGondola[]>(mockGondolas);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const filteredGondolas = useMemo(() => {
    return gondolas.filter(gondola => {
      const statusMatch = filterStatus === 'all' || gondola.status === filterStatus;

      if (!filterStartDate && !filterEndDate) {
        return statusMatch;
      }

      const gondolaStart = new Date(gondola.vigenciaInicio);
      const gondolaEnd = new Date(gondola.vigenciaFim);
      
      const filterStart = filterStartDate ? new Date(filterStartDate) : null;
      const filterEnd = filterEndDate ? new Date(filterEndDate) : null;

      // Adjust time to avoid off-by-one day issues with timezone
      if(filterStart) filterStart.setUTCHours(0,0,0,0);
      if(filterEnd) filterEnd.setUTCHours(23,59,59,999);
      
      const isOverlapping = 
        (!filterStart || gondolaEnd >= filterStart) &&
        (!filterEnd || gondolaStart <= filterEnd);

      return statusMatch && isOverlapping;
    });
  }, [gondolas, filterStatus, filterStartDate, filterEndDate]);


  const handleExport = () => {
    exportToCSV(filteredGondolas, 'pontos_de_gondola.csv');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Pontos de Gôndola</h2>
        <div className="flex items-center space-x-2">
            <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center">
                <ExportIcon className="w-5 h-5 mr-2" />
                Exportar CSV
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 flex items-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Novo Contrato
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-slate-700">Filtrar por Status</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            >
              <option value="all">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Expirado">Expirado</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStartDate" className="block text-sm font-medium text-slate-700">Vigência a partir de</label>
            <input
              type="date"
              id="filterStartDate"
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="filterEndDate" className="block text-sm font-medium text-slate-700">Vigência até</label>
            <input
              type="date"
              id="filterEndDate"
              value={filterEndDate}
              onChange={e => setFilterEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-slate-200">
            <tr>
              <th className="p-3 text-sm font-semibold text-slate-600">Fornecedor ID</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Tipo de Ponto</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Valor Acordado</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Vigência</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Status</th>
              <th className="p-3 text-sm font-semibold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredGondolas.length > 0 ? (
              filteredGondolas.map(gondola => (
                <tr key={gondola.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{gondola.fornecedorId}</td>
                  <td className="p-3 text-slate-600">{gondola.tipo}</td>
                  <td className="p-3 text-slate-600">R$ {gondola.valorAcordado.toFixed(2)}</td>
                  <td className="p-3 text-slate-600">
                    {new Date(gondola.vigenciaInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} - {new Date(gondola.vigenciaFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${gondola.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {gondola.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-sky-600 hover:underline mr-4">Editar</button>
                    <button className="text-red-600 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  Nenhum contrato encontrado com os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GondolaPage;
