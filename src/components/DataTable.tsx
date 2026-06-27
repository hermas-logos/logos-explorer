import { Table, Database, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { DataTableData, StudyProfile } from '../types';

interface DataTableProps {
  dataTableData: DataTableData;
  activeProfile: StudyProfile;
}

export default function DataTable({ dataTableData, activeProfile }: DataTableProps) {
  const headers = dataTableData.headers[activeProfile] || dataTableData.headers['academic_en'];
  const rows = dataTableData.rows;

  return (
    <div id="datatable-container" className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
        <h3 className="font-serif text-lg text-indigo-200 flex items-center gap-2">
          <Database size={18} className="text-indigo-400" />
          Cosmological Parameters & Tolerance Bounds
        </h3>
        <span className="text-xs font-mono text-neutral-400">Horizontal scroll support</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar border border-neutral-800/80 rounded-xl bg-neutral-950/40">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 font-mono text-[10px] md:text-xs uppercase tracking-wider">
              {headers.map((header, idx) => (
                <th key={idx} className="px-4 py-3 font-semibold first:pl-6 last:pr-6">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/60 font-sans text-xs md:text-sm text-neutral-300">
            {rows.map((row, idx) => {
              const constantName = row.constant[activeProfile] || row.constant['academic_en'];
              const toleranceLimit = row.tolerance[activeProfile] || row.tolerance['academic_en'];
              const implicationText = row.implication[activeProfile] || row.implication['academic_en'];

              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="hover:bg-neutral-900/30 transition-colors"
                >
                  {/* Constant Name */}
                  <td className="px-4 py-4 first:pl-6 font-medium text-neutral-200">
                    {constantName}
                  </td>
                  
                  {/* Symbol */}
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/50 border border-indigo-900/40 px-2 py-1 rounded">
                      {row.symbol}
                    </span>
                  </td>

                  {/* Precise Value */}
                  <td className="px-4 py-4 font-mono text-xs text-neutral-400">
                    {row.value}
                  </td>

                  {/* Tolerance Limit */}
                  <td className="px-4 py-4 font-mono text-xs text-rose-400/90 font-medium">
                    {toleranceLimit}
                  </td>

                  {/* Philosophical / Scientific Implication */}
                  <td className="px-4 py-4 last:pr-6 max-w-sm text-neutral-400 font-sans text-xs leading-relaxed">
                    {implicationText}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
