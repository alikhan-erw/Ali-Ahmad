'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Globe, Shield, RefreshCw, UserCheck } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, users, switchUser, language, setLanguage, resetDemoData, navigate } =
    useStore();

  return (
    <aside aria-label="Role and System Controls" className="bg-stone-900 text-stone-200 text-xs border-b border-stone-800 py-1.5 px-4 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role Indicator & Quick Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-amber-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Active Persona / RBAC:</span>
          </span>
          <div className="flex items-center gap-1 bg-stone-800 p-0.5 rounded border border-stone-700">
            {users.map((u) => {
              const isActive = currentUser?.id === u.id;
              let roleBadge = 'Customer';
              if (u.role === 'ADMIN') roleBadge = 'Admin';
              if (u.role === 'EMPLOYEE') {
                if (u.permissions?.includes('inventory')) roleBadge = 'Warehouse';
                else if (u.permissions?.includes('orders')) roleBadge = 'Logistics';
                else roleBadge = 'Support';
              }

              return (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    if (u.role === 'ADMIN') navigate('admin');
                    else if (u.role === 'EMPLOYEE') navigate('employee');
                    else navigate('home');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                  }`}
                  title={`${u.name} (${u.role})`}
                >
                  {u.name.split(' ')[0]} ({roleBadge})
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick shortcuts, language toggle, and reset */}
        <div className="flex items-center gap-3">
          {/* Quick Panel jumps */}
          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('admin')}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Admin Console</span>
            </button>
          )}

          {currentUser?.role === 'EMPLOYEE' && (
            <button
              onClick={() => navigate('employee')}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              <span>Staff Workspace</span>
            </button>
          )}

          {/* Bilingual Language Switcher */}
          <div className="flex items-center gap-1 bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700">
            <Globe className="w-3 h-3 text-stone-400" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-1 text-[11px] rounded ${
                language === 'en' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-stone-600">/</span>
            <button
              onClick={() => setLanguage('ur')}
              className={`px-1 text-[11px] font-urdu rounded ${
                language === 'ur' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              اردو
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo orders, stock, and reviews to pristine defaults?')) {
                resetDemoData();
              }
            }}
            className="text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1"
            title="Reset to initial state"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
