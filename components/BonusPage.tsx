import React, { useState } from 'react';
import { Bonificacao, TipoBonificacao } from '../types';
import { PlusIcon, ExportIcon } from './shared/icons';
import { exportToCSV } from './shared/export';

const mockBonuses: Bonificacao[] = [
    { id: '1', fornecedorId: '1', tipo: TipoBonificacao.PRODUTO, valorTotal: 5000, dataNegociacao: '2024-07-01', status: 'Recebido', observacoes: 'Bonificação referente a compra de alto volume.' },
    { id: '2', fornecedorId: '2', tipo: TipoBonificacao.DESCONTO_NOTA, valorTotal: 1200, dataNegociacao: '2024-07-05', status: 'Recebido', observacoes: 'Desconto de 5% na nota fiscal #12345.' },
    { id: '3', fornecedorId: '1', tipo: TipoBonificacao.CREDITO, valorTotal: 800, dataNegociacao: '2024-07-10', status: 'Pendente', observacoes: 'Crédito para próxima compra.' },
];

const BonusPage: React.FC = () => {
    const [bonuses, setBonuses] = useState<Bonificacao[]>(mockBonuses);
    
    const handleExport = () => {
        exportToCSV(bonuses, 'bonificacoes.csv');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Gestão de Bonificações</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center">
                        <ExportIcon className="w-5 h-5 mr-2" />
                        Exportar CSV
                    </button>
                    <button className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nova Bonificação
                    </button>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-slate-200">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-slate-600">Fornecedor ID</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Tipo</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Valor Total</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Data Negociação</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Status</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bonuses.map(bonus => (
                            <tr key={bonus.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-3 font-medium text-slate-800">{bonus.fornecedorId}</td>
                                <td className="p-3 text-slate-600">{bonus.tipo}</td>
                                <td className="p-3 text-slate-600">R$ {bonus.valorTotal.toFixed(2)}</td>
                                <td className="p-3 text-slate-600">{new Date(bonus.dataNegociacao).toLocaleDateString('pt-BR')}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bonus.status === 'Recebido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {bonus.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button className="text-sky-600 hover:underline mr-4">Editar</button>
                                    <button className="text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BonusPage;