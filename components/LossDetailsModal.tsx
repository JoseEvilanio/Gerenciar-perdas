import React from 'react';
import { Perda } from '../types';
import { CloseIcon } from './shared/icons';

interface LossDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lossData: Perda | null;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row justify-between py-3 border-b border-slate-200">
    <dt className="font-semibold text-slate-600">{label}</dt>
    <dd className="text-slate-800 text-left sm:text-right">{value}</dd>
  </div>
);


const LossDetailsModal: React.FC<LossDetailsModalProps> = ({ isOpen, onClose, lossData }) => {
  if (!isOpen || !lossData) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lossDetailsModalTitle"
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <style>{`
          @keyframes fade-in-scale {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 0.3s forwards ease-out;
          }
        `}</style>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 id="lossDetailsModalTitle" className="text-xl font-bold text-slate-800">Detalhes da Perda</h2>
          <button onClick={onClose} aria-label="Fechar modal" className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
            <dl className="space-y-2">
                <DetailItem label="ID do Registro" value={lossData.id} />
                <DetailItem label="Produto" value={lossData.produto} />
                <DetailItem label="Categoria" value={lossData.categoria} />
                <DetailItem label="Motivo da Perda" value={lossData.motivo} />
                <DetailItem label="Quantidade" value={lossData.quantidade} />
                <DetailItem label="Valor Total" value={`R$ ${lossData.valorTotal.toFixed(2)}`} />
                <DetailItem label="Data da Ocorrência" value={new Date(lossData.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} />
                <DetailItem 
                    label="Responsável" 
                    value={
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            lossData.responsavel === 'Loja' ? 'bg-blue-100 text-blue-800' : 
                            lossData.responsavel === 'Fornecedor' ? 'bg-purple-100 text-purple-800' : 
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {lossData.responsavel}
                        </span>
                    } 
                />
                {lossData.responsavel === 'Fornecedor' && lossData.fornecedorId && (
                    <DetailItem label="Fornecedor ID" value={lossData.fornecedorId} />
                )}
            </dl>
        </div>
        <div className="flex justify-end p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-slate-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
              Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default LossDetailsModal;