
import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: { color: '#fff' }
        },
        tooltip: {
            backgroundColor: '#111',
            titleColor: '#fff',
            bodyColor: '#D4AF37',
            borderColor: '#333',
            borderWidth: 1,
        }
    },
    scales: {
        y: {
            grid: { color: '#222' },
            ticks: { color: '#666' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#666' }
        }
    }
};

export default function CustomerCharts({ customers = [] }) {

    // 1. Region Distribution
    const provinceData = useMemo(() => {
        const regionMap = {
            'Bangkok': 'กรุงเทพฯ',
            'Chiang Mai': 'ภาคเหนือ', 'Chiang Rai': 'ภาคเหนือ', 'Nan': 'ภาคเหนือ',
            'Khon Kaen': 'ภาคอีสาน', 'Nakhon Ratchasima': 'ภาคอีสาน', 'Udon Thani': 'ภาคอีสาน',
            'Phuket': 'ภาคใต้', 'Songkhla': 'ภาคใต้', 'Krabi': 'ภาคใต้',
            'Chon Buri': 'ภาคตะวันออก', 'Rayong': 'ภาคตะวันออก',
            'Kanchanaburi': 'ภาคตะวันตก', 'Ratchaburi': 'ภาคตะวันตก',
            'Ayutthaya': 'ภาคกลาง', 'Saraburi': 'ภาคกลาง', 'Nonthaburi': 'ภาคกลาง'
        };

        const counts = {
            'กรุงเทพฯ': 0, 'ภาคเหนือ': 0, 'ภาคกลาง': 0, 'ภาคอีสาน': 0,
            'ภาคตะวันออก': 0, 'ภาคตะวันตก': 0, 'ภาคใต้': 0
        };

        customers.forEach(c => {
            const region = regionMap[c.province] || 'Unknown';
            if (counts[region] !== undefined) counts[region]++;
        });

        const sorted = Object.entries(counts).filter(([k, v]) => v >= 0).sort((a, b) => b[1] - a[1]);

        return {
            labels: sorted.map(k => k[0]),
            datasets: [{
                label: 'Customers',
                data: sorted.map(k => k[1]),
                backgroundColor: sorted.map(k => k[0] === 'กรุงเทพฯ' ? '#D4AF37' : '#333'),
                borderColor: '#D4AF37',
                borderWidth: 1
            }]
        };
    }, [customers]);

    // 2. Verified vs Guest (Mock logic since we only have guests mainly)
    // Let's do Spend Tier instead: <10k, 10k-50k, >50k
    const spendTierData = useMemo(() => {
        let low = 0, mid = 0, high = 0;
        customers.forEach(c => {
            if (c.totalSpent > 100000) high++;
            else if (c.totalSpent > 30000) mid++;
            else low++;
        });

        return {
            labels: ['Starter (<30k)', 'Pro (30k-100k)', 'Whale (>100k)'],
            datasets: [{
                data: [low, mid, high],
                backgroundColor: ['#888', '#D4AF37', '#FFF'],
                borderColor: '#000',
                borderWidth: 2
            }]
        };
    }, [customers]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl h-[300px]">
                <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Top Locations</h3>
                <Bar options={options} data={provinceData} />
            </div>
            <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl h-[300px]">
                <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Customer Tiers</h3>
                <div className="h-[220px] flex justify-center">
                    <Doughnut data={spendTierData} options={{ ...options, scales: {}, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}
