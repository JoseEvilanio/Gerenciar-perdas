import React, { useState, useMemo } from 'react';
import { Negociacao } from '../types';
import { PlusIcon, ExportIcon } from './shared/icons';
import { exportToCSV } from './shared/export';

const mockNegotiations: Negociacao[] = [
  { id: '1', fornecedorId: '1', dataNegociacao: '2024-07-15', itensNegociados: 'Arroz, Feijão, Óleo', condicoesComerciais: 'Desconto de 5% no volume, prazo 30/60/90', resultado: 'Acordo fechado, economia de 8%', valorTotalGanho: 12000 },
  { id: '2', fornecedorId: '2', dataNegociacao: '2024-07-12', itensNegociados: 'Refrigerantes, Sucos', condicoesComerciais: 'Bonificação de 10 caixas a cada 100', resultado: 'Acordo fechado', valorTotalGanho: 3500 },
  { id: '3', fornecedorId: '3', dataNegociacao: '2024-07-10', itensNegociados: 'Detergente, Sabão em pó', condicoesComerciais: 'Aumento de 2%, sem contrapartida', resultado: 'Negociação não avançou', valorTotalGanho: 0 },
  { id: '4', fornecedorId: '4', dataNegociacao: '2024-07-08', itensNegociados: 'Carnes diversas', condicoesComerciais: 'Preço mantido, prazo estendido para 45 dias', resultado: 'Acordo fechado', valorTotalGanho: 8500 },
];

const NegotiationPage: React.FC = () => {
  const [negotiations, setNegotiations] = useState<Negociacao[]>(mockNegotiations);

  const maxGanho = useMemo(() => {
    const ganhos = negotiations.map(n => n.valorTotalGanho);
    return Math.max(...ganhos, 1); // Use 1 to avoid division by zero if all gains are 0
  }, [negotiations]);
  
  const handleExport = () => {
    exportToCSV(negotiations, 'negociacoes.csv');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Negociações</h2>
        <div className="flex items-center space-x-2">
            <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center">
                <ExportIcon className="w-5 h-5 mr-2" />
                Exportar CSV
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 flex items-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Nova Negociação
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {negotiations.map(neg => (
          <div key={neg.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-sky-700">Fornecedor ID: {neg.fornecedorId}</p>
                <p className="text-sm text-slate-500">Data: {new Date(neg.dataNegociacao).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${neg.valorTotalGanho > 0 ? 'text-green-600' : 'text-slate-700'}`}>
                    Ganho: R$ {neg.valorTotalGanho.toFixed(2)}
                </p>
                <p className={`text-sm font-semibold ${neg.valorTotalGanho > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {neg.resultado}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <p><strong className="text-slate-600">Itens Negociados:</strong> {neg.itensNegociados}</p>
              <p><strong className="text-slate-600">Condições:</strong> {neg.condicoesComerciais}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Resumo Visual de Ganhos</h3>
        <div className="space-y-4">
          {negotiations.map(neg => {
            const barWidth = maxGanho > 0 ? (neg.valorTotalGanho / maxGanho) * 100 : 0;
            const barColor = neg.valorTotalGanho > 0 ? 'bg-green-500' : 'bg-slate-300';
            
            return (
              <div key={`summary-${neg.id}`} aria-label={`Negociação com fornecedor ${neg.fornecedorId} com ganho de R$ ${neg.valorTotalGanho.toFixed(2)}`}>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    Fornecedor {neg.fornecedorId} ({new Date(neg.dataNegociacao).toLocaleDateString('pt-BR')})
                  </span>
                  <span className="font-bold text-slate-800">R$ {neg.valorTotalGanho.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4" role="progressbar" aria-valuenow={neg.valorTotalGanho} aria-valuemin={0} aria-valuemax={maxGanho}>
                  <div
                    className={`${barColor} h-4 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${barWidth}%` }}
                    title={`Ganho: R$ ${neg.valorTotalGanho.toFixed(2)}`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NegotiationPage;