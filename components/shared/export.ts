// Função para escapar campos CSV para garantir que vírgulas e aspas dentro dos dados não quebrem o formato.
const escapeCSV = (field: any): string => {
    if (field === null || field === undefined) {
        return '';
    }
    const str = String(field);
    // Se o campo contiver vírgula, aspas duplas ou nova linha, envolva-o em aspas duplas.
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        // Escapa as aspas duplas existentes duplicando-as.
        const escapedStr = str.replace(/"/g, '""');
        return `"${escapedStr}"`;
    }
    return str;
};

export const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // linha de cabeçalho
        ...data.map(row => 
            headers.map(fieldName => escapeCSV(row[fieldName])).join(',')
        )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
