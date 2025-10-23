import React, { useState } from 'react';
import { Perda, CategoriaProduto, MotivoPerda } from '../types';
import { PlusIcon, ExportIcon } from './shared/icons';
import { exportToCSV } from './shared/export';
import EditLossModal from './EditLossModal';
import LossDetailsModal from './LossDetailsModal';

const mockLosses: Perda[] = [
  { id: '1', produto: 'Tomate Italiano', categoria: CategoriaProduto.HORTIFRUTI, motivo: MotivoPerda.VENCIMENTO, quantidade: 10, valorTotal: 50, responsavel: 'Loja', data: '2024-07-18' },
  { id: '2', produto: 'Pão Francês', categoria: CategoriaProduto.ALIMENTO, motivo: MotivoPerda.QUEBRA_OPERACIONAL, quantidade: 20, valorTotal: 15, responsavel: 'Loja', data: '2024-07-18' },
  { id: '3', produto: 'Leite Integral', categoria: CategoriaProduto.ALIMENTO, motivo: MotivoPerda.AVARIA, quantidade: 5, valorTotal: 25, responsavel: 'Transporte', fornecedorId: '1', data: '2024-07-17' },
  { id: '4', produto: 'Vinho Tinto', categoria: CategoriaProduto.BEBIDA, motivo: MotivoPerda.FURTO, quantidade: 1, valorTotal: 80, responsavel: 'Loja', data: '2024-07-16' },
];

const LossPage: React.FC = () => {
    const [losses, setLosses] = useState<Perda[]>(mockLosses);
    
    // State for Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [lossForEditing, setLossForEditing] = useState<Perda | null>(null);

    // State for Details Modal
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [lossForDetails, setLossForDetails] = useState<Perda | null>(null);

    const handleOpenDetails = (loss: Perda) => {
        setLossForDetails(loss);
        setIsDetailsModalOpen(true);
    };

    const handleOpenEdit = (loss: Perda) => {
        setLossForEditing(loss);
        setIsEditModalOpen(true);
    };

    const handleUpdateLoss = (updatedLoss: Perda) => {
        setLosses(currentLosses => 
            currentLosses.map(loss => (loss.id === updatedLoss.id ? updatedLoss : loss))
        );
        setIsEditModalOpen(false);
        setLossForEditing(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este registro?')) {
            setLosses(currentLosses => currentLosses.filter(loss => loss.id !== id));
        }
    };
    
    const handleExport = () => {
        exportToCSV(losses, 'perdas.csv');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Registro de Perdas</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center">
                        <ExportIcon className="w-5 h-5 mr-2" />
                        Exportar CSV
                    </button>
                    <button className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Registrar Perda
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-slate-200">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-slate-600">Produto</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Motivo</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Valor Total</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Responsável</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Data</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {losses.map(loss => (
                            <tr key={loss.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-3 font-medium text-slate-800">{loss.produto}</td>
                                <td className="p-3 text-slate-600">{loss.motivo}</td>
                                <td className="p-3 text-slate-600">R$ {loss.valorTotal.toFixed(2)}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    loss.responsavel === 'Loja' ? 'bg-blue-100 text-blue-800' : 
                                    loss.responsavel === 'Fornecedor' ? 'bg-purple-100 text-purple-800' : 
                                    'bg-orange-100 text-orange-800'
                                  }`}>
                                    {loss.responsavel}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-600">{new Date(loss.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                <td className="p-3">
                                    <button onClick={() => handleOpenDetails(loss)} className="text-sky-600 hover:underline mr-4">Detalhes</button>
                                    <button onClick={() => handleOpenEdit(loss)} className="text-yellow-600 hover:underline mr-4">Editar</button>
                                    <button onClick={() => handleDelete(loss.id)} className="text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {lossForEditing && (
                <EditLossModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setLossForEditing(null);
                    }}
                    lossData={lossForEditing}
                    onSave={handleUpdateLoss}
                />
            )}

            {lossForDetails && (
                <LossDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setLossForDetails(null);
                    }}
                    lossData={lossForDetails}
                />
            )}
        </div>
    );
};

export default LossPage;