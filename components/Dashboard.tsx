
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Card from './shared/Card';
import { BonusIcon, LossIcon, GondolaIcon, SupplierIcon } from './shared/icons';

const negotiationData = [
  { name: 'Jan', Negociações: 40, Ganhos: 2400 },
  { name: 'Fev', Negociações: 30, Ganhos: 1398 },
  { name: 'Mar', Negociações: 20, Ganhos: 9800 },
  { name: 'Abr', Negociações: 27, Ganhos: 3908 },
  { name: 'Mai', Negociações: 18, Ganhos: 4800 },
  { name: 'Jun', Negociações: 23, Ganhos: 3800 },
  { name: 'Jul', Negociações: 34, Ganhos: 4300 },
];

const supplierData = [
  { name: 'Fornecedor A', value: 400 },
  { name: 'Fornecedor B', value: 300 },
  { name: 'Fornecedor C', value: 300 },
  { name: 'Fornecedor D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        <Card title="Bonificações (Mês)" value="R$ 15.230" description="+12% vs. mês passado">
            <BonusIcon className="w-10 h-10" />
        </Card>
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        <Card title="Perdas (Mês)" value="R$ 1.890" description="-5% vs. mês passado">
            <LossIcon className="w-10 h-10" />
        </Card>
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        <Card title="Contratos Gôndola" value="28 Ativos" description="3 a vencer este mês">
            <GondolaIcon className="w-10 h-10" />
        </Card>
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        <Card title="Melhor Fornecedor" value="Ind. Alimentícia" description="Avaliação: 4.8/5">
            <SupplierIcon className="w-10 h-10" />
        </Card>
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Histórico de Negociações</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={negotiationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="Negociações" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="Ganhos" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Perdas por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: 'Hortifruti', Perdas: 4000 },
              { name: 'Padaria', Perdas: 3000 },
              { name: 'Lácteos', Perdas: 2000 },
              { name: 'Açougue', Perdas: 2780 },
              { name: 'Mercearia', Perdas: 1890 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${value}`} />
            <Legend />
            <Bar dataKey="Perdas" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Participação de Fornecedores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={supplierData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {supplierData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `R$ ${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
